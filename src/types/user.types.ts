import type { BloodGroupList } from "./auth.types";

// -----donor info inside user (null when not a donor)
export interface IUserDonor {
  id: string;
  isAvailable: boolean;
  lastDonationDate: string | null;
  totalDonations: number;
  weight: string | null;
  healthNote: string | null;
}

// -----logged in user (/auth/me)
export interface IUser {
  id: string;
  name: string;
  email: string;
  bloodGroup: BloodGroupList;
  phone: string | null;
  address: string | null;
  avater: string;
  role: "SUPER_ADMIN" | "ADMIN" | "RECIPIENT" | "DONOR";
  donor: IUserDonor | null;
}

// -----update profile payload
export interface IUpdateProfile {
  name?: string;
  phone?: string;
  address?: string;
}

// -----change password payload
export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}
