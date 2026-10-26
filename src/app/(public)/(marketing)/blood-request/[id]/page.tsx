import RequestDetails from "@/components/modules/bloodRequest/RequestDetails";
import { Suspense } from "react";

const SingleBloodRequestPage = () => {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-7 sm:px-6">
      {/* ----useParams needs suspense (cacheComponents) */}
      <Suspense
        fallback={
          <div className="h-[420px] animate-pulse rounded-[20px] border border-[#E3E5EA] bg-white" />
        }
      >
        <RequestDetails />
      </Suspense>
    </div>
  );
};

export default SingleBloodRequestPage;
