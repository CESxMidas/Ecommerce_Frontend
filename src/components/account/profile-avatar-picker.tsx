"use client";

import Image from "next/image";
import { Camera, ImagePlus, Loader2, Trash2, Upload, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

import { AccountCard } from "@/components/account/account-ui";
import { uploadAvatar } from "@/lib/services/user-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type ProfileAvatarPickerProps = {
  avatar: string;
  name: string;
  email: string;
  disabled?: boolean;
  onAvatarChange: (url: string) => void;
  onAvatarRemove: () => Promise<void>;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

function validateImageFile(file: File) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Ảnh tối đa 5MB";
  }

  return null;
}

export default function ProfileAvatarPicker({
  avatar,
  name,
  email,
  disabled = false,
  onAvatarChange,
  onAvatarRemove,
}: ProfileAvatarPickerProps) {
  const { update } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      try {
        setUploading(true);
        const result = await uploadAvatar(file);
        onAvatarChange(result.url);
        await update({ image: result.url || null });
        toast.success("Đã cập nhật ảnh đại diện");
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Tải ảnh lên thất bại"));
      } finally {
        setUploading(false);
        setDragging(false);
      }
    },
    [onAvatarChange, update],
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void uploadFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!disabled && !uploading) setDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (disabled || uploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  async function handleRemove() {
    try {
      setUploading(true);
      await onAvatarRemove();
      await update({ image: null });
      toast.success("Đã xóa ảnh đại diện");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể xóa ảnh"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <AccountCard className="overflow-hidden p-0">
      <div className="relative border-b border-keyshop-line bg-gradient-to-br from-keyshop-blue/10 via-transparent to-transparent px-4 py-6 sm:px-6 sm:py-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-keyshop-blue/10 blur-2xl" />

        <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div
            className={cn(
              "group relative shrink-0",
              !disabled && !uploading && "cursor-pointer",
            )}
            onClick={() => {
              if (!disabled && !uploading) inputRef.current?.click();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!disabled && !uploading) inputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={disabled || uploading ? -1 : 0}
            aria-label="Đổi ảnh đại diện"
          >
            <div
              className={cn(
                "relative h-28 w-28 overflow-hidden rounded-[22px] border-2 shadow-[0_12px_32px_rgba(37,99,235,0.18)] sm:h-[104px] sm:w-[104px]",
                avatar
                  ? "border-sky-400/35 bg-white/[0.04]"
                  : "border-keyshop-line bg-white/[0.06]",
                uploading && "opacity-70",
              )}
            >
              {avatar ? (
                <Image
                  src={avatar}
                  alt={name || "Ảnh đại diện"}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-keyshop-muted">
                  <span className="text-2xl font-extrabold text-sky-300">
                    {getInitials(name)}
                  </span>
                  <UserRound className="h-5 w-5 opacity-60" />
                </div>
              )}

              {!uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/45">
                  <span className="flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                    <Camera className="h-3.5 w-3.5" />
                    Đổi ảnh
                  </span>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-7 w-7 animate-spin text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="truncate text-xl font-extrabold text-white sm:text-2xl">
              {name || "Thành viên KEYSHOP"}
            </p>
            <p className="mt-1 truncate text-sm text-keyshop-muted">{email}</p>
            <span className="mt-3 inline-flex min-h-6 items-center rounded-full bg-emerald-500/15 px-2.5 text-[11px] font-extrabold text-emerald-300">
              Thành viên
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-5 sm:px-6">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          disabled={disabled || uploading}
          onChange={handleFileChange}
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "rounded-xl border border-dashed px-4 py-5 text-center transition",
            dragging
              ? "border-keyshop-blue bg-keyshop-blue/10"
              : "border-keyshop-line bg-white/[0.02] hover:border-keyshop-blue/30 hover:bg-white/[0.03]",
            (disabled || uploading) && "pointer-events-none opacity-60",
          )}
        >
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-keyshop-blue/15 text-sky-300">
            <Upload className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-white">
            Kéo thả ảnh vào đây hoặc bấm để chọn file
          </p>
          <p className="mt-1 text-xs text-keyshop-muted">
            JPG, PNG, WEBP, GIF · tối đa 5MB · khuyến nghị 400×400px
          </p>
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-control border border-keyshop-line bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:border-keyshop-blue/40 hover:bg-keyshop-blue/10 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {uploading ? "Đang tải lên..." : "Chọn ảnh từ máy"}
          </button>
        </div>

        {avatar ? (
          <div className="flex justify-center sm:justify-start">
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => void handleRemove()}
              className="inline-flex min-h-10 items-center gap-2 rounded-control px-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Xóa ảnh đại diện
            </button>
          </div>
        ) : null}
      </div>
    </AccountCard>
  );
}
