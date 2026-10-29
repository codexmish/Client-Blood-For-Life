"use client";

import { useGetMe, useLogout } from "@/hooks";
import type { IUser } from "@/types";
import { errorMessage, isAdmin } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { toast } from "../../ui/toast";

// -----sidebar links by role
const sidebarLinks = (user: IUser) => {
  // ----admin dashboard
  if (isAdmin(user.role)) {
    return [
      { label: "Donation report", href: "/dashboard/admin" },
      { label: "Profile & password", href: "/dashboard/profile" },
    ];
  }

  // ----donor dashboard
  if (user.role === "DONOR") {
    return [
      { label: "Overview", href: "/dashboard" },
      { label: "Donor details", href: "/dashboard/donor-details" },
      { label: "My commitments", href: "/dashboard#commitments" },
      { label: "Donation history", href: "/dashboard#history" },
      { label: "My requests", href: "/my-requests" },
      { label: "Profile & password", href: "/dashboard/profile" },
    ];
  }

  // ----not a donor yet
  return [
    { label: "Profile", href: "/dashboard/profile" },
    { label: "Password", href: "/dashboard/profile#password" },
    { label: "My requests", href: "/my-requests" },
    { label: "Become a donor", href: "/become-donor" },
  ];
};

const DashboardShell = ({ children }: { children: ReactNode }) => {
  // -----logged in user
  const { data: userData, isLoading: userDataLoading } = useGetMe();
  const user: IUser | undefined = userData?.data;

  // -----current page for active link
  const pathname = usePathname();
  const router = useRouter();

  // -----logout
  const queryClient = useQueryClient();
  const { mutate: logOut, isPending: logoutPending } = useLogout();

  const handleLogout = () => {
    logOut(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["user"] });
        toast.add({ title: "Logged out", type: "success" });
        router.push("/");
      },
      onError: (err) => {
        toast.add({
          title: "Logout failed",
          description: errorMessage(err),
          type: "error",
        });
      },
    });
  };

  return (
    <div className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-7 px-4 pb-16 pt-8 sm:px-6">
      {userDataLoading ? (
        // -----loading skeleton
        <>
          <div className="h-[260px] min-w-0 flex-[1_1_220px] animate-pulse rounded-2xl bg-[#E9EBEF]" />
          <div className="h-[520px] min-w-0 flex-[999_1_640px] animate-pulse rounded-[18px] border border-[#E3E5EA] bg-white" />
        </>
      ) : !user ? (
        // -----not logged in
        <div className="flex min-w-0 flex-1 flex-col items-start gap-4 rounded-[20px] border border-[#E3E5EA] bg-white p-6 sm:p-8">
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#15171C]">
            Sign in to open your dashboard
          </h1>
          <p className="text-[#5B616E]">
            Your profile, password and requests are here.
          </p>
          <Link
            href="/signin"
            className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#B4232A] px-[22px] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <>
          {/* ------sidebar */}
          <nav
            aria-label="Dashboard"
            className="flex min-w-0 flex-[1_1_220px] flex-col gap-1"
          >
            {sidebarLinks(user).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-[10px] border px-3.5 text-[15px] transition-colors ${
                    isActive
                      ? "border-[#E3E5EA] bg-white font-semibold text-[#15171C]"
                      : "border-transparent font-medium text-[#3B404B] hover:bg-[#E9EBEF] hover:text-[#15171C]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              disabled={logoutPending}
              onClick={handleLogout}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] px-3.5 text-left text-[15px] font-medium text-[#8E1A20] transition-colors hover:bg-[#FBEAEA] disabled:opacity-60"
            >
              <LogOut className="size-[17px]" />
              Log out
            </button>
          </nav>

          {/* ------page content */}
          <main className="flex min-w-0 flex-[999_1_640px] flex-col gap-5">
            {children}
          </main>
        </>
      )}
    </div>
  );
};

export default DashboardShell;
