import type { BloodGroupList } from "./auth.types";

// -----register donor payload (all optional)
export interface IRegisterDonor {
  weight?: string;
  lastDonationDate?: string;
  healthNote?: string;
}

// -----one donor in list / single donor (no phone or email)
export interface IDonor {
  id: string;
  isAvailable: boolean;
  lastDonationDate: string | null;
  totalDonations: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    bloodGroup: BloodGroupList;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    address: string | null;
    avater: string;
  };
}

// -----filters for donor list
export interface IDonorQuery {
  page: number;
  searchTerm?: string;
  bloodGroup?: BloodGroupList;
  sortBy?: "createdAt" | "lastDonationDate" | "totalDonations";
  sortOrder?: "asc" | "desc";
}
