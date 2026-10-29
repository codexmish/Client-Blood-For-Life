"use client";

import ReuseAblePagination from "@/components/modules/global/ReuseAblePagination";
import { useAllDonations } from "@/hooks";
import type {
  BloodGroupList,
  IAdminDonation,
  IAdminDonationQuery,
} from "@/types";
import { bloodGroupLabel } from "@/utils";
import { useState } from "react";

// -----blood group options
const bloodGroupOptions = [
  { label: "All groups", value: "" },
  ...Object.entries(bloodGroupLabel).map(([value, label]) => ({
    label,
    value,
  })),
];

// -----design classes
const inputClass =
  "h-11 w-full rounded-[10px] border border-[#D5D8DE] bg-white px-3 text-[15px] text-[#15171C] outline-none focus:border-[#B4232A] focus:ring-3 focus:ring-[#B4232A]/20";
const labelClass = "text-[13px] font-semibold text-[#3B404B]";
const thClass =
  "whitespace-nowrap bg-[#FAFAFB] px-3.5 py-3 text-left text-[12.5px] font-semibold text-[#5B616E]";
const tdClass = "px-3.5 py-3.5 align-top text-[14.5px]";

// -----date as 13 Oct 2026
const fullDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const DonationReport = () => {
  // -----filter form values (sent only when Apply is pressed)
  const [bloodGroup, setBloodGroup] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dateError, setDateError] = useState("");

  // -----filters that go to api
  const [query, setQuery] = useState<IAdminDonationQuery>({ page: 1 });

  const { data: donationsData, isLoading } = useAllDonations(query);
  const donations: IAdminDonation[] = donationsData?.data ?? [];
  const meta = donationsData?.meta;

  // -----apply filters
  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    // ----dates come as YYYY-MM-DD, so string compare works
    if (from && to && from > to) {
      setDateError("From date must be before To date");
      return;
    }
    setDateError("");

    setQuery({
      page: 1,
      bloodGroup: (bloodGroup as BloodGroupList) || undefined,
      from: from || undefined,
      to: to || undefined,
    });
  };

  // -----clear filters
  const handleReset = () => {
    setBloodGroup("");
    setFrom("");
    setTo("");
    setDateError("");
    setQuery({ page: 1 });
  };

  // -----pagination keeps filters, only page changes
  const setPage = (page: number) => setQuery((prev) => ({ ...prev, page }));

  return (
    <>
      {/* ------heading */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[30px] font-bold tracking-[-0.02em] text-[#15171C] sm:text-[36px]">
            Donation report
          </h1>
          <p className="text-[#5B616E]">
            Every recorded donation with donor, patient and requester details.
          </p>
        </div>
        <p className="text-[15px]">
          <strong className="text-[22px] font-bold text-[#15171C]">
            {meta?.total ?? 0}
          </strong>{" "}
          <span className="text-[#5B616E]">donations in range</span>
        </p>
      </div>

      {/* ------filters */}
      <form
        onSubmit={handleApply}
        className="flex flex-col gap-2 rounded-2xl border border-[#E3E5EA] bg-white p-[18px]"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] items-end gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ad-group" className={labelClass}>
              Blood group
            </label>
            <select
              id="ad-group"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className={inputClass}
            >
              {bloodGroupOptions.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ad-from" className={labelClass}>
              From
            </label>
            <input
              id="ad-from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ad-to" className={labelClass}>
              To
            </label>
            <input
              id="ad-to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex gap-2.5">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-[10px] bg-[#15171C] px-[18px] text-[15px] font-semibold text-white transition-colors hover:bg-[#2A2D35]"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-[10px] border border-[#D5D8DE] bg-white px-[18px] text-[15px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4]"
            >
              Reset
            </button>
          </div>
        </div>
        {dateError && <p className="text-[13px] text-red-600">{dateError}</p>}
      </form>

      {/* ------table */}
      <div className="overflow-x-auto rounded-2xl border border-[#E3E5EA] bg-white">
        <table className="w-full min-w-[960px] border-collapse">
          <thead>
            <tr className="border-b border-[#E3E5EA]">
              <th scope="col" className={thClass}>
                Donated
              </th>
              <th scope="col" className={thClass}>
                Group
              </th>
              <th scope="col" className={thClass}>
                Donor
              </th>
              <th scope="col" className={thClass}>
                Patient &amp; hospital
              </th>
              <th scope="col" className={thClass}>
                Requester
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // -----skeleton rows
              [1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="border-b border-[#EEF0F3]">
                  {[1, 2, 3, 4, 5].map((cell) => (
                    <td key={cell} className={tdClass}>
                      <span
                        aria-hidden="true"
                        className="block h-4 w-3/4 animate-pulse rounded-md bg-[#EEF0F3]"
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : donations.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-[#5B616E]"
                >
                  No donation in this range.
                </td>
              </tr>
            ) : (
              donations.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#EEF0F3] last:border-b-0"
                >
                  <td className={`${tdClass} whitespace-nowrap text-[#15171C]`}>
                    {fullDate(item.donatedAt)}
                  </td>
                  <td className={tdClass}>
                    <span className="inline-flex h-[30px] min-w-11 items-center justify-center rounded-lg bg-[#FBEAEA] px-2 font-bold text-[#8E1A20]">
                      {bloodGroupLabel[item.bloodGroup] ?? item.bloodGroup}
                    </span>
                  </td>
                  <td className={tdClass}>
                    <div className="font-semibold text-[#15171C]">
                      {item.donor.user.name}
                    </div>
                    <div className="text-[13.5px] text-[#5B616E]">
                      {[item.donor.user.phone, item.donor.user.email]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </td>
                  <td className={tdClass}>
                    <div className="font-semibold text-[#15171C]">
                      {item.request.patientName}
                    </div>
                    <div className="text-[13.5px] text-[#5B616E]">
                      {item.request.hospitalName}
                    </div>
                  </td>
                  <td className={tdClass}>
                    <div className="font-semibold text-[#15171C]">
                      {item.request.requester.name}
                    </div>
                    <div className="text-[13.5px] text-[#5B616E]">
                      {item.request.phoneNumber}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ------page info and pagination */}
      {meta && meta.totalPages > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#5B616E]">
            Page {meta.page} of {meta.totalPages} · {meta.limit} per page
          </p>
          <ReuseAblePagination
            totalPages={meta.totalPages || 1}
            page={query.page}
            setPage={setPage}
          />
        </div>
      )}
    </>
  );
};

export default DonationReport;
