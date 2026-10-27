// -----grey block for skeleton
const block = "animate-pulse rounded-lg bg-[#EEF0F3]";

// -----same shape as BloodRequestCard, shown while loading
const BloodRequestCardSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="flex w-full max-w-[380px] flex-col gap-4 rounded-[18px] border border-[#E3E5EA] bg-white p-[22px]"
    >
      {/* ------blood group and urgency */}
      <div className="flex items-start justify-between gap-3">
        <span className={`${block} size-16 rounded-2xl`} />
        <span className={`${block} h-[26px] w-24 rounded-full`} />
      </div>

      {/* ------hospital and address */}
      <div className="flex flex-col gap-2">
        <span className={`${block} h-5 w-4/5`} />
        <span className={`${block} h-4 w-1/2`} />
      </div>

      {/* ------needed, bags, patient */}
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#F4F5F7] p-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex flex-col gap-1.5">
            <span className={`${block} h-3 w-10 bg-[#E3E5EA]`} />
            <span className={`${block} h-4 w-14 bg-[#E3E5EA]`} />
          </div>
        ))}
      </div>

      {/* ------buttons */}
      <div className="flex gap-2.5">
        <span className={`${block} h-11 flex-1 rounded-[10px]`} />
        <span className={`${block} h-11 flex-[2] rounded-[10px]`} />
      </div>
    </div>
  );
};

export default BloodRequestCardSkeleton;
