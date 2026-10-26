"use client";
import BloodRequestCard from "@/components/modules/bloodRequest/BloodRequestCard";
import ReuseAblePagination from "@/components/modules/global/ReuseAblePagination";
import { useBloodRequwsts } from "@/hooks";
import { BloodGroupList, IBloodRequest, UrgencyList } from "@/types";
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

// -----urgency options
const urgencyOptions = [
  { label: "Any", value: "" },
  { label: "Emergency", value: "EMERGENCY" },
  { label: "Urgent", value: "URGENT" },
  { label: "Normal", value: "NORMAL" },
];

// -----input design
const inputClass =
  "h-11 w-full rounded-[10px] border border-[#D5D8DE] bg-white px-3 text-[15px] text-[#15171C] outline-none placeholder:text-[#8A909B] focus:border-[#B4232A] focus:ring-3 focus:ring-[#B4232A]/20";

const BloodRequestPage = () => {
  // -----page and filter states
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [urgency, setUrgency] = useState("");

  // -----getting all blood requests
  const { data: bloodRequestsData, isLoading: bloodRequestsDataLoading } =
    useBloodRequwsts({
      page,
      searchTerm: searchTerm || undefined,
      bloodGroup: (bloodGroup as BloodGroupList) || undefined,
      urgency: (urgency as UrgencyList) || undefined,
    });

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-10 sm:px-6 md:py-12">
      {/* ------heading */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[32px] font-bold tracking-[-0.02em] text-[#15171C] sm:text-[40px]">
          Blood requests
        </h1>
        <p className="text-base text-[#5B616E]">
          Open requests needed today or later. Call the number on the card or
          commit to donate.
        </p>
      </div>

      {/* ------filters */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-1 gap-3.5 rounded-2xl border border-[#E3E5EA] bg-white p-[18px] sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* -----search */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label
            htmlFor="search"
            className="text-[13px] font-semibold text-[#3B404B]"
          >
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
            placeholder="Hospital or area, e.g. Mirpur"
            className={inputClass}
          />
        </div>

        {/* -----blood group */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="bloodGroup"
            className="text-[13px] font-semibold text-[#3B404B]"
          >
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

        {/* -----urgency */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="urgency"
            className="text-[13px] font-semibold text-[#3B404B]"
          >
            Urgency
          </label>
          <select
            id="urgency"
            value={urgency}
            onChange={(e) => {
              setUrgency(e.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            {urgencyOptions.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* ------total count */}
      <p className="text-sm text-[#5B616E]">
        {bloodRequestsData?.meta.total ?? 0} requests found
      </p>

      {/* ------cards */}
      {bloodRequestsDataLoading ? (
        <p className="py-10 text-center text-[#5B616E]">Loading...</p>
      ) : bloodRequestsData?.data.length === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-10 text-center text-[#5B616E]">
          No request matches these filters.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] justify-items-center gap-[18px]">
          {bloodRequestsData?.data.map((item: IBloodRequest) => (
            <BloodRequestCard
              key={item.id}
              hospitalName={item.hospitalName}
              bloodGroup={item.bloodGroup}
              urgency={item.urgency}
              address={item.address}
              needAt={item.needAt}
              bagsNeeded={item.bagsNeeded}
              patientName={item.patientName}
              phoneNumber={item.phoneNumber}
            />
          ))}
        </div>
      )}

      {/* -----pagination */}
      <ReuseAblePagination
        totalPages={bloodRequestsData?.meta.totalPages ?? 1}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default BloodRequestPage;
