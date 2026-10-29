import Link from "next/link";

// -----blood group list
const bloodGroups = [
  { label: "A+", value: "A_POSITIVE" },
  { label: "A−", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B−", value: "B_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB−", value: "AB_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "O−", value: "O_NEGATIVE" },
];

const FindDonor = () => {
  return (
    <section className="border-y border-[#E3E5EA] bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-4 py-12 sm:px-6">
        {/* ------heading */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-[26px] font-bold tracking-[-0.015em] text-[#15171C] sm:text-[30px]">
            Find a donor by blood group
          </h2>
        </div>

        {/* ------blood group buttons */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
          {bloodGroups.map((item) => (
            <Link
              key={item.value}
              href={`/donors?bloodGroup=${item.value}`}
              className="flex min-h-[88px] flex-col items-center justify-center gap-0.5 rounded-[14px] border border-[#E3E5EA] bg-white text-[#15171C] transition-colors hover:border-[#B4232A] hover:bg-[#FBEAEA]/40"
            >
              <span className="text-[26px] font-bold text-[#8E1A20]">
                {item.label}
              </span>
              <span className="text-[13px] text-[#5B616E]">Find donors</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FindDonor;
