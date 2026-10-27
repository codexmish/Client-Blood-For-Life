// -----grey block for skeleton
const block = "animate-pulse rounded-md bg-[#EEF0F3]";

// -----same shape as MyRequestRow, shown while loading
const MyRequestRowSkeleton = () => {
  return (
    <li
      aria-hidden="true"
      className="flex flex-wrap items-center gap-[18px] rounded-[18px] border border-[#E3E5EA] bg-white px-5 py-[18px]"
    >
      {/* ------blood group */}
      <span className={`${block} size-[60px] flex-none rounded-[14px]`} />

      {/* ------patient and place */}
      <div className="flex min-w-[240px] flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={`${block} h-[18px] w-32`} />
          <span className={`${block} h-6 w-[70px] rounded-full`} />
        </div>
        <span className={`${block} h-4 w-56 max-w-full`} />
      </div>

      {/* ------needed and bags */}
      <div className="flex gap-7">
        {[1, 2].map((item) => (
          <div key={item} className="flex flex-col gap-1.5">
            <span className={`${block} h-3 w-12`} />
            <span className={`${block} h-[18px] w-14`} />
          </div>
        ))}
      </div>

      {/* ------buttons */}
      <div className="flex gap-2">
        <span className={`${block} h-11 w-[60px] rounded-[10px]`} />
        <span className={`${block} h-11 w-[68px] rounded-[10px]`} />
      </div>
    </li>
  );
};

export default MyRequestRowSkeleton;
