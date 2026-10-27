import type { IBloodRequest } from "@/types";
import { Phone } from "lucide-react";
import Link from "next/link";
import { bloodGroupLabel, neededDay, shortName, urgencyStyle } from "@/utils";

// -----props this card needs
type TBloodRequestCardProps = Pick<
  IBloodRequest,
  | "id"
  | "bloodGroup"
  | "urgency"
  | "hospitalName"
  | "address"
  | "needAt"
  | "bagsNeeded"
  | "patientName"
  | "phoneNumber"
>;

const BloodRequestCard = ({
  bloodGroup,
  urgency,
  hospitalName,
  address,
  needAt,
  bagsNeeded,
  patientName,
  phoneNumber,
  id,
}: TBloodRequestCardProps) => {
  return (
    <article className="flex w-full max-w-[380px] flex-col gap-4 rounded-[18px] border border-[#E3E5EA] bg-white p-[22px]">
      {/* ------blood group and urgency */}
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex size-16 flex-none items-center justify-center rounded-2xl bg-[#FBEAEA] text-2xl font-bold text-[#8E1A20]">
          {bloodGroupLabel[bloodGroup] ?? bloodGroup}
        </span>
        <span
          className={`inline-flex h-[26px] items-center rounded-full px-2.5 text-xs font-bold ${urgencyStyle[urgency]}`}
        >
          {urgency}
        </span>
      </div>

      {/* ------hospital and address */}
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="truncate text-lg font-semibold text-[#15171C]">
          {hospitalName}
        </h3>
        <p className="truncate text-[14.5px] text-[#5B616E]">{address}</p>
      </div>

      {/* ------needed, bags, patient */}
      <dl className="grid grid-cols-3 gap-2 rounded-xl bg-[#F4F5F7] p-3">
        <div className="min-w-0">
          <dt className="text-xs text-[#5B616E]">Needed</dt>
          <dd className="mt-0.5 truncate text-[14.5px] font-semibold text-[#15171C]">
            {neededDay(needAt)}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-[#5B616E]">Bags</dt>
          <dd className="mt-0.5 text-[14.5px] font-semibold text-[#15171C]">
            {bagsNeeded}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-[#5B616E]">Patient</dt>
          <dd className="mt-0.5 truncate text-[14.5px] font-semibold text-[#15171C]">
            {shortName(patientName)}
          </dd>
        </div>
      </dl>

      {/* ------buttons */}
      <div className="flex gap-2.5">
        <a
          href={`tel:${phoneNumber}`}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[10px] border border-[#D5D8DE] bg-white text-[15px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4]"
        >
          <Phone className="size-[17px]" />
          Call
        </a>
        <Link
          href={`/blood-request/${id}`}
          className="inline-flex h-11 flex-[2] items-center justify-center rounded-[10px] bg-[#B4232A] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
        >
          View &amp; donate
        </Link>
      </div>
    </article>
  );
};

export default BloodRequestCard;
