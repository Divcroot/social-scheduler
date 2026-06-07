import { Request, Response, NextFunction } from "express";

const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(err);

    const rawStatus = Number(err?.statusCode);
    const statusCode = Number.isInteger(rawStatus) && rawStatus >= 400 && rawStatus <= 599 ? rawStatus : 500;

    const isDev = process.env.NODE_ENV === "development";
    res.status(statusCode).json({
        success: false,
        message: isDev ? (err?.message ?? "Internal Server Error") : "Internal Server Error",
    });
};

export default errorHandler;