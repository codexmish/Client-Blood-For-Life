"use client";

import { useLeaveRequest, useMyCommitments } from "@/hooks";
import type { ISingleBloodRequest } from "@/types";
import { bloodGroupLabel, errorMessage, neededDay } from "@/utils";
import { Phone } from "lucide-react";
import Link from "next/link";
import { Spinner } from "../../ui/spinner";
import { toast } from "../../ui/toast";

// -----open requests i said "I will donate" to
const MyCommitments = () => {
  const { data: commitmentsData, isLoading } = useMyCommitments(true);
  const commitments: ISingleBloodRequest[] = commitmentsData?.data ?? [];

  const { mutate: leave, isPending, variables } = useLeaveRequest();

  const handleLeave = (id: string) => {
    if (!window.confirm("Step back from this request?")) return;

    leave(id, {
      onSuccess: () =>
        toast.add({ title: "You stepped back", type: "success" }),
      onError: (err) =>
        toast.add({
          title: "Could not step back",
          description: errorMessage(err),
          type: "error",
        }),
    });
  };

  return (
    <section
      id="commitments"
      className="flex scroll-mt-6 flex-col gap-3.5 rounded-[18px] border border-[#E3E5EA] bg-white p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[22px] font-bold text-[#15171C]">My commitments</h2>
        <Link
          href="/blood-request"
          className="text-sm font-semibold text-[#B4232A] hover:text-[#8E1A20]"
        >
          Browse requests
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-[14px] bg-[#F4F5F7]"
            />
          ))}
        </div>
      ) : commitments.length === 0 ? (
        <p className="rounded-[14px] bg-[#F4F5F7] px-4 py-6 text-center text-[#5B616E]">
          You have not committed to any open request.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {commitments.map((item) => {
            const leaving = isPending && variables === item.id;
            return (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-3.5 rounded-[14px] border border-[#E3E5EA] p-3.5"
              >
                <span className="inline-flex size-[52px] flex-none items-center justify-center rounded-xl bg-[#FBEAEA] text-[19px] font-bold text-[#8E1A20]">
                  {bloodGroupLabel[item.bloodGroup] ?? item.bloodGroup}
                </span>
                <span className="flex min-w-[200px] flex-1 flex-col gap-0.5">
                  <Link
                    href={`/blood-request/${item.id}`}
                    className="font-semibold text-[#15171C] hover:text-[#B4232A]"
                  >
                    {item.hospitalName}
                  </Link>
                  <span className="text-sm text-[#5B616E]">
                    {neededDay(item.needAt)} · {item.address} · call{" "}
                    {item.phoneNumber}
                  </span>
                </span>
                <a
                  href={`tel:${item.phoneNumber}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-[#D5D8DE] bg-white px-4 text-[14.5px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4]"
                >
                  <Phone className="size-4" />
                  Call
                </a>
                <button
                  type="button"
                  disabled={leaving}
                  onClick={() => handleLeave(item.id)}
                  className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#E6B7B9] bg-white px-4 text-[14.5px] font-semibold text-[#8E1A20] transition-colors hover:bg-[#FBEAEA] disabled:opacity-60"
                >
                  {leaving ? <Spinner /> : "Step back"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default MyCommitments;
