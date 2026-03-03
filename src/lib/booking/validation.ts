/**
 * Ukrainian phone number regex: +380XXXXXXXXX (9 digits after +380)
 */
const UA_PHONE_REGEX = /^\+380\d{9}$/;

export function validatePhone(phone: string): boolean {
    return UA_PHONE_REGEX.test(phone.replace(/\s/g, ""));
}

export function formatPhoneForDisplay(phone: string): string {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.length === 13 && cleaned.startsWith("+380")) {
        const code = cleaned.slice(4, 6);
        const part1 = cleaned.slice(6, 9);
        const part2 = cleaned.slice(9, 11);
        const part3 = cleaned.slice(11, 13);
        return `+380 ${code} ${part1} ${part2} ${part3}`;
    }
    return phone;
}

export function validateName(name: string): boolean {
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 100;
}
