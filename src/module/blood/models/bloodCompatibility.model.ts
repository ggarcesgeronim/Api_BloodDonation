import { isBloodType, type BloodType } from "../types/bloodType.type.ts";

const COMPATIBILITY_MAP: Record<BloodType, readonly BloodType[]> = {
    "O-": ["O-"],
    "O+": ["O-", "O+"],
    "A-": ["O-", "A-"],
    "A+": ["O-", "O+", "A-", "A+"],
    "B-": ["O-", "B-"],
    "B+": ["O-", "O+", "B-", "B+"],
    "AB-": ["O-", "A-", "B-", "AB-"],
    "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

export class BloodCompatibility {
    /** Dado el tipo de sangre del receptor, devuelve qué tipos de donantes le sirven. */
    static getCompatibleDonors(recipientType: string): BloodType[] {
        if (!isBloodType(recipientType)) return [];
        return [...COMPATIBILITY_MAP[recipientType]];
    }
}
