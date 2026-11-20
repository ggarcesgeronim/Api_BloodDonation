import type { Request, Response } from "express";
import { bloodRequestService } from "../services/bloodRequest.service.ts";
import {
    bloodRequestFilterSchema,
    parseId,
    parseWith,
} from "../services/blood.validators.ts";

export const bloodRequestController = {
    async create(req: Request, res: Response): Promise<void> {
        const request = await bloodRequestService.create(req.body);

        res.status(201).json({ status: 201, data: request });
    },

    async list(req: Request, res: Response): Promise<void> {
        const filter = parseWith(bloodRequestFilterSchema, req.query);
        const requests = await bloodRequestService.list(filter);

        res.status(200).json({
            status: 200,
            count: requests.length,
            data: requests,
        });
    },

    async getById(req: Request, res: Response): Promise<void> {
        const request = await bloodRequestService.getById(parseId(req.params.id));

        res.status(200).json({ status: 200, data: request });
    },

    async update(req: Request, res: Response): Promise<void> {
        const request = await bloodRequestService.update(
            parseId(req.params.id),
            req.body,
        );

        res.status(200).json({ status: 200, data: request });
    },

    async remove(req: Request, res: Response): Promise<void> {
        await bloodRequestService.remove(parseId(req.params.id));

        res.status(204).send();
    },

    async getCompatibleDonors(req: Request, res: Response): Promise<void> {
        const donors = await bloodRequestService.getCompatibleDonors(
            parseId(req.params.id),
        );

        res.status(200).json({
            status: 200,
            count: donors.length,
            data: donors,
        });
    },
};
