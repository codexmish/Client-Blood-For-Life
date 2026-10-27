"use client";

import { usePublicDonation } from "@/hooks";
import type { IPublicDonation } from "@/types";
import { bloodGroupLabel } from "@/utils";

const RecentDonations = () => {
  // -----getting public donation data
  const { data: publicDonation, isLoading: publicDonationLoading } =
    usePublicDonation();

  const donationData: IPublicDonation[] = publicDonation?.data ?? [];

  // -----numbers for showing
  const totalRequests: number = publicDonation?.meta?.total ?? 0;
  const recentBags = donationData.reduce((sum, item) => sum + item.bags, 0);

  return (
    <section className="bg-[#15171C] text-[#F4F5F7]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap gap-12 px-4 py-12 sm:px-6 md:py-16">
        {/* ------left side text */}
        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-4">
          <h2 className="text-[30px] font-bold tracking-[-0.02em] sm:text-[34px]">
            Recent donations
          </h2>
          <p className="text-base leading-[1.55] text-[#C3C7D0]">
            Every fulfilled request on the platform. No names, no hospitals —
            just the blood that reached someone.
          </p>

          {/* -----numbers */}
          <div className="flex gap-8 pt-2">
            <div className="flex flex-col gap-1">
              {publicDonationLoading ? (
                <span className="h-10 w-16 animate-pulse rounded-lg bg-[#2F333C]" />
              ) : (
                <span className="text-[40px] font-bold leading-none">
                  {recentBags}
                </span>
              )}
              <span className="text-sm text-[#C3C7D0]">
                bags donated recently
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {publicDonationLoading ? (
                <span className="h-10 w-16 animate-pulse rounded-lg bg-[#2F333C]" />
              ) : (
                <span className="text-[40px] font-bold leading-none">
                  {totalRequests}
                </span>
              )}
              <span className="text-sm text-[#C3C7D0]">requests fulfilled</span>
            </div>
          </div>
        </div>

        {/* ------right side list */}
        <div className="min-w-0 flex-[1_1_480px]">
          {publicDonationLoading ? (
            // -----loading skeleton (same shape as a row)
            <div aria-hidden="true" className="flex flex-col gap-2.5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-[14px] bg-[#22252C] px-[18px] py-3.5"
                >
                  <span className="h-11 w-[52px] flex-none animate-pulse rounded-[10px] bg-[#2F333C]" />
                  <span className="h-4 w-16 flex-1 animate-pulse rounded-md bg-[#2F333C] sm:flex-none" />
                  <span className="ml-auto h-3.5 w-24 flex-none animate-pulse rounded-md bg-[#2F333C]" />
                </div>
              ))}
            </div>
          ) : donationData.length === 0 ? (
            // -----no donation yet
            <p className="rounded-[14px] bg-[#22252C] px-4 py-8 text-center text-[15px] text-[#C3C7D0]">
              No donations recorded yet.
            </p>
          ) : (
            <ul className="-mr-2 flex max-h-[392px] flex-col gap-2.5 overflow-y-auto pr-2 [scrollbar-color:#3B404B_transparent] [scrollbar-width:thin]">
              {donationData.map((item, index) => (
                <li
                  key={`${item.donatedAt}-${index}`}
                  className="flex flex-none items-center gap-4 rounded-[14px] bg-[#22252C] px-[18px] py-3.5"
                >
                  {/* -----blood group */}
                  <span className="inline-flex h-11 w-[52px] flex-none items-center justify-center rounded-[10px] bg-[#3A1416] text-lg font-bold text-[#FFB4B7]">
                    {bloodGroupLabel[item.bloodGroup] ?? item.bloodGroup}
                  </span>

                  {/* -----bags */}
                  <span className="flex-1 font-semibold">
                    {item.bags} {item.bags === 1 ? "bag" : "bags"}
                  </span>

                  {/* -----date */}
                  <span className="flex-none text-sm text-[#C3C7D0]">
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
      </div>
    </section>
  );
};

export default RecentDonations;
