import logging
from enum import Enum
from typing import Any, List, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

logger = logging.getLogger("smart_job_hunter")


class ErrorCode(str, Enum):
    VALIDATION_ERROR = "VALIDATION_ERROR"
    AUTHENTICATION_REQUIRED = "AUTHENTICATION_REQUIRED"
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
    TOKEN_INVALID = "TOKEN_INVALID"
    TOKEN_EXPIRED = "TOKEN_EXPIRED"
    FORBIDDEN = "FORBIDDEN"
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND"
    CONFLICT = "CONFLICT"
    UPLOAD_INVALID = "UPLOAD_INVALID"
    UPLOAD_TOO_LARGE = "UPLOAD_TOO_LARGE"
    UNSUPPORTED_FILE_TYPE = "UNSUPPORTED_FILE_TYPE"
    INVALID_FILE_CONTENT = "INVALID_FILE_CONTENT"
    PROCESSING_ERROR = "PROCESSING_ERROR"
    DATABASE_ERROR = "DATABASE_ERROR"
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"


class ErrorDetail(BaseModel):
    field: Optional[str] = None
    message: str


class StandardErrorBody(BaseModel):
    code: str
    message: str
    details: Optional[List[ErrorDetail]] = None


class StandardErrorResponse(BaseModel):
    detail: str
    error: StandardErrorBody


class APIException(HTTPException):
    """Custom API Exception for raised structured errors."""
    def __init__(
        self,
        status_code: int,
        code: ErrorCode,
        message: str,
        details: Optional[List[Any]] = None,
        headers: Optional[dict] = None
    ):
        super().__init__(status_code=status_code, detail=message, headers=headers)
        self.code = code
        self.message = message
        self.details = details


def _map_http_status_to_code(status_code: int, detail: str) -> str:
    """Helper to map standard HTTP status codes and detail text to canonical ErrorCode string."""
    detail_lower = str(detail).lower()
    
    if status_code == 401:
        if "incorrect email or password" in detail_lower:
            return ErrorCode.INVALID_CREDENTIALS.value
        elif "not authenticated" in detail_lower:
            return ErrorCode.AUTHENTICATION_REQUIRED.value
        return ErrorCode.TOKEN_INVALID.value
    elif status_code == 400:
        if "email already registered" in detail_lower:
            return ErrorCode.CONFLICT.value
        elif "extension" in detail_lower or "unsupported" in detail_lower:
            return ErrorCode.UNSUPPORTED_FILE_TYPE.value
        elif "mime" in detail_lower or "encoding" in detail_lower or "corrupt" in detail_lower:
            return ErrorCode.INVALID_FILE_CONTENT.value
        elif "file" in detail_lower or "upload" in detail_lower:
            return ErrorCode.UPLOAD_INVALID.value
        return ErrorCode.VALIDATION_ERROR.value
    elif status_code == 404:
        return ErrorCode.RESOURCE_NOT_FOUND.value
    elif status_code == 403:
        return ErrorCode.FORBIDDEN.value
    elif status_code == 413:
        return ErrorCode.UPLOAD_TOO_LARGE.value
    elif status_code == 422:
        return ErrorCode.VALIDATION_ERROR.value
    elif status_code == 409:
        return ErrorCode.CONFLICT.value
    elif status_code >= 500:
        return ErrorCode.INTERNAL_SERVER_ERROR.value
    
    return ErrorCode.PROCESSING_ERROR.value


def register_exception_handlers(app: FastAPI) -> None:
    """Registers global exception handlers on the FastAPI application."""

    @app.exception_handler(APIException)
    async def api_exception_handler(request: Request, exc: APIException):
        content = {
            "detail": exc.message,
            "error": {
                "code": exc.code.value if isinstance(exc.code, Enum) else str(exc.code),
                "message": exc.message,
                "details": [d.model_dump() if hasattr(d, "model_dump") else d for d in exc.details] if exc.details else None
            }
        }
        return JSONResponse(status_code=exc.status_code, content=content, headers=exc.headers)

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        detail_msg = str(exc.detail) if exc.detail else "An error occurred"
        code_str = _map_http_status_to_code(exc.status_code, detail_msg)
        
        content = {
            "detail": detail_msg,
            "error": {
                "code": code_str,
                "message": detail_msg,
                "details": None
            }
        }
        return JSONResponse(status_code=exc.status_code, content=content, headers=exc.headers)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        details_list = []
        for err in exc.errors():
            loc_parts = [str(x) for x in err.get("loc", []) if x not in ("body", "query", "path")]
            field_name = " -> ".join(loc_parts) if loc_parts else "body"
            msg = err.get("msg", "Invalid value")
            details_list.append({"field": field_name, "message": msg})
        
        main_msg = "Request validation error: invalid fields provided"
        content = {
            "detail": main_msg,
            "error": {
                "code": ErrorCode.VALIDATION_ERROR.value,
                "message": main_msg,
                "details": details_list
            }
        }
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content=content)

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        # Log the full exception server-side safely
        logger.exception(f"Unhandled exception during request processing path={request.url.path}: {exc}")
        
        safe_msg = "An unexpected server error occurred."
        content = {
            "detail": safe_msg,
            "error": {
                "code": ErrorCode.INTERNAL_SERVER_ERROR.value,
                "message": safe_msg,
                "details": None
            }
        }
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=content)
