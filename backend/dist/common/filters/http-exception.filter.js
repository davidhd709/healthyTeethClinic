"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object') {
                const res = exceptionResponse;
                message = res.message || exception.message;
                error = res.error || this.getErrorName(statusCode);
            }
            error = error || this.getErrorName(statusCode);
        }
        else if (this.isMongooseValidationError(exception)) {
            statusCode = common_1.HttpStatus.BAD_REQUEST;
            error = 'Validation Error';
            const validationError = exception;
            const fieldMessages = [];
            for (const field of Object.keys(validationError.errors)) {
                fieldMessages.push(validationError.errors[field].message);
            }
            message = fieldMessages.length > 0 ? fieldMessages : 'Validation failed';
        }
        response.status(statusCode).json({
            statusCode,
            message,
            error,
            timestamp: new Date().toISOString(),
        });
    }
    isMongooseValidationError(exception) {
        return (exception !== null &&
            typeof exception === 'object' &&
            exception.name === 'ValidationError' &&
            typeof exception.errors === 'object');
    }
    getErrorName(statusCode) {
        const names = {
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            409: 'Conflict',
            422: 'Unprocessable Entity',
            500: 'Internal Server Error',
        };
        return names[statusCode] || 'Error';
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map