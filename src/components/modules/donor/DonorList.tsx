"use client";

import ReuseAblePagination from "@/components/modules/global/ReuseAblePagination";
import { useDebounce, useDonors, useGetMe } from "@/hooks";
import type { BloodGroupList, IDonor } from "@/types";
import { bloodGroupLabel } from "@/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import DonorCard from "./DonorCard";
import DonorCardSkeleton from "./DonorCardSkeleton";

// -----blood group chips
const bloodGroupChips = [
  { label: "All", value: "" },
  ...Object.entries(bloodGroupLabel).map(([value, label]) => ({
    label,
    value,
  })),
];

// -----sort options (newest is backend default, so nothing is sent)
const sortOptions = [
  { label: "Newest donors", value: "", sortBy: undefined, sortOrder: undefined },
  {
    label: "Most donations",
    value: "most",
    sortBy: "totalDonations",
    sortOrder: "desc",
  },
  {
    label: "Longest since last donation",
    value: "longest",
    sortBy: "lastDonationDate",
    sortOrder: "asc",
  },
] as const;

// -----design classes
const inputClass =
  "h-11 w-full rounded-[10px] border border-[#D5D8DE] bg-white px-3 text-[15px] text-[#15171C] outline-none placeholder:text-[#8A909B] focus:border-[#B4232A] focus:ring-3 focus:ring-[#B4232A]/20";
const labelClass = "text-[13px] font-semibold text-[#3B404B]";
const gridClass =
  "grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-[18px]";

const DonorList = () => {
  // -----blood group can come from home page link (?bloodGroup=O_NEGATIVE)
  const searchParams = useSearchParams();

  // -----page and filter states
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroup, setBloodGroup] = useState(
    searchParams.get("bloodGroup") ?? "",
  );
  const [sort, setSort] = useState("");

  // -----search value for api (after user stops typing)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // -----selected sort option
  const selectedSort =
    sortOptions.find((item) => item.value === sort) ?? sortOptions[0];

  // -----checking login (donor list needs login)
  const { data: userData, isLoading: userDataLoading } = useGetMe();
  const user = userData?.data;

  // -----getting donors
  const { data: donorsData, isLoading: donorsLoading } = useDonors(
    {
      page,
      searchTerm: debouncedSearch || undefined,
      bloodGroup: (bloodGroup as BloodGroupList) || undefined,
      sortBy: selectedSort.sortBy,
      sortOrder: selectedSort.sortOrder,
    },
    !!user,
  );

  const donors: IDonor[] = donorsData?.data ?? [];
  const total: number = donorsData?.meta?.total ?? 0;
  const groupText = bloodGroup ? `${bloodGroupLabel[bloodGroup]} ` : "";

  // -----card skeletons
  const skeletons = (
    <div className={gridClass}>
      {[1, 2, 3, 4, 5].map((item) => (
        <DonorCardSkeleton key={item} />
      ))}
    </div>
  );

  if (userDataLoading) {
    return (
      <>
        <div className="h-[170px] animate-pulse rounded-2xl border border-[#E3E5EA] bg-white" />
        {skeletons}
      </>
    );
  }

  // -----not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[20px] border border-[#E3E5EA] bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-bold tracking-[-0.015em] text-[#15171C]">
          Sign in to find donors
        </h2>
        <p className="text-[#5B616E]">
          Donor details are only shown to signed in users.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/signin"
            className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#B4232A] px-[18px] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#D5D8DE] bg-white px-[18px] text-[15px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4]"
          >
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ------filters */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-4 rounded-2xl border border-[#E3E5EA] bg-white p-[18px]"
      >
        {/* -----blood group chips */}
        <fieldset className="flex flex-col">
          <legend className={`${labelClass} mb-1.5`}>Blood group</legend>
          <div className="flex flex-wrap gap-2">
            {bloodGroupChips.map((item) => {
              const selected = bloodGroup === item.value;
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setBloodGroup(item.value);
                    setPage(1);
                  }}
                  className={`h-11 min-w-[52px] cursor-pointer rounded-full border px-3 text-[15px] font-bold transition-colors ${
                    selected
                      ? "border-[#B4232A] bg-[#B4232A] text-white"
                      : "border-[#D5D8DE] bg-white text-[#15171C] hover:border-[#B4232A]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {/* -----search */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="donor-search" className={labelClass}>
              Name or area
            </label>
            <input
              id="donor-search"
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="e.g. Mirpur"
              className={inputClass}
            />
          </div>

          {/* -----sort */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="donor-sort" className={labelClass}>
              Sort by
            </label>
            <select
              id="donor-sort"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            >
              {sortOptions.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {/* ------count */}
      <p className="text-sm text-[#5B616E]">
        {total} {groupText}
        {total === 1 ? "donor" : "donors"} available
      </p>

      {/* ------cards */}
      {donorsLoading ? (
        skeletons
      ) : donors.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[20px] border border-[#E3E5EA] bg-white px-4 py-12 text-center">
          <p className="text-[#5B616E]">
            No {groupText}donor can give right now. Post a request — donors who
            become eligible will see it.
          </p>
          <Link
            href="/create-request"
            className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#B4232A] px-[18px] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
          >
            Post a request
          </Link>
        </div>
      ) : (
        <div className={gridClass}>
          {donors.map((item) => (
            <DonorCard key={item.id} donor={item} />
          ))}
        </div>
      )}

      {/* -----pagination */}
      <ReuseAblePagination
        totalPages={donorsData?.meta?.totalPages || 1}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

export default DonorList;
