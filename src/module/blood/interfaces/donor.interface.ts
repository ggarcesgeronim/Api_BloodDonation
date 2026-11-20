import type { ObjectId } from "mongodb";
import type { BloodType } from "../types/bloodType.type.ts";
import type { Mutable } from "../types/mutable.type.ts";

export interface Donor {
    readonly id: string;
    readonly name: string;
    readonly bloodType: BloodType;
    readonly city: string;
    readonly distanceKm: number;
    readonly donationsCount: number;
    readonly isAvailable: boolean;
    readonly phone: string;
}

export interface DonorFilter {
    isAvailable?: boolean | undefined;
    city?: string | undefined;
    bloodType?: BloodType | undefined;
}

export interface FindCompatibleDonorsOptions {
    /** Por defecto solo devuelve donantes disponibles. */
    onlyAvailable?: boolean | undefined;
    city?: string | undefined;
}

/** Documento tal como se almacena en la colección de MongoDB. */
export interface DonorDocument extends Mutable<Omit<Donor, "id">> {
    _id?: ObjectId;
}
