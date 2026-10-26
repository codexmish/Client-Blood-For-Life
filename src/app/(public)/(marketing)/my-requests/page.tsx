"use client";
import MyRequestRow from "@/components/modules/bloodRequest/MyRequestRow";
import ReuseAblePagination from "@/components/modules/global/ReuseAblePagination";
import { useGetMe, useMyBloodRequests } from "@/hooks";
import { BloodGroupList, IBloodRequest } from "@/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// -----blood group options
const bloodGroupOptions = [
  { label: "All groups", value: "" },
  { label: "A+", value: "A_POSITIVE" },
  { label: "A−", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B−", value: "B_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB−", value: "AB_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "O−", value: "O_NEGATIVE" },
];

// -----sort options (newest is backend default, so nothing is sent)
const sortOptions = [
  { label: "Newest", value: "", sortBy: undefined, sortOrder: undefined },
  {
    label: "Needed soonest",
    value: "soonest",
    sortBy: "needAt",
    sortOrder: "asc",
  },
  {
    label: "Most bags",
    value: "bags",
    sortBy: "bagsNeeded",
    sortOrder: "desc",
  },
] as const;

// -----design classes
const inputClass =
  "h-11 w-full rounded-[10px] border border-[#D5D8DE] bg-white px-3 text-[15px] text-[#15171C] outline-none placeholder:text-[#8A909B] focus:border-[#B4232A] focus:ring-3 focus:ring-[#B4232A]/20";
const labelClass = "text-[13px] font-semibold text-[#3B404B]";
const primaryBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#B4232A] px-[18px] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]";

const MyRequestsPage = () => {
  // -----page and filter states
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [sort, setSort] = useState("");

  // -----selected sort option
  const selectedSort =
    sortOptions.find((item) => item.value === sort) ?? sortOptions[0];

  // -----checking login
  const { data: userData, isLoading: userDataLoading } = useGetMe();
  const user = userData?.data;

  // -----getting my requests
  const { data: myRequestsData, isLoading: myRequestsLoading } =
    useMyBloodRequests(
      {
        page,
        searchTerm: searchTerm || undefined,
        bloodGroup: (bloodGroup as BloodGroupList) || undefined,
        sortBy: selectedSort.sortBy,
        sortOrder: selectedSort.sortOrder,
      },
      !!user,
    );

  // -----any filter used
  const isFiltered = !!searchTerm || !!bloodGroup;

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-[22px] px-4 py-10 sm:px-6 md:pb-16">
      {/* ------heading */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-[#15171C] sm:text-[40px]">
            My requests
          </h1>
          <p className="text-base text-[#5B616E]">
            Your open blood requests. Open one to see who committed and to mark
            it fulfilled.
          </p>
        </div>
        <Link href="/create-request" className={primaryBtn}>
          <Plus className="size-[18px]" strokeWidth={2.4} />
          New request
        </Link>
      </div>

      {userDataLoading ? (
        // -----loading skeleton
        <div className="h-[320px] animate-pulse rounded-2xl border border-[#E3E5EA] bg-white" />
      ) : !user ? (
        // -----not logged in
        <div className="flex flex-col items-start gap-4 rounded-[20px] border border-[#E3E5EA] bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-[-0.015em] text-[#15171C]">
            Sign in to see your requests
          </h2>
          <p className="text-[#5B616E]">
            Your requests and the donors who joined them show up here.
          </p>
          <Link href="/signin" className={primaryBtn}>
            Sign in
          </Link>
        </div>
      ) : (
        <>
          {/* ------filters */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 gap-3.5 rounded-2xl border border-[#E3E5EA] bg-white p-[18px] sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* -----search */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="search" className={labelClass}>
                Search
              </label>
              <input
                id="search"
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Hospital or area"
                className={inputClass}
              />
            </div>

            {/* -----blood group */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bloodGroup" className={labelClass}>
                Blood group
              </label>
              <select
                id="bloodGroup"
                value={bloodGroup}
                onChange={(e) => {
                  setBloodGroup(e.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                {bloodGroupOptions.map((item) => (
                  <option key={item.label} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* -----sort by */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sortBy" className={labelClass}>
                Sort by
              </label>
              <select
                id="sortBy"
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
          </form>

          {/* ------list */}
          {myRequestsLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-[18px] border border-[#E3E5EA] bg-white"
                />
              ))}
            </div>
          ) : myRequestsData?.data.length === 0 ? (
            // -----empty
            <div className="flex flex-col items-center gap-4 rounded-[20px] border border-[#E3E5EA] bg-white px-4 py-12 text-center">
              <p className="text-[#5B616E]">
                {isFiltered
                  ? "None of your open requests match these filters."
                  : "You have no open blood request."}
              </p>
              {!isFiltered && (
                <Link href="/create-request" className={primaryBtn}>
                  Post a request
                </Link>
              )}
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {myRequestsData?.data.map((item: IBloodRequest) => (
                <MyRequestRow
                  key={item.id}
                  id={item.id}
                  bloodGroup={item.bloodGroup}
                  urgency={item.urgency}
                  patientName={item.patientName}
                  hospitalName={item.hospitalName}
                  address={item.address}
                  needAt={item.needAt}
                  bagsNeeded={item.bagsNeeded}
                />
              ))}
            </ul>
          )}

          {/* -----pagination */}
          <ReuseAblePagination
            totalPages={myRequestsData?.meta.totalPages || 1}
            page={page}
            setPage={setPage}
          />
        </>
      )}
    </div>
  );
};

export default MyRequestsPage;
