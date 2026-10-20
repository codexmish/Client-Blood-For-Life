export enum BloodGroupList {
  A_POSITIVE = "A_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_POSITIVE = "B_POSITIVE",
  B_NEGATIVE = "B_NEGATIVE",
  AB_POSITIVE = "AB_POSITIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
  O_POSITIVE = "O_POSITIVE",
  O_NEGATIVE = "O_NEGATIVE",
}


export interface ISignup {
	name: string;
	email: string;
	bloodGroup: BloodGroupList;
	password: string;
}

export interface IOtpVerify {
	email: string;
	otp: string;
}

export interface ISignIn {
	email: string;
	password: string;
}