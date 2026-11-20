import {
    type Collection,
    type Filter,
    type UpdateFilter,
    type WithId,
} from "mongodb";
import { DONORS_COLLECTION } from "../../../const/const.ts";
import getMongoDb from "../../../db/mongo.db.ts";
import type {
    Donor,
    DonorDocument,
    DonorFilter,
    FindCompatibleDonorsOptions,
} from "../interfaces/donor.interface.ts";
import { BloodCompatibility } from "../models/bloodCompatibility.model.ts";
import type { CreateDonor, UpdateDonor } from "../types/donor.type.ts";
import { parseObjectId, withoutUndefined } from "./mongo.helpers.ts";

function toDonor({ _id, ...document }: WithId<DonorDocument>): Donor {
    return { id: _id.toHexString(), ...document };
}

function buildFilter(filter: DonorFilter): Filter<DonorDocument> {
    const query: Filter<DonorDocument> = {};

    if (filter.isAvailable !== undefined) query.isAvailable = filter.isAvailable;
    if (filter.city !== undefined) query.city = filter.city;
    if (filter.bloodType !== undefined) query.bloodType = filter.bloodType;

    return query;
}

export class DonorRepository {
    private async collection(): Promise<Collection<DonorDocument>> {
        const db = await getMongoDb();
        return db.collection<DonorDocument>(DONORS_COLLECTION);
    }

    async create(data: CreateDonor): Promise<Donor> {
        const collection = await this.collection();
        const document: Omit<Donor, "id"> = {
            ...data,
            donationsCount: data.donationsCount ?? 0,
        };

        const result = await collection.insertOne({ ...document });

        return { id: result.insertedId.toHexString(), ...document };
    }

    async findAll(filter: DonorFilter = {}): Promise<Donor[]> {
        const collection = await this.collection();

        const documents = await collection
            .find(buildFilter(filter))
            .sort({ isAvailable: -1, distanceKm: 1 })
            .toArray();

        return documents.map(toDonor);
    }

    async findById(id: string): Promise<Donor | null> {
        const _id = parseObjectId(id);
        if (!_id) return null;

        const collection = await this.collection();
        const document = await collection.findOne({ _id });

        return document ? toDonor(document) : null;
    }

    /** Devuelve los donantes cuyo tipo de sangre sirve para el receptor indicado. */
    async findCompatible(
        recipientType: string,
        options: FindCompatibleDonorsOptions = {},
    ): Promise<Donor[]> {
        const compatibleTypes = BloodCompatibility.getCompatibleDonors(recipientType);
        if (compatibleTypes.length === 0) return [];

        const query: Filter<DonorDocument> = {
            bloodType: { $in: compatibleTypes },
        };

        if (options.onlyAvailable ?? true) query.isAvailable = true;
        if (options.city !== undefined) query.city = options.city;

        const collection = await this.collection();
        const documents = await collection
            .find(query)
            .sort({ distanceKm: 1 })
            .toArray();

        return documents.map(toDonor);
    }

    async update(id: string, data: UpdateDonor): Promise<Donor | null> {
        const _id = parseObjectId(id);
        if (!_id) return null;

        const $set = withoutUndefined(data);
        if (Object.keys($set).length === 0) return this.findById(id);

        const collection = await this.collection();
        const document = await collection.findOneAndUpdate(
            { _id },
            { $set } as UpdateFilter<DonorDocument>,
            { returnDocument: "after" },
        );

        return document ? toDonor(document) : null;
    }

    async delete(id: string): Promise<boolean> {
        const _id = parseObjectId(id);
        if (!_id) return false;

        const collection = await this.collection();
        const result = await collection.deleteOne({ _id });

        return result.deletedCount === 1;
    }

    async count(filter: DonorFilter = {}): Promise<number> {
        const collection = await this.collection();
        return collection.countDocuments(buildFilter(filter));
    }
}

export const donorRepository = new DonorRepository();
