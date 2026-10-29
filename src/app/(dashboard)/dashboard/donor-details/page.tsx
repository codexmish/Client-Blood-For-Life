"use client";

import DonorDetailsForm from "@/components/form/DonorDetailsForm";
import AvailabilityToggle from "@/components/modules/dashboard/AvailabilityToggle";
import { useGetMe } from "@/hooks";
import type { IUser } from "@/types";
import Link from "next/link";

// -----design classes
const cardClass = "rounded-[18px] border border-[#E3E5EA] bg-white p-6";

const DonorDetailsPage = () => {
  // -----logged in user (layout already checked login)
  const { data: userData } = useGetMe();
  const user: IUser | undefined = userData?.data;

  if (!user) return null;

  // -----only donors have donor details (admin may still have a donor profile)
  if (user.role !== "DONOR" || !user.donor) {
    return (
      <section className={`${cardClass} flex flex-col items-start gap-4`}>
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#15171C]">
          Donor details
        </h1>
        <p className="text-[#5B616E]">You are not a donor yet.</p>
        <Link
          href="/become-donor"
          className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#B4232A] px-[22px] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
        >
          Become a donor
        </Link>
      </section>
    );
  }

  return (
    <>
      <h1 className="text-[28px] font-bold tracking-[-0.015em] text-[#15171C] sm:text-[32px]">
        Donor details
      </h1>

      {/* ------availability */}
      <section
        className={`${cardClass} flex flex-wrap items-center justify-between gap-5`}
      >
        <div className="flex min-w-[240px] flex-1 flex-col gap-1.5">
          <h2 className="text-lg font-semibold text-[#15171C]">
            Available to donate
          </h2>
          <p className="leading-normal text-[#5B616E]">
            When this is off you are hidden from donor search and can’t commit
            to requests.
          </p>
        </div>
        <AvailabilityToggle isAvailable={user.donor.isAvailable} />
      </section>

      {/* ------health information */}
      <section className={`${cardClass} flex flex-col gap-[18px]`}>
        <h2 className="text-lg font-semibold text-[#15171C]">
          Health information
        </h2>
        <DonorDetailsForm donor={user.donor} />
      </section>
    </>
  );
};

export default DonorDetailsPage;
