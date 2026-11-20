import type { Donor } from "../interfaces/donor.interface.ts";
import type { Mutable } from "./mutable.type.ts";

type DonorData = Mutable<Omit<Donor, "id">>;

export type CreateDonor = Mutable<Omit<Donor, "id" | "donationsCount">> & {
    donationsCount?: number | undefined;
};

export type UpdateDonor = {
    [K in keyof DonorData]?: DonorData[K] | undefined;
};
