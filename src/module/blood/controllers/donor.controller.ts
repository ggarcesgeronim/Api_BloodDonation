import type { Request, Response } from "express";
import { donorService } from "../services/donor.service.ts";
import {
    compatibleDonorsQuerySchema,
    donorFilterSchema,
    parseId,
    parseWith,
} from "../services/blood.validators.ts";

export const donorController = {
    async create(req: Request, res: Response): Promise<void> {
        const donor = await donorService.create(req.body);

        res.status(201).json({ status: 201, data: donor });
    },

    async list(req: Request, res: Response): Promise<void> {
        const filter = parseWith(donorFilterSchema, req.query);
        const donors = await donorService.list(filter);

        res.status(200).json({
            status: 200,
            count: donors.length,
            data: donors,
        });
    },

    async findCompatible(req: Request, res: Response): Promise<void> {
        const query = parseWith(compatibleDonorsQuerySchema, req.query);
        const donors = await donorService.findCompatible(query.recipientType, {
            onlyAvailable: query.onlyAvailable,
            city: query.city,
        });

        res.status(200).json({
            status: 200,
            count: donors.length,
            data: donors,
        });
    },

    async getById(req: Request, res: Response): Promise<void> {
        const donor = await donorService.getById(parseId(req.params.id));

        res.status(200).json({ status: 200, data: donor });
    },

    async update(req: Request, res: Response): Promise<void> {
        const donor = await donorService.update(parseId(req.params.id), req.body);

        res.status(200).json({ status: 200, data: donor });
    },

    async remove(req: Request, res: Response): Promise<void> {
        await donorService.remove(parseId(req.params.id));

        res.status(204).send();
    },
};
