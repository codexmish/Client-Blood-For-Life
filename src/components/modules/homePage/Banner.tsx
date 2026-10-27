"use client";

import { useGetMe, usePublicDonation } from "@/hooks";
import type { IPublicDonation } from "@/types";
import Link from "next/link";
import { bloodGroupLabel } from "@/utils";

const Banner = () => {
  // -----getting user data
  const { data: publicDonation, isLoading: publicDonationLoading } =
    usePublicDonation();

  const donationData: IPublicDonation[] = publicDonation?.data ?? [];

  // -----checking login
  const { data: userData, isLoading: userDataLoading } = useGetMe();
  const user = userData?.data;

  return (
    <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-12 px-4 py-12 sm:px-6 md:py-[72px]">
      {/* ------left side text */}
      <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-[22px]">
        <p className="text-sm font-semibold uppercase tracking-[0.06em] text-[#8E1A20]">
          Voluntary blood donation · Bangladesh
        </p>
        <h1 className="text-[40px] font-bold leading-[1.04] tracking-[-0.025em] text-[#15171C] sm:text-5xl lg:text-[60px]">
          Someone nearby needs your blood group today.
        </h1>
        <p className="max-w-[520px] text-[17px] leading-[1.55] text-[#4A505C] sm:text-[19px]">
          Post a request in a minute. Donors with the same blood group who are
          eligible to give see it, commit to come, and you get their numbers.
        </p>

        {/* ------buttons */}
        <div className="flex flex-wrap gap-3 pt-1.5">
          {userDataLoading ? (
            // -----loading skeleton
            <div className="h-[52px] w-44 animate-pulse rounded-[10px] bg-[#E9EBEF]" />
          ) : user ? (
            // -----after login
            <Link
              href="/create-request"
              className="inline-flex h-[52px] items-center justify-center rounded-[10px] bg-[#B4232A] px-6 text-base font-semibold text-white transition-colors hover:bg-[#951C22]"
            >
              Request blood
            </Link>
          ) : (
            // -----before login
            <Link
              href="/signup"
              className="inline-flex h-[52px] items-center justify-center rounded-[10px] bg-[#B4232A] px-6 text-base font-semibold text-white transition-colors hover:bg-[#951C22]"
            >
              Create an account
            </Link>
          )}
        </div>

        <p className="text-sm text-[#5B616E]">
          Free to use. Donor phone numbers are only shared with the person who
          posted the request.
        </p>
      </div>

      {/* ------right side card */}
      <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-3.5 rounded-[20px] border border-[#E3E5EA] bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#15171C]">Recent donations</h2>
          <p className="text-sm text-[#5B616E]">
            Blood that reached someone through Blood For Life.
          </p>
        </div>

        {publicDonationLoading ? (
          // -----loading skeleton (same shape as a row)
          <div aria-hidden="true" className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3.5 rounded-[14px] border border-[#E3E5EA] p-3.5"
              >
                <span className="size-14 flex-none animate-pulse rounded-[14px] bg-[#EEF0F3]" />
                <span className="flex flex-1 flex-col gap-2">
                  <span className="h-4 w-32 animate-pulse rounded-md bg-[#EEF0F3]" />
                  <span className="h-3.5 w-24 animate-pulse rounded-md bg-[#EEF0F3]" />
                </span>
                <span className="h-3.5 w-20 flex-none animate-pulse rounded-md bg-[#EEF0F3]" />
              </div>
            ))}
          </div>
        ) : donationData.length === 0 ? (
          // -----no donation yet
          <p className="rounded-[14px] bg-[#F4F5F7] px-4 py-8 text-center text-[15px] text-[#5B616E]">
            No donations recorded yet.
          </p>
        ) : (
          <ul className="-mr-2 flex max-h-[380px] flex-col gap-3 overflow-y-auto pr-2 [scrollbar-color:#D5D8DE_transparent] [scrollbar-width:thin]">
            {donationData.map((item, index) => (
              <li
                key={`${item.donatedAt}-${index}`}
                className="flex flex-none items-center gap-3.5 rounded-[14px] border border-[#E3E5EA] p-3.5 text-[#15171C]"
              >
                {/* -----blood group */}
                <span className="inline-flex size-14 flex-none items-center justify-center rounded-[14px] bg-[#FBEAEA] text-xl font-bold text-[#8E1A20]">
                  {bloodGroupLabel[item.bloodGroup] ?? item.bloodGroup}
                </span>

                {/* -----bags */}
                <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span className="text-[15.5px] font-semibold">
                    {item.bags} {item.bags === 1 ? "bag" : "bags"} donated
                  </span>
                  <span className="text-sm text-[#5B616E]">
                    Request fulfilled
                  </span>
                </span>

                {/* -----date */}
                <span className="flex-none text-[13px] text-[#5B616E]">
                  {new Date(item.donatedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Banner;
