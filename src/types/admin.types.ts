import type { BloodGroupList } from "./auth.types";

// -----one donation with full details (admin only)
export interface IAdminDonation {
  id: string;
  bloodGroup: BloodGroupList;
  donatedAt: string;
  donor: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      bloodGroup: BloodGroupList;
    };
  };
  request: {
    id: string;
    patientName: string;
    hospitalName: string;
    address: string;
    needAt: string;
    phoneNumber: string;
    requester: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    };
  };
}

// -----filters for donation report
export interface IAdminDonationQuery {
  page: number;
  bloodGroup?: BloodGroupList;
  from?: string;
  to?: string;
}
