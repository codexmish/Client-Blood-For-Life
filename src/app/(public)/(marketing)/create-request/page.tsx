"use client";

import BloodRequestForm from "@/components/form/BloodRequestForm";
import { useGetMe } from "@/hooks";
import Link from "next/link";

const CreateRequestPage = () => {
  // -----checking login
  const { data: userData, isLoading: userDataLoading } = useGetMe();
  const user = userData?.data;

  return (
    <div className="mx-auto flex max-w-[1200px] flex-wrap items-start gap-8 px-4 py-10 sm:px-6 md:pb-16">
      {/* ------form or login message */}
      {userDataLoading ? (
        <div className="h-[600px] min-w-0 flex-[999_1_600px] animate-pulse rounded-[20px] border border-[#E3E5EA] bg-white" />
      ) : user ? (
        <BloodRequestForm />
      ) : (
        <div className="flex min-w-0 flex-[999_1_600px] flex-col items-start gap-4 rounded-[20px] border border-[#E3E5EA] bg-white p-6 sm:p-8">
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#15171C]">
            Sign in to post a request
          </h1>
          <p className="text-[#5B616E]">
            You need an account so donors who commit can reach you.
          </p>
          <Link
            href="/signin"
            className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#B4232A] px-[22px] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
          >
            Sign in
          </Link>
        </div>
      )}

      {/* ------what happens next */}
      <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
        <div className="flex flex-col gap-3.5 rounded-[20px] bg-[#15171C] p-[26px] text-[#F4F5F7]">
          <h2 className="text-xl font-bold">What happens next</h2>
          <ol className="flex list-decimal flex-col gap-2.5 pl-5 leading-normal text-[#D7DAE0]">
            <li>
              Your request appears in the feed for donors with the same blood
              group.
            </li>
            <li>
              Donors who commit show up on your request with their phone
              numbers.
            </li>
            <li>
              When you have the blood, mark it fulfilled so their donation is
              recorded.
            </li>
          </ol>
        </div>
        <p className="px-1.5 text-sm leading-[1.55] text-[#5B616E]">
          The request stops showing in the feed after the needed date passes.
        </p>
      </aside>
    </div>
  );
};

export default CreateRequestPage;
