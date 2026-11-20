export class AppError extends Error {
    readonly statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
    }
}

export class ValidationError extends AppError {
    readonly details: string[];

    constructor(message: string, details: string[] = []) {
        super(message, 400);
        this.name = "ValidationError";
        this.details = details;
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Recurso no encontrado.") {
        super(message, 404);
        this.name = "NotFoundError";
    }
}
