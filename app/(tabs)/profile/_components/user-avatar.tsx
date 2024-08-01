"use client";

import { getUploadUrl } from "@/app/products/add/actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toCloudflareImageUrl } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { editAvatar } from "../actions";

interface UserAvatarProps {
  username: string;
  avatar: string;
}
const UserAvatar = ({ avatar, username }: UserAvatarProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{ photo: string }>();

  const modalToggle = () => {
    setModalOpen((prev) => !prev);
  };

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 2) {
      alert("최대 업로드 가능 용량을 초과했습니다.(2MB)");
      return;
    }
    if (!file.type.includes("image")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue("photo", toCloudflareImageUrl(id));
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!file || !uploadUrl) {
      alert("이미지를 다시 첨부해주세요.");
      return;
    }

    const directUploadForm = new FormData();
    directUploadForm.append("file", file);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: directUploadForm,
    });

    if (response.status !== 200) {
      alert("업로드 중 오류가 발생했습니다. 이미지를 다시 업로드 해주세요.");
      return;
    }
    const formData = new FormData();
    console.log(data.photo);
    formData.append("photo", data.photo);

    const errors = await editAvatar(formData);
    if (errors) console.log(errors);
  });

  const onValid = async () => {
    await onSubmit();
    modalToggle();
  };
  return (
    <>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <button type="button" onClick={modalToggle}>
          <Image
            src={avatar!}
            alt={username}
            width={40}
            height={40}
            className="size-[40px] rounded-full"
          />
        </button>
        <DialogContent className="bg-neutral-900">
          <DialogHeader>
            <DialogTitle>프로필 이미지 변경</DialogTitle>
            <DialogDescription>
              원하시는 이미지를 첨부해주세요.
            </DialogDescription>
          </DialogHeader>
          <form action={onValid} className="p-5 flex flex-col gap-5">
            <label
              className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover bg-no-repeat"
              style={{
                backgroundImage: preview ? `url(${preview})` : "",
              }}
            >
              {!preview && (
                <>
                  <ImageIcon className="size-20 stroke-1" />
                  <div className="text-neutral-400 text-sm">
                    사진을 추가해주세요.
                    {/* {[errors.photo?.message ?? ""]} */}
                  </div>
                </>
              )}
              <input
                type="file"
                name="photo"
                className="hidden"
                onChange={onImageChange}
              />
            </label>
            <div className="flex items-center gap-5 justify-end">
              <DialogClose
                className="border rounded px-5 py-1.5 text-[14px] hover:bg-secondary hover:text-primary hover:border-transparent transition-colors"
                type="button"
              >
                취소
              </DialogClose>
              <button
                className="border rounded px-5 py-1.5 text-[14px] border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-secondary hover:border-transparent transition-colors"
                type="submit"
              >
                확인
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserAvatar;
