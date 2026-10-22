import Link from "next/link";

// -----footer links
const footerLinks = [
  { label: "Blood requests", href: "/requests" },
  { label: "Find donors", href: "/donors" },
  { label: "Post a request", href: "/create-request" },
];

const Footer = () => {
  return (
    <footer className="border-t border-[#E3E5EA] bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-4 px-4 py-7 text-sm text-[#5B616E] sm:px-6">
        <span>© Blood For Life</span>

        {/* ------links */}
        <nav aria-label="Footer" className="flex flex-wrap gap-5">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#3B404B] underline underline-offset-2 transition-colors hover:text-[#8E1A20]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
