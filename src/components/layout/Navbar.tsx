"use client";

import { useGetMe, useLogout } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "../ui/toast";
import { LogOut } from "lucide-react";
import { Menu } from "@base-ui/react/menu";

// -----menu items
const navLinks = [
  { label: "Blood requests", href: "/requests" },
  { label: "Find donors", href: "/donors" },
  { label: "How it works", href: "/#how" },
];

// -----menu items after login
const recipientLinks = [
  { label: "Blood requests", href: "/requests" },
  { label: "Find donors", href: "/donors" },
  { label: "My requests", href: "/my-requests" },
];

const donorLinks = [
  { label: "Blood requests", href: "/requests" },
  { label: "Find donors", href: "/donors" },
  { label: "My dashboard", href: "/dashboard" },
];

const Navbar = () => {
  // -----getting user data
  const { data: userData, isLoading: userDataLoading } = useGetMe();

  // -----user info for showing
  const user = userData?.data;
  
  const isDonor = !!user?.donor;
  const menuLinks = user ? (isDonor ? donorLinks : recipientLinks) : navLinks;
  const initials = user?.name
    ?.split(" ")
    .map((word: string) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ----getting logout data
  const queryClint = useQueryClient();

  const { mutate: logOut } = useLogout();

  // -----logout function
  const handleLogout = () => {
    logOut(undefined, {
      onSuccess: (data) => {
        queryClint.removeQueries({ queryKey: ["user"] });
        toast.add({
          title: data.message,
          description: "Login for your service",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "something bad",
          description: "Try again later",
          type: "error",
        });
      },
    });
  };

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
          {menuLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-2.5 text-[15px] text-[#3B404B] transition-colors hover:bg-[#E9EBEF] hover:text-[#15171C]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ------right side */}
        {userDataLoading ? (
          // -----loading skeleton
          <div className="size-11 animate-pulse rounded-full bg-[#E9EBEF]" />
        ) : user ? (
          // -----after login
          <div className="flex items-center gap-2.5">
            {!isDonor && (
              <Link
                href="/become-donor"
                className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#B4232A] px-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22] sm:px-[18px]"
              >
                Become a donor
              </Link>
            )}
            {/* -----avatar menu */}
            <Menu.Root>
              <Menu.Trigger
                aria-label="Your account"
                className="inline-flex size-11 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#15171C] text-[15px] font-bold text-white outline-none transition-shadow focus-visible:ring-3 focus-visible:ring-[#B4232A]/30 data-popup-open:ring-3 data-popup-open:ring-[#B4232A]/30"
              >
                {user.avater ? (
                  <img
                    src={user.avater}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  initials
                )}
              </Menu.Trigger>

              <Menu.Portal>
                <Menu.Positioner
                  side="bottom"
                  align="end"
                  sideOffset={8}
                  className="z-50"
                >
                  <Menu.Popup className="w-64 origin-(--transform-origin) rounded-2xl border border-[#E3E5EA] bg-white p-2 shadow-[0_12px_32px_-12px_rgba(21,23,28,0.25)] outline-none transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
                    {/* -----name and role */}
                    <div className="flex items-center gap-3 px-2.5 pb-3 pt-2">
                      <span className="inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#15171C] text-[15px] font-bold text-white">
                        {user.avater ? (
                          <img
                            src={user.avater}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </span>
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="truncate text-[15px] font-semibold text-[#15171C]">
                          {user.name}
                        </span>
                        <span className="inline-flex w-fit items-center rounded-full bg-[#FBEAEA] px-2.5 py-0.5 text-[11px] font-bold tracking-[0.04em] text-[#8E1A20]">
                          {user.role?.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="-mx-2 h-px bg-[#E3E5EA]" />

                    {/* -----logout */}
                    <Menu.Item
                      onClick={handleLogout}
                      className="mt-2 flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[10px] px-2.5 text-[15px] font-semibold text-[#8E1A20] outline-none transition-colors data-highlighted:bg-[#FBEAEA]"
                    >
                      <LogOut className="size-[18px]" />
                      Log out
                    </Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </div>
        ) : (
          // -----before login
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
        )}
      </div>
    </header>
  );
};

export default Navbar;
