import type { IDonor } from "@/types";
import { bloodGroupLabel, initialsOf, monthYear } from "@/utils";
import Link from "next/link";

const DonorCard = ({ donor }: { donor: IDonor }) => {
  const { user } = donor;

  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-[#E3E5EA] bg-white p-[22px]">
      {/* ------avatar, name, group */}
      <div className="flex items-center gap-3.5">
        <span className="inline-flex size-14 flex-none items-center justify-center overflow-hidden rounded-full bg-[#EEF0F3] text-[17px] font-bold text-[#15171C]">
          {user.avater ? (
            <img src={user.avater} alt="" className="size-full object-cover" />
          ) : (
            initialsOf(user.name)
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="truncate text-[17px] font-semibold text-[#15171C]">
            <Link
              href={`/donors/${donor.id}`}
              className="hover:text-[#B4232A]"
            >
              {user.name}
            </Link>
          </h2>
          <p className="truncate text-sm text-[#5B616E]">
            {user.address ?? "Address not added"}
          </p>
        </div>
        <span className="inline-flex size-12 flex-none items-center justify-center rounded-xl bg-[#FBEAEA] text-lg font-bold text-[#8E1A20]">
          {bloodGroupLabel[user.bloodGroup] ?? user.bloodGroup}
        </span>
      </div>

      {/* ------donations and last donated */}
      <dl className="grid grid-cols-2 gap-2 rounded-xl bg-[#F4F5F7] p-3">
        <div>
          <dt className="text-xs text-[#5B616E]">Donations</dt>
          <dd className="mt-0.5 font-semibold text-[#15171C]">
            {donor.totalDonations}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#5B616E]">Last donated</dt>
          <dd className="mt-0.5 font-semibold text-[#15171C]">
            {monthYear(donor.lastDonationDate)}
          </dd>
        </div>
      </dl>

      {/* ------buttons */}
      <div className="flex gap-2.5">
        <Link
          href={`/donors/${donor.id}`}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-[10px] border border-[#D5D8DE] bg-white text-[15px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4]"
        >
          View profile
        </Link>
        <Link
          href="/create-request"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-[10px] bg-[#B4232A] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
        >
          Request blood
        </Link>
      </div>
    </article>
  );
};

export default DonorCard;
