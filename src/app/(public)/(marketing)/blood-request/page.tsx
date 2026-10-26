"use client";
import BloodRequestCard from "@/components/modules/bloodRequest/BloodRequestCard";
import ReuseAblePagination from "@/components/modules/global/ReuseAblePagination";
import { useBloodRequwsts } from "@/hooks";
import { IBloodRequest } from "@/types";
import { useState } from "react";

const BloodRequestPage = () => {
    //   -----current page state
  const [page, setPage] = useState(1);


  // -----getting all blood requests
  const { data: bloodRequestsData, isLoading: bloodRequestsDataLoading } =
    useBloodRequwsts(page);

  console.log(bloodRequestsData);



  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 md:py-12">
      {/* ------cards */}
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

      {/* -----pagination */}
      <ReuseAblePagination
        totalPages={bloodRequestsData?.meta.totalPages}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default BloodRequestPage;
