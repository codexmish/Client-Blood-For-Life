"use client";

import { useUploadAvatar } from "@/hooks";
import { errorMessage } from "@/utils";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Spinner } from "../../ui/spinner";
import { toast } from "../../ui/toast";

// -----allowed image types and max size (2 MB)
const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
const maxSize = 2 * 1024 * 1024;

const AvatarUpload = ({
  avatar,
  initials,
}: {
  avatar: string;
  initials: string;
}) => {
  // -----local preview before upload finishes
  const [preview, setPreview] = useState<string | null>(null);

  const { mutate: upload, isPending: uploadPending } = useUploadAvatar();

  // -----free preview url when it changes or component leaves
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // ----same file can be picked again later
    e.target.value = "";
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.add({
        title: "Wrong file type",
        description: "Use a JPG, PNG or WebP image",
        type: "error",
      });
      return;
    }
    if (file.size > maxSize) {
      toast.add({
        title: "Image too large",
        description: "Max size is 2 MB",
        type: "error",
      });
      return;
    }

    setPreview(URL.createObjectURL(file));

    upload(file, {
      onSuccess: () => toast.add({ title: "Photo updated", type: "success" }),
      onError: (err) => {
        setPreview(null);
        toast.add({
          title: "Photo not updated",
          description: errorMessage(err),
          type: "error",
        });
      },
    });
  };

  const imageSrc = preview ?? avatar;

  return (
    <div className="flex flex-wrap items-center gap-[18px]">
      {/* ------avatar */}
      <span className="relative inline-flex size-[88px] flex-none items-center justify-center overflow-hidden rounded-full bg-[#15171C] text-[30px] font-bold text-white">
        {imageSrc ? (
          <img src={imageSrc} alt="" className="size-full object-cover" />
        ) : (
          initials
        )}
        {uploadPending && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Spinner />
          </span>
        )}
      </span>

      {/* ------upload button */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="avater-file"
          className={`inline-flex h-[46px] cursor-pointer items-center justify-center gap-2 self-start rounded-[10px] border border-[#D5D8DE] bg-white px-[18px] text-[15px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4] has-focus-visible:ring-3 has-focus-visible:ring-[#B4232A]/20 ${
            uploadPending ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <Upload className="size-[17px]" />
          {uploadPending ? "Uploading" : "Upload photo"}
          <input
            id="avater-file"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={uploadPending}
            onChange={handleFile}
            className="sr-only"
          />
        </label>
        <p className="text-[13px] text-[#5B616E]">
          JPG, PNG or WebP, up to 2 MB. Replaces your current photo.
        </p>
      </div>
    </div>
  );
};

export default AvatarUpload;
