import type { IBloodRequest } from "@/types";
import Link from "next/link";
import { bloodGroupLabel, neededDay, urgencyStyle } from "@/utils";

// -----props this row needs
type TMyRequestRowProps = Pick<
  IBloodRequest,
  | "id"
  | "bloodGroup"
  | "urgency"
  | "patientName"
  | "hospitalName"
  | "address"
  | "needAt"
  | "bagsNeeded"
>;

const MyRequestRow = ({
  id,
  bloodGroup,
  urgency,
  patientName,
  hospitalName,
  address,
  needAt,
  bagsNeeded,
}: TMyRequestRowProps) => {
  return (
    <li className="flex flex-wrap items-center gap-[18px] rounded-[18px] border border-[#E3E5EA] bg-white px-5 py-[18px]">
      {/* ------blood group */}
      <span className="inline-flex size-[60px] flex-none items-center justify-center rounded-[14px] bg-[#FBEAEA] text-[22px] font-bold text-[#8E1A20]">
        {bloodGroupLabel[bloodGroup] ?? bloodGroup}
      </span>

      {/* ------patient and place */}
      <div className="flex min-w-[240px] flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[17px] font-semibold text-[#15171C]">
            {patientName}
          </h2>
          <span
            className={`inline-flex h-6 items-center rounded-full px-[9px] text-[11.5px] font-bold ${urgencyStyle[urgency]}`}
          >
            {urgency}
          </span>
        </div>
        <p className="text-[14.5px] text-[#5B616E]">
          {hospitalName} · {address}
        </p>
      </div>

      {/* ------needed and bags */}
      <dl className="flex gap-7">
        <div>
          <dt className="text-xs text-[#5B616E]">Needed</dt>
          <dd className="mt-0.5 font-semibold text-[#15171C]">
            {neededDay(needAt, true)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#5B616E]">Bags</dt>
          <dd className="mt-0.5 font-semibold text-[#15171C]">{bagsNeeded}</dd>
        </div>
      </dl>

      {/* ------buttons */}
      <div className="flex gap-2">
        <Link
          href={`/blood-request/${id}/edit`}
          className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#D5D8DE] bg-white px-4 text-[15px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4]"
        >
          Edit
        </Link>
        <Link
          href={`/blood-request/${id}`}
          className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#B4232A] px-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
        >
          Open
        </Link>
      </div>
    </li>
  );
};

export default MyRequestRow;
