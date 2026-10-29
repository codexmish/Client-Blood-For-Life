import DonorList from "@/components/modules/donor/DonorList";
import { Suspense } from "react";

const DonorsPage = () => {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 pb-16 pt-10 sm:px-6">
      {/* ------heading */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[32px] font-bold tracking-[-0.02em] text-[#15171C] sm:text-[40px]">
          Find donors
        </h1>
        <p className="text-base text-[#5B616E]">
          Donors who are available and can give today. Post a request to get
          their phone numbers.
        </p>
      </div>

      {/* ----useSearchParams needs suspense (cacheComponents) */}
      <Suspense
        fallback={
          <div className="h-[170px] animate-pulse rounded-2xl border border-[#E3E5EA] bg-white" />
        }
      >
        <DonorList />
      </Suspense>
    </div>
  );
};

export default DonorsPage;
