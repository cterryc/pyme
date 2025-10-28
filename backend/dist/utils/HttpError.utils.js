"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents an HTTP error with a status code and message.
 */
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "HttpError";
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        }
    }
}
exports.default = HttpError;
//# sourceMappingURL=HttpError.utils.js.map