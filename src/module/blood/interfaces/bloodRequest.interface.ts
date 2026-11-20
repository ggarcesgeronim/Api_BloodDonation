import type { ObjectId } from "mongodb";
import type { BloodType } from "../types/bloodType.type.ts";
import type { Mutable } from "../types/mutable.type.ts";

export interface BloodRequest {
    readonly id: string;
    readonly patientName: string;
    readonly bloodType: BloodType;
    readonly hospital: string;
    readonly city: string;
    readonly distanceKm: number;
    readonly unitsNeeded: number;
    readonly isUrgent: boolean;
    readonly timeAgo: string;
}

export interface BloodRequestFilter {
    isUrgent?: boolean | undefined;
    city?: string | undefined;
    bloodType?: BloodType | undefined;
}

/** Documento tal como se almacena en la colección de MongoDB. */
export interface BloodRequestDocument extends Mutable<Omit<BloodRequest, "id">> {
    _id?: ObjectId;
}
