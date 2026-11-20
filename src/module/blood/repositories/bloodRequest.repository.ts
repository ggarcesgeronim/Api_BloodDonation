import {
    type Collection,
    type Filter,
    type UpdateFilter,
    type WithId,
} from "mongodb";
import { BLOOD_REQUESTS_COLLECTION } from "../../../const/const.ts";
import getMongoDb from "../../../db/mongo.db.ts";
import type {
    BloodRequest,
    BloodRequestDocument,
    BloodRequestFilter,
} from "../interfaces/bloodRequest.interface.ts";
import type {
    CreateBloodRequest,
    UpdateBloodRequest,
} from "../types/bloodRequest.type.ts";
import { parseObjectId, withoutUndefined } from "./mongo.helpers.ts";




function toBloodRequest({ _id, ...document }: WithId<BloodRequestDocument>): BloodRequest {
    return { id: _id.toHexString(), ...document };
}

function buildFilter(filter: BloodRequestFilter): Filter<BloodRequestDocument> {
    const query: Filter<BloodRequestDocument> = {};

    if (filter.isUrgent !== undefined) query.isUrgent = filter.isUrgent;
    if (filter.city !== undefined) query.city = filter.city;
    if (filter.bloodType !== undefined) query.bloodType = filter.bloodType;

    return query;
}

export class BloodRequestRepository {
    private async collection(): Promise<Collection<BloodRequestDocument>> {
        const db = await getMongoDb();
        return db.collection<BloodRequestDocument>(BLOOD_REQUESTS_COLLECTION);
    }

    async create(data: CreateBloodRequest): Promise<BloodRequest> {
        const collection = await this.collection();

        const result = await collection.insertOne({ ...data });

        return { id: result.insertedId.toHexString(), ...data };
    }

    async findAll(filter: BloodRequestFilter = {}): Promise<BloodRequest[]> {
        const collection = await this.collection();

        const documents = await collection
            .find(buildFilter(filter))
            .sort({ isUrgent: -1, distanceKm: 1 })
            .toArray();

        return documents.map(toBloodRequest);
    }

    async findById(id: string): Promise<BloodRequest | null> {
        const _id = parseObjectId(id);
        if (!_id) return null;

        const collection = await this.collection();
        const document = await collection.findOne({ _id });

        return document ? toBloodRequest(document) : null;
    }

    async update(id: string, data: UpdateBloodRequest): Promise<BloodRequest | null> {
        const _id = parseObjectId(id);
        if (!_id) return null;

        const $set = withoutUndefined(data);
        if (Object.keys($set).length === 0) return this.findById(id);

        const collection = await this.collection();
        const document = await collection.findOneAndUpdate(
            { _id },
            { $set } as UpdateFilter<BloodRequestDocument>,
            { returnDocument: "after" },
        );

        return document ? toBloodRequest(document) : null;
    }

    async delete(id: string): Promise<boolean> {
        const _id = parseObjectId(id);
        if (!_id) return false;

        const collection = await this.collection();
        const result = await collection.deleteOne({ _id });

        return result.deletedCount === 1;
    }

    async count(filter: BloodRequestFilter = {}): Promise<number> {
        const collection = await this.collection();
        return collection.countDocuments(buildFilter(filter));
    }
}

export const bloodRequestRepository = new BloodRequestRepository();
