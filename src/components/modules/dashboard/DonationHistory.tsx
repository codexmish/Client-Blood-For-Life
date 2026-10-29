"use client";

import ReuseAblePagination from "@/components/modules/global/ReuseAblePagination";
import { useMyDonations } from "@/hooks";
import type { IMyDonation } from "@/types";
import { bloodGroupLabel } from "@/utils";
import { useState } from "react";

// -----my completed donations as a table
const DonationHistory = () => {
  const [page, setPage] = useState(1);

  const { data: donationsData, isLoading } = useMyDonations(page, true);
  const donations: IMyDonation[] = donationsData?.data ?? [];

  return (
    <section
      id="history"
      className="flex scroll-mt-6 flex-col gap-3.5 rounded-[18px] border border-[#E3E5EA] bg-white p-6"
    >
      <h2 className="text-[22px] font-bold text-[#15171C]">Donation history</h2>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-[14px] bg-[#F4F5F7]" />
      ) : donations.length === 0 ? (
        <p className="rounded-[14px] bg-[#F4F5F7] px-4 py-6 text-center text-[#5B616E]">
          No donation recorded yet. A donation is counted when a request you
          joined is marked fulfilled.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E3E5EA] text-[13px] font-semibold text-[#5B616E]">
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Group
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Patient
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Hospital
                  </th>
                </tr>
              </thead>
              <tbody>
                {donations.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#EEF0F3] text-[15px] last:border-b-0"
                  >
                    <td className="px-3 py-3.5 text-[#15171C]">
                      {new Date(item.donatedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-3.5 font-bold text-[#8E1A20]">
                      {bloodGroupLabel[item.bloodGroup] ?? item.bloodGroup}
                    </td>
                    <td className="px-3 py-3.5 text-[#15171C]">
                      {item.request.patientName}
                    </td>
                    <td className="px-3 py-3.5 text-[#4A505C]">
                      {item.request.hospitalName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ----only when more than one page */}
          {(donationsData?.meta?.totalPages ?? 1) > 1 && (
            <ReuseAblePagination
              totalPages={donationsData.meta.totalPages}
              page={page}
              setPage={setPage}
            />
          )}
        </>
      )}
    </section>
  );
};

export default DonationHistory;
