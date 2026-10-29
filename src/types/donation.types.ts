// -----public donation item
export interface IPublicDonation {
  bloodGroup: string;
  donatedAt: string;
  bags: number;
}

// -----one of my completed donations
export interface IMyDonation {
  id: string;
  bloodGroup: string;
  donatedAt: string;
  request: {
    id: string;
    patientName: string;
    hospitalName: string;
    address: string;
    needAt: string;
  };
}
