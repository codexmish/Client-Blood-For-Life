import EditRequest from "@/components/modules/bloodRequest/EditRequest";
import { Suspense } from "react";

const EditBloodRequestPage = () => {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-7 sm:px-6">
      {/* ----useParams needs suspense (cacheComponents) */}
      <Suspense
        fallback={
          <div className="h-[600px] animate-pulse rounded-[20px] border border-[#E3E5EA] bg-white" />
        }
      >
        <EditRequest />
      </Suspense>
    </div>
  );
};

export default EditBloodRequestPage;
