import { NotFoundError } from "../../../errors/app.errors.ts";
import type {
    BloodRequest,
    BloodRequestFilter,
} from "../interfaces/bloodRequest.interface.ts";
import type { Donor } from "../interfaces/donor.interface.ts";
import { bloodRequestRepository } from "../repositories/bloodRequest.repository.ts";
import { donorRepository } from "../repositories/donor.repository.ts";
import type {
    CreateBloodRequest,
    UpdateBloodRequest,
} from "../types/bloodRequest.type.ts";
import {
    createBloodRequestSchema,
    parseWith,
    updateBloodRequestSchema,
} from "./blood.validators.ts";

export class BloodRequestService {
    async create(data: CreateBloodRequest): Promise<BloodRequest> {
        return bloodRequestRepository.create(
            parseWith(createBloodRequestSchema, data),
        );
    }

    async list(filter: BloodRequestFilter = {}): Promise<BloodRequest[]> {
        return bloodRequestRepository.findAll(filter);
    }

    async getById(id: string): Promise<BloodRequest> {
        const request = await bloodRequestRepository.findById(id);
        if (!request) {
            throw new NotFoundError(`No se encontró la solicitud con id "${id}".`);
        }
        return request;
    }

    async update(id: string, data: UpdateBloodRequest): Promise<BloodRequest> {
        const request = await bloodRequestRepository.update(
            id,
            parseWith(updateBloodRequestSchema, data),
        );
        if (!request) {
            throw new NotFoundError(`No se encontró la solicitud con id "${id}".`);
        }
        return request;
    }

    async remove(id: string): Promise<void> {
        const removed = await bloodRequestRepository.delete(id);
        if (!removed) {
            throw new NotFoundError(`No se encontró la solicitud con id "${id}".`);
        }
    }

    /** Devuelve los donantes disponibles cuyo tipo de sangre sirve para la solicitud. */
    async getCompatibleDonors(id: string): Promise<Donor[]> {
        const request = await this.getById(id);
        return donorRepository.findCompatible(request.bloodType);
    }

    async count(filter: BloodRequestFilter = {}): Promise<number> {
        return bloodRequestRepository.count(filter);
    }
}

export const bloodRequestService = new BloodRequestService();
