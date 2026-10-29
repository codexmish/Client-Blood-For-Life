import DonorDetails from "@/components/modules/donor/DonorDetails";
import { Suspense } from "react";

const SingleDonorPage = () => {
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-[22px] px-4 pb-16 pt-7 sm:px-6">
      {/* ----useParams needs suspense (cacheComponents) */}
      <Suspense
        fallback={
          <div className="h-[184px] animate-pulse rounded-[22px] border border-[#E3E5EA] bg-white" />
        }
      >
        <DonorDetails />
      </Suspense>
    </div>
  );
};

export default SingleDonorPage;
