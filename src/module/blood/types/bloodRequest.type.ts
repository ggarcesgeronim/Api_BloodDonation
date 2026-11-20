import type { BloodRequest } from "../interfaces/bloodRequest.interface.ts";
import type { Mutable } from "./mutable.type.ts";

type BloodRequestData = Mutable<Omit<BloodRequest, "id">>;

export type CreateBloodRequest = BloodRequestData;

export type UpdateBloodRequest = {
    [K in keyof BloodRequestData]?: BloodRequestData[K] | undefined;
};
