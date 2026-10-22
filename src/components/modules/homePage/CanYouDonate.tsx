"use client";

import { useGetMe } from "@/hooks";
import Link from "next/link";

// -----donate rules
const donateRules = [
  "Weight at least 50 kg",
  "Four months since your last donation",
  "Feeling well on the day",
];

const CanYouDonate = () => {
  // -----checking login
  const { data: userData, isLoading: userDataLoading } = useGetMe();
  const user = userData?.data;
  const isDonor = !!user?.donor;

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-[72px]">
      <div className="flex flex-wrap items-center gap-8 rounded-[22px] border border-[#E3E5EA] bg-white p-6 sm:p-10">
        {/* ------left side text */}
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3">
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-[#15171C] sm:text-[32px]">
            Can you donate?
          </h2>
          <ul className="list-disc pl-5 text-base leading-[1.8] text-[#4A505C]">
            {donateRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <p className="text-[15px] text-[#5B616E]">
            {isDonor
              ? "You are already a donor. Keep your availability up to date."
              : user
                ? "Turn on donor mode so people who need your blood group can find you."
                : "Create an account, then turn on donor mode from your profile."}
          </p>
        </div>

        {/* ------button */}
        <div className="flex flex-wrap gap-3">
          {userDataLoading ? (
            // -----loading skeleton
            <div className="h-[52px] w-48 animate-pulse rounded-[10px] bg-[#E9EBEF]" />
          ) : (
            <Link
              href={isDonor ? "/dashboard" : user ? "/become-donor" : "/signup"}
              className="inline-flex h-[52px] items-center justify-center rounded-[10px] bg-[#B4232A] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
            >
              {isDonor
                ? "Go to dashboard"
                : user
                  ? "Become a donor"
                  : "Create an account"}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CanYouDonate;
