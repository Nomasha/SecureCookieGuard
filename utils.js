function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isJWT(value) {
    return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(value);
}

function isLongToken(value) {
    return /^[A-Za-z0-9\-_=.%]{20,}$/.test(value);
}

function isUUID(value) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
}

function detectSensitiveType(value) {
    if (!value || typeof value !== "string") return null;

    const trimmed = value.trim();

    if (isEmail(trimmed)) return "Email Address";
    if (isJWT(trimmed)) return "JWT Token";
    if (isUUID(trimmed)) return "Unique Identifier";
    if (isLongToken(trimmed)) return "Token / Secret-Like Value";

    return null;
}

function maskValue(value) {
    if (!value || value.length <= 8) {
        return "****";
    }

    return value.substring(0, 4) + "****" + value.substring(value.length - 4);
}