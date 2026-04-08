"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDateOnly = parseDateOnly;
exports.endOfDay = endOfDay;
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
function parseDateOnly(value) {
    if (!DATE_ONLY_REGEX.test(value))
        return null;
    const [yearRaw, monthRaw, dayRaw] = value.split('-');
    const year = Number(yearRaw);
    const month = Number(monthRaw);
    const day = Number(dayRaw);
    const parsed = new Date(year, month - 1, day, 0, 0, 0, 0);
    if (parsed.getFullYear() !== year ||
        parsed.getMonth() !== month - 1 ||
        parsed.getDate() !== day) {
        return null;
    }
    return parsed;
}
function endOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}
//# sourceMappingURL=date.util.js.map