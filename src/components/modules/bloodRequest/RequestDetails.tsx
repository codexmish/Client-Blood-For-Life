"use client";

import {
  useDonateToRequest,
  useGetMe,
  useLeaveRequest,
  useMyCommitments,
  useSingleBloodRequest,
  useUpdateRequestStatus,
} from "@/hooks";
import {
  BloodRequestStatus,
  type IBloodRequest,
  type ISingleBloodRequest,
} from "@/types";
import { ChevronLeft, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Spinner } from "../../ui/spinner";
import { toast } from "../../ui/toast";
import { bloodGroupLabel, isAdmin, statusStyle, urgencyStyle } from "@/utils";

// -----design classes
const cardClass =
  "flex flex-col rounded-[20px] border border-[#E3E5EA] bg-white p-6 sm:p-7";
const primaryBtn =
  "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#B4232A] px-5 text-base font-semibold text-white transition-colors hover:bg-[#951C22] disabled:cursor-not-allowed disabled:opacity-60";
const ghostBtn =
  "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#D5D8DE] bg-white px-5 text-base font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4] disabled:cursor-not-allowed disabled:opacity-60";
const dangerBtn =
  "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E6B7B9] bg-white px-5 text-base font-semibold text-[#8E1A20] transition-colors hover:bg-[#FBEAEA] disabled:cursor-not-allowed disabled:opacity-60";

// -----backend error message (ofetch keeps it in err.data)
const errorMessage = (err: unknown) =>
  (err as { data?: { message?: string } }).data?.message ??
  "Something Went Wrong";

// -----first letters of a name
const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const RequestDetails = () => {
  // -----request id from url
  const { id } = useParams<{ id: string }>();

  // -----logged in user
  const { data: userData, isLoading: userDataLoading } = useGetMe();
  const user = userData?.data;
  // ----donor only when role is DONOR (admin may still have a donor profile)
  const donor = user?.role === "DONOR" ? user.donor : null;

  // -----request data
  const {
    data: requestData,
    isLoading: requestLoading,
    error: requestError,
  } = useSingleBloodRequest(id, !!user);
  const request: ISingleBloodRequest | undefined = requestData?.data;

  // -----my commitments (to know if i already joined)
  const { data: commitmentsData } = useMyCommitments(!!donor);
  const isCommitted = !!commitmentsData?.data?.some(
    (item: IBloodRequest) => item.id === id,
  );

  // -----actions
  const { mutate: donate, isPending: donatePending } = useDonateToRequest();
  const { mutate: leave, isPending: leavePending } = useLeaveRequest();
  const { mutate: updateStatus, isPending: statusPending } =
    useUpdateRequestStatus();

  const handleDonate = () => {
    donate(id, {
      onSuccess: () =>
        toast.add({
          title: "You are committed",
          description: "Call the requester to confirm a time",
          type: "success",
        }),
      onError: (err) =>
        toast.add({
          title: "Could not join",
          description: errorMessage(err),
          type: "error",
        }),
    });
  };

  const handleLeave = () => {
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

  const handleStatus = (
    status: BloodRequestStatus.FULFILLED | BloodRequestStatus.CANCELLED,
  ) => {
    const sure = window.confirm(
      status === BloodRequestStatus.FULFILLED
        ? "Mark this request as fulfilled? This can't be undone."
        : "Cancel this request? This can't be undone.",
    );
    if (!sure) return;

    updateStatus(
      { id, status },
      {
        onSuccess: () =>
          toast.add({
            title:
              status === BloodRequestStatus.FULFILLED
                ? "Request fulfilled"
                : "Request cancelled",
            type: "success",
          }),
        onError: (err) =>
          toast.add({
            title: "Could not update",
            description: errorMessage(err),
            type: "error",
          }),
      },
    );
  };

  // -----back link
  const backLink = (
    <Link
      href="/blood-request"
      className="inline-flex min-h-11 items-center gap-1.5 self-start text-[15px] font-semibold text-[#B4232A] hover:text-[#8E1A20]"
    >
      <ChevronLeft className="size-4" strokeWidth={2.4} />
      Back to requests
    </Link>
  );

  // -----loading
  if (userDataLoading || (user && requestLoading)) {
    return (
      <div className="flex flex-col gap-[22px]">
        {backLink}
        <div className="h-[420px] animate-pulse rounded-[20px] border border-[#E3E5EA] bg-white" />
      </div>
    );
  }

  // -----not logged in
  if (!user) {
    return (
      <div className="flex flex-col gap-[22px]">
        {backLink}
        <div className={`${cardClass} items-start gap-4`}>
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#15171C]">
            Sign in to see this request
          </h1>
          <p className="text-[#5B616E]">
            Request details are only shown to signed in users.
          </p>
          <Link href="/signin" className={primaryBtn}>
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  // -----not found or error
  if (requestError || !request) {
    return (
      <div className="flex flex-col gap-[22px]">
        {backLink}
        <div className={`${cardClass} items-start gap-3`}>
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#15171C]">
            Request not found
          </h1>
          <p className="text-[#5B616E]">{errorMessage(requestError)}</p>
        </div>
      </div>
    );
  }

  // -----values for showing
  const isOwner = request.requesterId === user.id;
  const isOpen = request.status === BloodRequestStatus.OPEN;
  const joined = request._count.donors;
  const covered = Math.min(joined / request.bagsNeeded, 1) * 100;
  const groupLabel = bloodGroupLabel[request.bloodGroup] ?? request.bloodGroup;
  const neededOn = new Date(request.needAt).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // -----next date this donor can give
  let nextDonationDate: Date | null = null;
  if (donor?.lastDonationDate) {
    const next = new Date(donor.lastDonationDate);
    next.setMonth(next.getMonth() + 4);
    if (next > new Date()) nextDonationDate = next;
  }

  // -----why this donor can't join (null = can join)
  let cantJoinReason: string | null = null;
  if (isAdmin(user.role))
    cantJoinReason = "Admin accounts can’t commit to requests.";
  else if (!donor) cantJoinReason = "notDonor";
  else if (user.bloodGroup !== request.bloodGroup)
    cantJoinReason = `This request needs ${groupLabel} blood. Your blood group is different.`;
  else if (!donor.isAvailable)
    cantJoinReason =
      "Your availability is off. Turn it on from your dashboard to join.";
  else if (nextDonationDate)
    cantJoinReason = `You donated in the last four months. You can give again from ${nextDonationDate.toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "short", year: "numeric" },
    )}.`;
  else if (joined >= request.bagsNeeded)
    cantJoinReason = "This request already has enough donors.";

  return (
    <div className="flex flex-col gap-[22px]">
      {backLink}

      <div className="flex flex-wrap items-start gap-6">
        {/* ------main */}
        <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
          <div className={`${cardClass} gap-[22px]`}>
            {/* -----group, badges, title */}
            <div className="flex flex-wrap items-center gap-[18px]">
              <span className="inline-flex size-[84px] flex-none items-center justify-center rounded-[20px] bg-[#FBEAEA] text-[32px] font-bold text-[#8E1A20]">
                {groupLabel}
              </span>
              <div className="flex min-w-[220px] flex-1 flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex h-[26px] items-center rounded-full px-2.5 text-xs font-bold ${statusStyle[request.status]}`}
                  >
                    {request.status}
                  </span>
                  <span
                    className={`inline-flex h-[26px] items-center rounded-full px-2.5 text-xs font-bold ${urgencyStyle[request.urgency]}`}
                  >
                    {request.urgency}
                  </span>
                </div>
                <h1 className="text-[26px] font-bold tracking-[-0.015em] text-[#15171C] sm:text-[32px]">
                  Blood for {request.patientName}
                </h1>
              </div>
            </div>

            {/* -----details */}
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[18px]">
              <div>
                <dt className="text-[13px] text-[#5B616E]">Hospital</dt>
                <dd className="mt-1 font-semibold text-[#15171C]">
                  {request.hospitalName}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-[#5B616E]">Address</dt>
                <dd className="mt-1 font-semibold text-[#15171C]">
                  {request.address}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-[#5B616E]">Needed on</dt>
                <dd className="mt-1 font-semibold text-[#15171C]">
                  {neededOn}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-[#5B616E]">Contact</dt>
                <dd className="mt-1 font-semibold">
                  <a
                    href={`tel:${request.phoneNumber}`}
                    className="text-[#B4232A] hover:text-[#8E1A20]"
                  >
                    {request.phoneNumber}
                  </a>
                </dd>
              </div>
            </dl>

            {/* -----note */}
            {request.note && (
              <div className="rounded-[14px] bg-[#F4F5F7] p-4">
                <p className="mb-1 text-[13px] font-semibold text-[#5B616E]">
                  Note
                </p>
                <p className="leading-[1.55] text-[#15171C]">{request.note}</p>
              </div>
            )}

            {/* -----progress (others see it here) */}
            {!isOwner && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="font-semibold text-[#15171C]">
                    {joined} of {request.bagsNeeded} donors committed
                  </span>
                  <span className="text-[#5B616E]">
                    {request.bagsNeeded}{" "}
                    {request.bagsNeeded === 1 ? "bag" : "bags"} needed
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Donors committed"
                  aria-valuemin={0}
                  aria-valuemax={request.bagsNeeded}
                  aria-valuenow={joined}
                  className="h-2.5 overflow-hidden rounded-full bg-[#EEF0F3]"
                >
                  <div
                    className="h-full rounded-full bg-[#1D7A50] transition-[width]"
                    style={{ width: `${covered}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* -----committed donors (only owner) */}
          {isOwner && (
            <div className={`${cardClass} gap-[18px]`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[22px] font-bold text-[#15171C]">
                  Donors who committed
                </h2>
                <span className="font-semibold text-[#3B404B]">
                  {joined} of {request.bagsNeeded} bags covered
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Bags covered"
                aria-valuemin={0}
                aria-valuemax={request.bagsNeeded}
                aria-valuenow={joined}
                className="h-2.5 overflow-hidden rounded-full bg-[#EEF0F3]"
              >
                <div
                  className="h-full rounded-full bg-[#1D7A50] transition-[width]"
                  style={{ width: `${covered}%` }}
                />
              </div>

              {request.donors && request.donors.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {request.donors.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center gap-3.5 rounded-[14px] border border-[#E3E5EA] p-3.5"
                    >
                      <span className="inline-flex size-12 flex-none items-center justify-center overflow-hidden rounded-full bg-[#EEF0F3] font-bold text-[#15171C]">
                        {item.user.avater ? (
                          <img
                            src={item.user.avater}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          initialsOf(item.user.name)
                        )}
                      </span>
                      <span className="flex min-w-40 flex-1 flex-col gap-0.5">
                        <span className="font-semibold text-[#15171C]">
                          {item.user.name}
                        </span>
                        <span className="text-sm text-[#5B616E]">
                          {bloodGroupLabel[item.user.bloodGroup]} ·{" "}
                          {item.user.phone ?? "No phone"}
                        </span>
                      </span>
                      {item.user.phone && (
                        <a href={`tel:${item.user.phone}`} className={ghostBtn}>
                          <Phone className="size-[17px]" />
                          Call
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-[14px] bg-[#F4F5F7] px-4 py-6 text-center text-[#5B616E]">
                  No donor has committed yet.
                </p>
              )}
              <p className="text-sm text-[#5B616E]">
                Only you can see these phone numbers.
              </p>
            </div>
          )}
        </section>

        {/* ------side */}
        <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
          {/* -----owner actions */}
          {isOwner && isOpen && (
            <div className={`${cardClass} gap-3`}>
              <h2 className="text-xl font-bold text-[#15171C]">
                Got the blood?
              </h2>
              <p className="text-[15px] leading-[1.55] text-[#4A505C]">
                Marking this request fulfilled records a donation for every
                committed donor. It can’t be undone.
              </p>
              <button
                type="button"
                disabled={statusPending}
                onClick={() => handleStatus(BloodRequestStatus.FULFILLED)}
                className={primaryBtn}
              >
                {statusPending ? <Spinner /> : "Mark as fulfilled"}
              </button>
              <Link href={`/blood-request/${id}/edit`} className={ghostBtn}>
                Edit request
              </Link>
              <button
                type="button"
                disabled={statusPending}
                onClick={() => handleStatus(BloodRequestStatus.CANCELLED)}
                className={dangerBtn}
              >
                Cancel request
              </button>
            </div>
          )}

          {/* -----request closed */}
          {!isOpen && (
            <div className={`${cardClass} gap-2`}>
              <h2 className="text-xl font-bold text-[#15171C]">
                {request.status === BloodRequestStatus.FULFILLED
                  ? "This request is fulfilled"
                  : "This request was cancelled"}
              </h2>
              <p className="text-[15px] leading-[1.55] text-[#4A505C]">
                It no longer accepts donors.
              </p>
            </div>
          )}

          {/* -----already committed */}
          {!isOwner && isOpen && isCommitted && (
            <div className="flex flex-col gap-3.5 rounded-[20px] border border-[#BFE0CD] bg-[#E6F2EC] p-[26px]">
              <h2 className="text-[22px] font-bold text-[#1D5E40]">
                You are committed
              </h2>
              <p className="leading-[1.55] text-[#24533D]">
                The requester can now see your name and phone. Call them to
                confirm a time.
              </p>
              <a href={`tel:${request.phoneNumber}`} className={primaryBtn}>
                Call {request.phoneNumber}
              </a>
              <button
                type="button"
                disabled={leavePending}
                onClick={handleLeave}
                className={dangerBtn}
              >
                {leavePending ? <Spinner /> : "Step back"}
              </button>
            </div>
          )}

          {/* -----can join */}
          {!isOwner && isOpen && !isCommitted && !cantJoinReason && (
            <div className={`${cardClass} gap-3.5`}>
              <h2 className="text-[22px] font-bold text-[#15171C]">
                You can help
              </h2>
              <p className="leading-[1.55] text-[#4A505C]">
                You are {groupLabel} and eligible today. Commit, then call the
                number to arrange the donation.
              </p>
              <button
                type="button"
                disabled={donatePending}
                onClick={handleDonate}
                className={primaryBtn}
              >
                {donatePending ? <Spinner /> : "I will donate"}
              </button>
              <a href={`tel:${request.phoneNumber}`} className={ghostBtn}>
                Call {request.phoneNumber}
              </a>
            </div>
          )}

          {/* -----not a donor */}
          {!isOwner &&
            isOpen &&
            !isCommitted &&
            cantJoinReason === "notDonor" && (
              <div className={`${cardClass} gap-3.5`}>
                <h2 className="text-[22px] font-bold text-[#15171C]">
                  Want to donate?
                </h2>
                <p className="leading-[1.55] text-[#4A505C]">
                  Become a donor to commit to blood requests. You can still call
                  the requester now.
                </p>
                <Link href="/become-donor" className={primaryBtn}>
                  Become a donor
                </Link>
                <a href={`tel:${request.phoneNumber}`} className={ghostBtn}>
                  Call {request.phoneNumber}
                </a>
              </div>
            )}

          {/* -----donor but can't join */}
          {!isOwner &&
            isOpen &&
            !isCommitted &&
            cantJoinReason &&
            cantJoinReason !== "notDonor" && (
              <div className={`${cardClass} gap-3.5`}>
                <h2 className="text-[22px] font-bold text-[#15171C]">
                  You can’t join this one
                </h2>
                <p className="leading-[1.55] text-[#4A505C]">
                  {cantJoinReason}
                </p>
                <a href={`tel:${request.phoneNumber}`} className={ghostBtn}>
                  Call {request.phoneNumber}
                </a>
              </div>
            )}

          {/* -----info box */}
          <div className="flex flex-col gap-2.5 rounded-[20px] border border-dashed border-[#D5D8DE] bg-white p-6">
            {isOwner ? (
              <>
                <h2 className="font-semibold text-[#15171C]">
                  What donors see
                </h2>
                <p className="text-[14.5px] leading-[1.55] text-[#4A505C]">
                  Other people see the request, the contact number and how many
                  donors joined — not the donors’ names or phones. A matching
                  donor gets an “I will donate” button here.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-[#15171C]">
                  When the button is not shown
                </h2>
                <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[14.5px] leading-normal text-[#4A505C]">
                  <li>Your blood group is different</li>
                  <li>You donated in the last four months</li>
                  <li>Your availability is off</li>
                  <li>The request already has enough donors</li>
                  <li>It is your own request</li>
                </ul>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RequestDetails;
