"use client";

import { useUpdateAvailability } from "@/hooks";
import { errorMessage } from "@/utils";
import { toast } from "../../ui/toast";

// -----on/off switch for donor availability
const AvailabilityToggle = ({ isAvailable }: { isAvailable: boolean }) => {
  const { mutate: update, isPending } = useUpdateAvailability();

  const handleToggle = () => {
    update(!isAvailable, {
      onSuccess: () =>
        toast.add({
          title: isAvailable ? "You are hidden now" : "You are available now",
          type: "success",
        }),
      onError: (err) =>
        toast.add({
          title: "Availability not changed",
          description: errorMessage(err),
          type: "error",
        }),
    });
  };

  return (
    <button
      type="button"
      aria-pressed={isAvailable}
      aria-label="Available to donate"
      disabled={isPending}
      onClick={handleToggle}
      className={`flex h-9 w-16 flex-none cursor-pointer rounded-full p-[3px] transition-colors focus-visible:ring-3 focus-visible:ring-[#B4232A]/30 disabled:cursor-wait disabled:opacity-70 ${
        isAvailable ? "justify-end bg-[#1D7A50]" : "justify-start bg-[#9AA0AB]"
      }`}
    >
      <span className="block size-[30px] rounded-full bg-white shadow-sm" />
    </button>
  );
};

export default AvailabilityToggle;
