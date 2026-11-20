import { NotFoundError } from "../../../errors/app.errors.ts";
import type {
    Donor,
    DonorFilter,
    FindCompatibleDonorsOptions,
} from "../interfaces/donor.interface.ts";
import { donorRepository } from "../repositories/donor.repository.ts";
import type { CreateDonor, UpdateDonor } from "../types/donor.type.ts";
import {
    createDonorSchema,
    parseBloodType,
    parseWith,
    updateDonorSchema,
} from "./blood.validators.ts";

export class DonorService {
    async create(data: CreateDonor): Promise<Donor> {
        return donorRepository.create(parseWith(createDonorSchema, data));
    }

    async list(filter: DonorFilter = {}): Promise<Donor[]> {
        return donorRepository.findAll(filter);
    }

    async getById(id: string): Promise<Donor> {
        const donor = await donorRepository.findById(id);
        if (!donor) {
            throw new NotFoundError(`No se encontró el donante con id "${id}".`);
        }
        return donor;
    }

    async update(id: string, data: UpdateDonor): Promise<Donor> {
        const donor = await donorRepository.update(
            id,
            parseWith(updateDonorSchema, data),
        );
        if (!donor) {
            throw new NotFoundError(`No se encontró el donante con id "${id}".`);
        }
        return donor;
    }

    async remove(id: string): Promise<void> {
        const removed = await donorRepository.delete(id);
        if (!removed) {
            throw new NotFoundError(`No se encontró el donante con id "${id}".`);
        }
    }

    /** Devuelve los donantes compatibles con el tipo de sangre del receptor. */
    async findCompatible(
        recipientType: string,
        options: FindCompatibleDonorsOptions = {},
    ): Promise<Donor[]> {
        return donorRepository.findCompatible(parseBloodType(recipientType), options);
    }

    async count(filter: DonorFilter = {}): Promise<number> {
        return donorRepository.count(filter);
    }
}

export const donorService = new DonorService();
