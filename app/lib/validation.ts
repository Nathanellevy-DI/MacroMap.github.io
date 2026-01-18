export const sanitizeNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const n = Number(value);
    // basic check for NaN
    if (isNaN(n)) return 0;
    // ensure purely finite (no Infinity)
    if (!isFinite(n)) return 0;
    return n;
};

export const sanitizeString = (value: any): string => {
    if (!value) return "";
    return String(value).trim().replace(/[<>]/g, ""); // Basic XSS prevention for display
};
