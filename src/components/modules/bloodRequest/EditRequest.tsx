"use client";

import BloodRequestForm from "@/components/form/BloodRequestForm";
import { useGetMe, useSingleBloodRequest } from "@/hooks";
import { BloodRequestStatus, type ISingleBloodRequest } from "@/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// -----design classes
const cardClass =
  "flex min-w-0 flex-[999_1_600px] flex-col items-start gap-3 rounded-[20px] border border-[#E3E5EA] bg-white p-6 sm:p-8";
const titleClass = "text-[28px] font-bold tracking-[-0.02em] text-[#15171C]";

const EditRequest = () => {
  // -----request id from url
  const { id } = useParams<{ id: string }>();

  // -----logged in user
  const { data: userData, isLoading: userDataLoading } = useGetMe();
  const user = userData?.data;

  // -----request data
  const { data: requestData, isLoading: requestLoading } =
    useSingleBloodRequest(id, !!user);
  const request: ISingleBloodRequest | undefined = requestData?.data;

  // -----which message to show instead of the form
  let blocked: { title: string; text: string } | null = null;
  if (!userDataLoading && !user) {
    blocked = {
      title: "Sign in to edit",
      text: "Only the person who posted a request can edit it.",
    };
  } else if (!requestLoading && user && !request) {
    blocked = {
      title: "Request not found",
      text: "It may have been removed.",
    };
  } else if (request && request.requesterId !== user?.id) {
    blocked = {
      title: "You can’t edit this request",
      text: "Only the person who posted it can edit it.",
    };
  } else if (request && request.status !== BloodRequestStatus.OPEN) {
    blocked = {
      title: "This request is closed",
      text: "Fulfilled or cancelled requests can’t be edited.",
    };
  }

  const isLoading = userDataLoading || (!!user && requestLoading);

  return (
    <div className="flex flex-col gap-[22px]">
      <Link
        href={`/blood-request/${id}`}
        className="inline-flex min-h-11 items-center gap-1.5 self-start text-[15px] font-semibold text-[#B4232A] hover:text-[#8E1A20]"
      >
        <ChevronLeft className="size-4" strokeWidth={2.4} />
        Back to request
      </Link>

      <div className="flex flex-wrap items-start gap-8">
        {isLoading ? (
          <div className="h-[600px] min-w-0 flex-[999_1_600px] animate-pulse rounded-[20px] border border-[#E3E5EA] bg-white" />
        ) : blocked ? (
          <div className={cardClass}>
            <h1 className={titleClass}>{blocked.title}</h1>
            <p className="text-[#5B616E]">{blocked.text}</p>
          </div>
        ) : (
          request && <BloodRequestForm editRequest={request} />
        )}

        {/* ------side note */}
        <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5 rounded-[20px] bg-[#15171C] p-[26px] text-[#F4F5F7]">
          <h2 className="text-xl font-bold">Before you edit</h2>
          <ul className="flex list-disc flex-col gap-2.5 pl-5 leading-normal text-[#D7DAE0]">
            <li>Donors who already joined see the new details.</li>
            <li>
              If donors joined, the blood group is locked and bags can’t go
              below the number of donors.
            </li>
            <li>Only open requests can be edited.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default EditRequest;
