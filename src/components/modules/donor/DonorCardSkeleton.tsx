// -----grey block for skeleton
const block = "animate-pulse rounded-md bg-[#EEF0F3]";

// -----same shape as DonorCard, shown while loading
const DonorCardSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-4 rounded-[18px] border border-[#E3E5EA] bg-white p-[22px]"
    >
      <div className="flex items-center gap-3.5">
        <span className={`${block} size-14 flex-none rounded-full`} />
        <div className="flex flex-1 flex-col gap-2">
          <span className={`${block} h-[18px] w-3/5`} />
          <span className={`${block} h-3.5 w-2/5`} />
        </div>
        <span className={`${block} size-12 flex-none rounded-xl`} />
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F4F5F7] p-3">
        {[1, 2].map((item) => (
          <div key={item} className="flex flex-col gap-1.5">
            <span className={`${block} h-3 w-16 bg-[#E3E5EA]`} />
            <span className={`${block} h-4 w-12 bg-[#E3E5EA]`} />
          </div>
        ))}
      </div>

      <div className="flex gap-2.5">
        <span className={`${block} h-11 flex-1 rounded-[10px]`} />
        <span className={`${block} h-11 flex-1 rounded-[10px]`} />
      </div>
    </div>
  );
};

export default DonorCardSkeleton;
