"use client";

import DonationReport from "@/components/modules/admin/DonationReport";
import { useGetMe } from "@/hooks";
import type { IUser } from "@/types";
import { isAdmin } from "@/utils";

const AdminPage = () => {
  // -----logged in user (layout already checked login)
  const { data: userData } = useGetMe();
  const user: IUser | undefined = userData?.data;

  if (!user) return null;

  // -----only admin and super admin
  if (!isAdmin(user.role)) {
    return (
      <section className="flex flex-col items-start gap-3 rounded-[18px] border border-[#E3E5EA] bg-white p-6 sm:p-8">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#15171C]">
          You don’t have access to this page
        </h1>
        <p className="text-[#5B616E]">
          Only admins can see the donation report.
        </p>
      </section>
    );
  }

  return <DonationReport />;
};

export default AdminPage;
