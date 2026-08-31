import test from 'node:test';
import assert from 'node:assert/strict';
import { getApiErrorMessage } from './api.js';

test('getApiErrorMessage - extracts standardized error message (P2-01 format)', () => {
    const error = {
        response: {
            status: 404,
            data: {
                detail: "Resource not found detail fallback",
                error: {
                    code: "RESOURCE_NOT_FOUND",
                    message: "Specific job listing was not found.",
                    details: null
                }
            }
        }
    };
    const result = getApiErrorMessage(error);
    assert.equal(result, "Specific job listing was not found.");
});

test('getApiErrorMessage - extracts structured validation error details', () => {
    const error = {
        response: {
            status: 422,
            data: {
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Validation failed",
                    details: [
                        { field: "email", message: "field required" },
                        { field: "password", message: "must be at least 8 characters" }
                    ]
                }
            }
        }
    };
    const result = getApiErrorMessage(error);
    assert.equal(result, "Validation failed");
});

test('getApiErrorMessage - falls back to legacy detail string', () => {
    const error = {
        response: {
            status: 400,
            data: {
                detail: "Invalid credentials provided"
            }
        }
    };
    const result = getApiErrorMessage(error);
    assert.equal(result, "Invalid credentials provided");
});

test('getApiErrorMessage - handles network offline errors cleanly', () => {
    const error = {
        code: 'ERR_NETWORK'
    };
    const result = getApiErrorMessage(error);
    assert.equal(result, "Unable to connect to the server. Please check your connection and try again.");
});

test('getApiErrorMessage - handles status code 413 upload limit fallback', () => {
    const error = {
        response: {
            status: 413,
            data: {}
        }
    };
    const result = getApiErrorMessage(error);
    assert.equal(result, "File size exceeds maximum allowed limit of 10MB.");
});

test('getApiErrorMessage - handles null or undefined errors safely', () => {
    assert.equal(getApiErrorMessage(null), "An unknown error occurred.");
    assert.equal(getApiErrorMessage(undefined), "An unknown error occurred.");
});
