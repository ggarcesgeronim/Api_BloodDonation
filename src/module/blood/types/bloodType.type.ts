export const BLOOD_TYPES = [
    "O-",
    "O+",
    "A-",
    "A+",
    "B-",
    "B+",
    "AB-",
    "AB+",
] as const;

export type BloodType = (typeof BLOOD_TYPES)[number];

export function isBloodType(value: unknown): value is BloodType {
    return typeof value === "string" && (BLOOD_TYPES as readonly string[]).includes(value);
}
