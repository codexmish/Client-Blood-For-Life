// -----steps data
const steps = [
  {
    number: "01",
    title: "Post a request",
    text: "Blood group, how many bags, the hospital, the date and a phone number to call.",
  },
  {
    number: "02",
    title: "Donors commit",
    text: "Eligible donors with the same blood group tap “I will donate”. You see their names and numbers.",
  },
  {
    number: "03",
    title: "Mark it fulfilled",
    text: "The donation is recorded for every donor, and they rest for four months before the next one.",
  },
];

const Works = () => {
  return (
    <section
      id="how"
      className="mx-auto flex max-w-[1200px] scroll-mt-6 flex-col gap-8 px-4 py-12 sm:px-6 md:py-[72px]"
    >
      {/* ------heading */}
      <div className="flex max-w-[640px] flex-col gap-2.5">
        <h2 className="text-[30px] font-bold tracking-[-0.02em] text-[#15171C] sm:text-4xl">
          How it works
        </h2>
        <p className="text-[17px] leading-[1.55] text-[#4A505C]">
          Three steps from a request to a recorded donation.
        </p>
      </div>

      {/* ------steps */}
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        {steps.map((step) => (
          <li
            key={step.number}
            className="flex flex-col gap-3 rounded-[18px] border border-[#E3E5EA] bg-white p-6 sm:p-7"
          >
            <span className="text-[40px] font-bold leading-none text-[#B4232A]">
              {step.number}
            </span>
            <h3 className="text-xl font-semibold text-[#15171C]">
              {step.title}
            </h3>
            <p className="leading-[1.55] text-[#4A505C]">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Works;
