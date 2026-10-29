"use client";

import AvailabilityToggle from "@/components/modules/dashboard/AvailabilityToggle";
import DonationHistory from "@/components/modules/dashboard/DonationHistory";
import MyCommitments from "@/components/modules/dashboard/MyCommitments";
import { useGetMe } from "@/hooks";
import type { IUser } from "@/types";
import {
  bloodGroupLabel,
  initialsOf,
  isAdmin,
  nextDonationDate,
} from "@/utils";
import Link from "next/link";

// -----design classes
const cardClass =
  "flex flex-col gap-3 rounded-[18px] border border-[#E3E5EA] bg-white p-6";
const cardTitle = "text-[15px] font-semibold text-[#5B616E]";

// -----date as 2 Jun 2026
const fullDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const DashboardOverviewPage = () => {
  // -----logged in user (layout already checked login)
  const { data: userData } = useGetMe();
  const user: IUser | undefined = userData?.data;

  if (!user) return null;

  // -----admin has no donor dashboard
  if (isAdmin(user.role)) {
    return (
      <section className="flex flex-col items-start gap-4 rounded-[18px] border border-[#E3E5EA] bg-white p-6 sm:p-8">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#15171C]">
          Admin dashboard
        </h1>
        <p className="text-[#5B616E]">
          See every recorded donation with full details.
        </p>
        <Link
          href="/dashboard/admin"
          className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#B4232A] px-[22px] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
        >
          Open donation report
        </Link>
      </section>
    );
  }

  // -----not a donor yet
  if (user.role !== "DONOR" || !user.donor) {
    return (
      <section className="flex flex-col items-start gap-4 rounded-[18px] border border-[#E3E5EA] bg-white p-6 sm:p-8">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#15171C]">
          Your donor dashboard
        </h1>
        <p className="text-[#5B616E]">
          Become a donor to see your availability, commitments and donation
          history here.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/become-donor"
            className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#B4232A] px-[22px] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
          >
            Become a donor
          </Link>
          <Link
            href="/dashboard/profile"
            className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#D5D8DE] bg-white px-[22px] text-[15px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4]"
          >
            Go to profile
          </Link>
        </div>
      </section>
    );
  }

  const { donor } = user;
  const groupLabel = bloodGroupLabel[user.bloodGroup] ?? user.bloodGroup;
  const restingUntil = nextDonationDate(donor.lastDonationDate);

  return (
    <>
      {/* ------profile card */}
      <section className="flex flex-wrap items-center gap-5 rounded-[18px] border border-[#E3E5EA] bg-white p-6">
        <span className="inline-flex size-[76px] flex-none items-center justify-center overflow-hidden rounded-full bg-[#15171C] text-[26px] font-bold text-white">
          {user.avater ? (
            <img src={user.avater} alt="" className="size-full object-cover" />
          ) : (
            initialsOf(user.name)
          )}
        </span>
        <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <h1 className="text-[26px] font-bold tracking-[-0.015em] text-[#15171C] sm:text-[30px]">
            {user.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-[26px] items-center rounded-full bg-[#FBEAEA] px-2.5 text-xs font-bold text-[#8E1A20]">
              {groupLabel} DONOR
            </span>
            <span className="text-sm text-[#5B616E]">
              {[user.address, user.phone].filter(Boolean).join(" · ")}
            </span>
          </div>
        </div>
        <Link
          href="/dashboard/profile"
          className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#D5D8DE] bg-white px-4 text-[14.5px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4]"
        >
          Edit profile
        </Link>
      </section>

      {/* ------availability, eligibility, total */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <section className={cardClass}>
          <h2 className={cardTitle}>Availability</h2>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[22px] font-bold text-[#15171C]">
              {donor.isAvailable ? "Available" : "Not available"}
            </span>
            <AvailabilityToggle isAvailable={donor.isAvailable} />
          </div>
          <p className="text-[13.5px] text-[#5B616E]">
            {donor.isAvailable
              ? "You appear in donor search when you are eligible."
              : "You are hidden from donor search."}
          </p>
        </section>

        <section className={cardClass}>
          <h2 className={cardTitle}>Eligibility</h2>
          <span
            className={`text-[22px] font-bold ${restingUntil ? "text-[#7A4B00]" : "text-[#1D5E40]"}`}
          >
            {restingUntil ? "Resting" : "Eligible now"}
          </span>
          <p className="text-[13.5px] text-[#5B616E]">
            {!donor.lastDonationDate
              ? "No donation recorded yet. You can give any time."
              : restingUntil
                ? `Last donated ${fullDate(donor.lastDonationDate)}. You can give again from ${fullDate(restingUntil)}.`
                : `Last donated ${fullDate(donor.lastDonationDate)}. You can give again now.`}
          </p>
        </section>

        <section className={cardClass}>
          <h2 className={cardTitle}>Total donations</h2>
          <span className="text-[40px] font-bold leading-none text-[#8E1A20]">
            {donor.totalDonations}
          </span>
          <p className="text-[13.5px] text-[#5B616E]">
            Counted when a request you joined is fulfilled.
          </p>
        </section>
      </div>

      {/* ------commitments and history */}
      <MyCommitments />
      <DonationHistory />
    </>
  );
};

export default DashboardOverviewPage;
