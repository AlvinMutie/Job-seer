import os
import uuid
import shutil
import logging
from typing import Optional
from fastapi import UploadFile, HTTPException, status

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB in bytes


def validate_upload_file(file: UploadFile) -> str:
    """
    Validates file extension, total size limit (10MB), and binary signature/UTF-8 encoding.
    Raises HTTPException 400 Bad Request or 413 Request Entity Too Large on validation failure.
    Returns lowercased extension.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename cannot be empty"
        )

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file extension '{ext}'. Allowed extensions are: .pdf, .docx, .txt"
        )

    # Read header chunk for format verification
    header = file.file.read(2048)

    # Check file size by seeking to end
    file.file.seek(0, os.SEEK_END)
    size = file.file.tell()
    file.file.seek(0)

    if size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes)"
        )

    if size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"File size exceeds maximum allowed limit of 10MB ({size} bytes)"
        )

    # Format verification: MIME magic bytes for binary formats, UTF-8 decodability for text
    if ext == ".pdf":
        if not header.startswith(b"%PDF-"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File content signature (MIME magic bytes) does not match valid PDF format"
            )
    elif ext == ".docx":
        if not header.startswith(b"PK\x03\x04"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File content signature (MIME magic bytes) does not match valid DOCX format"
            )
    elif ext == ".txt":
        try:
            header.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File content does not contain valid text/UTF-8 encoding"
            )

    return ext


def save_user_resume(
    file: UploadFile,
    user_id: int,
    old_resume_path: Optional[str] = None,
    upload_dir: str = "uploads"
) -> str:
    """
    Saves uploaded resume using a server-generated UUID filename to prevent path traversal.
    Deletes previous resume file if it exists.
    """
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir, exist_ok=True)

    # Delete previous resume file if present
    if old_resume_path and os.path.isfile(old_resume_path):
        try:
            os.remove(old_resume_path)
        except Exception as e:
            logging.warning(f"Could not remove old resume file {old_resume_path}: {e}")

    ext = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"resume_{user_id}_{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(upload_dir, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_path
