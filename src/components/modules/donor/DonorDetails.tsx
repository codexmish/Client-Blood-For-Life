"use client";

import { useGetMe, useSingleDonor } from "@/hooks";
import type { IDonor } from "@/types";
import {
  bloodGroupLabel,
  errorMessage,
  initialsOf,
  monthYear,
  nextDonationDate,
} from "@/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// -----design classes
const cardClass = "rounded-[22px] border border-[#E3E5EA] bg-white";
const primaryBtn =
  "inline-flex h-12 items-center justify-center rounded-[10px] bg-[#B4232A] px-[22px] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]";

const DonorDetails = () => {
  // -----donor id from url
  const { id } = useParams<{ id: string }>();

  // -----logged in user
  const { data: userData, isLoading: userDataLoading } = useGetMe();
  const user = userData?.data;

  // -----donor data
  const {
    data: donorData,
    isLoading: donorLoading,
    error: donorError,
  } = useSingleDonor(id, !!user);
  const donor: IDonor | undefined = donorData?.data;

  const backLink = (
    <Link
      href="/donors"
      className="inline-flex min-h-11 items-center gap-1.5 self-start text-[15px] font-semibold text-[#B4232A] hover:text-[#8E1A20]"
    >
      <ChevronLeft className="size-4" strokeWidth={2.4} />
      Back to donors
    </Link>
  );

  // -----loading
  if (userDataLoading || (user && donorLoading)) {
    return (
      <>
        {backLink}
        <div className="h-[184px] animate-pulse rounded-[22px] border border-[#E3E5EA] bg-white" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[104px] animate-pulse rounded-[18px] border border-[#E3E5EA] bg-white"
            />
          ))}
        </div>
      </>
    );
  }

  // -----not logged in
  if (!user) {
    return (
      <>
        {backLink}
        <section
          className={`${cardClass} flex flex-col items-start gap-4 p-6 sm:p-8`}
        >
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#15171C]">
            Sign in to see this donor
          </h1>
          <p className="text-[#5B616E]">
            Donor details are only shown to signed in users.
          </p>
          <Link href="/signin" className={primaryBtn}>
            Sign in
          </Link>
        </section>
      </>
    );
  }

  // -----not found
  if (donorError || !donor) {
    return (
      <>
        {backLink}
        <section
          className={`${cardClass} flex flex-col items-start gap-3 p-6 sm:p-8`}
        >
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#15171C]">
            Donor not found
          </h1>
          <p className="text-[#5B616E]">{errorMessage(donorError)}</p>
        </section>
      </>
    );
  }

  // -----values for showing
  const groupLabel =
    bloodGroupLabel[donor.user.bloodGroup] ?? donor.user.bloodGroup;
  const restingUntil = nextDonationDate(donor.lastDonationDate);

  let status = { text: "AVAILABLE", style: "bg-[#E6F2EC] text-[#1D5E40]" };
  if (!donor.isAvailable) {
    status = { text: "NOT AVAILABLE", style: "bg-[#EEF0F3] text-[#3B404B]" };
  } else if (restingUntil) {
    status = {
      text: `RESTING UNTIL ${restingUntil
        .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
        .toUpperCase()}`,
      style: "bg-[#FFF1D6] text-[#7A4B00]",
    };
  }

  const stats = [
    { label: "Total donations", value: donor.totalDonations },
    { label: "Last donated", value: monthYear(donor.lastDonationDate) },
    { label: "Donor since", value: monthYear(donor.createdAt) },
  ];

  return (
    <>
      {backLink}

      {/* ------donor card */}
      <section
        className={`${cardClass} flex flex-wrap items-center gap-7 p-6 sm:p-9`}
      >
        <span className="inline-flex size-24 flex-none items-center justify-center overflow-hidden rounded-full bg-[#EEF0F3] text-[34px] font-bold text-[#15171C] sm:size-28 sm:text-[38px]">
          {donor.user.avater ? (
            <img
              src={donor.user.avater}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            initialsOf(donor.user.name)
          )}
        </span>
        <div className="flex min-w-[220px] flex-1 flex-col gap-2.5">
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex h-[26px] items-center rounded-full px-2.5 text-xs font-bold ${status.style}`}
            >
              {status.text}
            </span>
            {donor.user.gender && (
              <span className="inline-flex h-[26px] items-center rounded-full bg-[#EEF0F3] px-2.5 text-xs font-bold text-[#3B404B]">
                {donor.user.gender}
              </span>
            )}
          </div>
          <h1 className="text-[30px] font-bold tracking-[-0.02em] text-[#15171C] sm:text-[38px]">
            {donor.user.name}
          </h1>
          <p className="text-base text-[#5B616E]">
            {donor.user.address ?? "Address not added"}
          </p>
        </div>
        <span className="inline-flex size-[88px] flex-none items-center justify-center rounded-3xl bg-[#FBEAEA] text-[34px] font-bold text-[#8E1A20] sm:size-[104px] sm:text-[40px]">
          {groupLabel}
        </span>
      </section>

      {/* ------stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-1.5 rounded-[18px] border border-[#E3E5EA] bg-white p-[22px]"
          >
            <span className="text-sm text-[#5B616E]">{item.label}</span>
            <span className="text-[30px] font-bold text-[#15171C] sm:text-[34px]">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* ------post request box */}
      <section className="flex flex-wrap items-center gap-5 rounded-[20px] bg-[#15171C] p-7 text-[#F4F5F7]">
        <div className="flex min-w-[260px] flex-1 flex-col gap-1.5">
          <h2 className="text-[22px] font-bold">Need {groupLabel} blood?</h2>
          <p className="leading-normal text-[#C3C7D0]">
            Donors’ phone numbers stay private. Post a request —{" "}
            {donor.user.name.split(" ")[0]} and other {groupLabel} donors can
            commit, and you will see their numbers.
          </p>
        </div>
        <Link href="/create-request" className={primaryBtn}>
          Post a {groupLabel} request
        </Link>
      </section>
    </>
  );
};

export default DonorDetails;
