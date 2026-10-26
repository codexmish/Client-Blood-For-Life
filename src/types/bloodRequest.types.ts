import { BloodGroupList } from "./auth.types";


export enum UrgencyList {
  NORMAL = "NORMAL",
  URGENT = "URGENT",
  EMERGENCY = "EMERGENCY",
}

export enum BloodRequestStatus {
  OPEN = "OPEN",
  FULFILLED = "FULFILLED",
  CANCELLED = "CANCELLED",
}

// -----one blood request
export interface IBloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroupList;
  bagsNeeded: number;
  hospitalName: string;
  address: string;
  urgency: UrgencyList;
  needAt: string;
  phoneNumber: string;
  note: string | null;
  status: BloodRequestStatus;
  requesterId: string;
  createdAt: string;
  updatedAt: string;
}

// -----filters for blood request feed
export interface IBloodRequestQuery {
  page: number;
  searchTerm?: string;
  bloodGroup?: BloodGroupList;
  urgency?: UrgencyList;
}