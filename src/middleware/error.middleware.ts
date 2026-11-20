import type { NextFunction, Request, Response } from "express";
import { AppError, ValidationError } from "../errors/app.errors.ts";

export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        status: 404,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    });
}

export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void {
    if (error instanceof AppError) {
        const body: { status: number; message: string; details?: string[] } = {
            status: error.statusCode,
            message: error.message,
        };

        if (error instanceof ValidationError && error.details.length > 0) {
            body.details = error.details;
        }

        res.status(error.statusCode).json(body);
        return;
    }

    if (error instanceof SyntaxError && "body" in error) {
        res.status(400).json({
            status: 400,
            message: "El cuerpo de la solicitud no es un JSON válido.",
        });
        return;
    }

    console.error("Error no controlado:", error);
    res.status(500).json({
        status: 500,
        message: "Error interno del servidor.",
    });
}
