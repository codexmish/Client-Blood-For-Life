"use client";

import ChangePasswordForm from "@/components/form/ChangePasswordForm";
import ProfileForm from "@/components/form/ProfileForm";
import AvatarUpload from "@/components/modules/dashboard/AvatarUpload";
import { useGetMe } from "@/hooks";
import type { IUser } from "@/types";
import Link from "next/link";

// -----design classes
const cardClass =
  "flex flex-col gap-[22px] rounded-[18px] border border-[#E3E5EA] bg-white p-6 sm:p-[26px]";

const ProfilePage = () => {
  // -----logged in user (layout already checked login)
  const { data: userData } = useGetMe();
  const user: IUser | undefined = userData?.data;

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* ------become a donor box (only when not donor) */}
      {!user.donor && (
        <section className="flex flex-wrap items-center gap-[18px] rounded-[18px] bg-[#15171C] px-6 py-6 text-[#F4F5F7] sm:px-[26px]">
          <div className="flex min-w-[240px] flex-1 flex-col gap-1.5">
            <h2 className="text-[22px] font-bold">Ready to give blood?</h2>
            <p className="leading-normal text-[#C3C7D0]">
              Turn on donor mode so people who need your blood group can find
              you. Add your phone and address first.
            </p>
          </div>
          <Link
            href="/become-donor"
            className="inline-flex h-[46px] items-center justify-center rounded-[10px] bg-[#B4232A] px-[18px] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
          >
            Become a donor
          </Link>
        </section>
      )}

      {/* ------profile */}
      <section id="profile" className={cardClass}>
        <h1 className="text-[26px] font-bold text-[#15171C]">Profile</h1>
        <AvatarUpload avatar={user.avater} initials={initials} />
        <ProfileForm user={user} />
      </section>

      {/* ------password */}
      <section id="password" className={`${cardClass} scroll-mt-6 gap-[18px]`}>
        <h2 className="text-[22px] font-bold text-[#15171C]">
          Change password
        </h2>
        <ChangePasswordForm />
      </section>
    </>
  );
};

export default ProfilePage;
