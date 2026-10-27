import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import React, { type ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
