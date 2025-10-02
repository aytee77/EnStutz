const allowedOrigins = [
    "http://localhost:4200",
    "https://enstutz-557c9.web.app"
];

export const getCorsHeaders = (origin: string | undefined) => {
    const headers: Record<string, string> = {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    if (origin && allowedOrigins.includes(origin)) {
        headers["Access-Control-Allow-Origin"] = origin;
    }

    return headers;
};
