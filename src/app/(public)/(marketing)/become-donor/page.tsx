"use client";

import BecomeDonorForm from "@/components/form/BecomeDonorForm";
import { useGetMe } from "@/hooks";
import type { IUser } from "@/types";
import { bloodGroupLabel } from "@/utils";
import { Check, X } from "lucide-react";
import Link from "next/link";

// -----design classes
const cardClass =
  "flex min-w-0 flex-[999_1_560px] flex-col gap-6 rounded-[20px] border border-[#E3E5EA] bg-white p-6 sm:p-8";
const titleClass =
  "text-[30px] font-bold tracking-[-0.02em] text-[#15171C] sm:text-[36px]";
const primaryBtn =
  "inline-flex h-12 items-center justify-center rounded-[10px] bg-[#B4232A] px-[22px] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]";

const BecomeDonorPage = () => {
  // -----logged in user
  const { data: userData, isLoading: userDataLoading } = useGetMe();
  const user: IUser | undefined = userData?.data;

  // -----phone and address are needed (backend checks too)
  const checks = user
    ? [
        {
          done: !!user.phone,
          doneText: `Phone number added — ${user.phone}`,
          missingText: "Phone number missing",
        },
        {
          done: !!user.address,
          doneText: `Address added — ${user.address}`,
          missingText: "Address missing",
        },
      ]
    : [];
  const canSubmit = checks.every((item) => item.done);

  // -----main card content
  let content: React.ReactNode;

  if (userDataLoading) {
    content = (
      <div className="h-[560px] min-w-0 flex-[999_1_560px] animate-pulse rounded-[20px] border border-[#E3E5EA] bg-white" />
    );
  } else if (!user) {
    // ----not logged in
    content = (
      <section className={`${cardClass} items-start gap-4`}>
        <h1 className={titleClass}>Become a donor</h1>
        <p className="text-[#5B616E]">
          Create an account or sign in first, then turn on donor mode.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/signin" className={primaryBtn}>
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#D5D8DE] bg-white px-[22px] text-[15px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4]"
          >
            Create an account
          </Link>
        </div>
      </section>
    );
  } else if (user.donor) {
    // ----already donor
    content = (
      <section className={`${cardClass} items-start gap-4`}>
        <h1 className={titleClass}>You are already a donor</h1>
        <p className="text-[#5B616E]">
          Thank you. Keep your availability up to date from your dashboard.
        </p>
        <Link href="/blood-request" className={primaryBtn}>
          See blood requests
        </Link>
      </section>
    );
  } else if (user.role !== "RECIPIENT") {
    // ----admin accounts can't become donor
    content = (
      <section className={`${cardClass} items-start gap-4`}>
        <h1 className={titleClass}>Not available for this account</h1>
        <p className="text-[#5B616E]">
          Admin accounts can’t register as donors.
        </p>
      </section>
    );
  } else {
    content = (
      <section className={cardClass}>
        {/* ------heading */}
        <div className="flex flex-col gap-2">
          <h1 className={titleClass}>Become a donor</h1>
          <p className="text-base leading-[1.55] text-[#4A505C]">
            You will show up when someone searches for{" "}
            {bloodGroupLabel[user.bloodGroup]} donors near you, and you can
            commit to blood requests.
          </p>
        </div>

        {/* ------before you start */}
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[15px] font-semibold text-[#15171C]">
            Before you start
          </h2>
          <ul className="flex flex-col gap-2">
            {checks.map((item) => (
              <li
                key={item.missingText}
                className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 font-medium ${
                  item.done
                    ? "bg-[#E6F2EC] text-[#1D5E40]"
                    : "bg-[#FBEAEA] text-[#8E1A20]"
                }`}
              >
                {item.done ? (
                  <Check className="size-[18px] flex-none" strokeWidth={2.4} />
                ) : (
                  <X className="size-[18px] flex-none" strokeWidth={2.4} />
                )}
                <span className="min-w-0 break-words">
                  {item.done ? item.doneText : item.missingText}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-[#5B616E]">
            {canSubmit ? "Need to change them? " : "Missing one? "}
            <Link
              href="/dashboard/profile"
              className="font-semibold text-[#B4232A] hover:text-[#8E1A20]"
            >
              {canSubmit ? "Edit your profile" : "Add it in your profile"}
            </Link>
            {canSubmit ? "." : " first."}
          </p>
        </div>

        {/* ------form */}
        <BecomeDonorForm canSubmit={canSubmit} />
      </section>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1200px] flex-wrap items-start gap-8 px-4 pb-16 pt-10 sm:px-6">
      {content}

      {/* ------what changes */}
      <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-[20px] border border-[#E3E5EA] bg-white p-[26px]">
        <h2 className="text-xl font-bold text-[#15171C]">What changes</h2>
        <ul className="flex list-disc flex-col gap-2.5 pl-5 leading-normal text-[#4A505C]">
          <li>Your account becomes a donor account.</li>
          <li>You can switch availability off any time.</li>
          <li>Your phone is shared only with requesters you commit to.</li>
          <li>After each donation you rest for four months.</li>
        </ul>
      </aside>
    </div>
  );
};

export default BecomeDonorPage;
