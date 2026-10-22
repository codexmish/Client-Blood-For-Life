import Link from "next/link";

// -----menu items
const navLinks = [
  { label: "Blood requests", href: "/requests" },
  { label: "Find donors", href: "/donors" },
  { label: "How it works", href: "/#how" },
];

const Navbar = () => {
  return (
    <header className="border-b border-[#E3E5EA] bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 sm:px-6">
        {/* ------logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[21px] font-bold tracking-tight text-[#15171C]"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 2.5C12 2.5 5 10.2 5 15a7 7 0 0 0 14 0c0-4.8-7-12.5-7-12.5Z"
              fill="#B4232A"
            />
            <path
              d="M9.5 15.5a2.5 2.5 0 0 0 2.5 2.5"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Blood For Life
        </Link>

        {/* ------menu */}
        <nav
          aria-label="Main"
          className="order-last -mx-3 flex w-[calc(100%+1.5rem)] items-center gap-1 overflow-x-auto md:order-none md:mx-0 md:w-auto"
        >
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-2.5 text-[15px] text-[#3B404B] transition-colors hover:bg-[#E9EBEF] hover:text-[#15171C]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ------buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/signin"
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#D5D8DE] bg-white px-4 text-[15px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4] sm:px-[18px]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#B4232A] px-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22] sm:px-[18px]"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
