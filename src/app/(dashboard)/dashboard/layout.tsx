import Navbar from "@/components/layout/Navbar";
import DashboardShell from "@/components/modules/dashboard/DashboardShell";
import type { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-svh bg-[#F4F5F7]">
      <Navbar />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
};

export default DashboardLayout;
