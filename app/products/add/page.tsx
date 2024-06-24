"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { useFormState } from "react-dom";
import { toCloudflareImageUrl } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType, productSchema } from "./schema";

const ProductAddPage = () => {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setPhotoId] = useState("");

  const { register } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setPhotoId(id);
    }
  };

  const interceptAction = async (_: any, formData: FormData) => {
    // 클라우드 플레어 이미지 업로드
    const file = formData.get("photo");
    if (!file) {
      alert("이미지 파일이 없습니다.");
      return;
    }
    if (!uploadUrl) {
      alert("업로드 중 오류가 발생했습니다. 이미지를 다시 업로드 해주세요.");
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      alert("업로드 중 오류가 발생했습니다. 이미지를 다시 업로드 해주세요.");
      return;
    }

    // photo에 데이터를 string으로 치환
    const photoUrl = toCloudflareImageUrl(photoId);
    formData.set("photo", photoUrl);

    // uploadProduct함수 호출
    return uploadProduct(_, formData);
  };

  const [state, action] = useFormState(interceptAction, null);
  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: preview ? `url(${preview})` : "",
          }}
        >
          {!preview && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
              </div>
            </>
          )}
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          onChange={onImageChange}
        />
        <Input
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
          {...register("title")}
        />
        <Input
          required
          placeholder="가격"
          type="number"
          errors={state?.fieldErrors.price}
          {...register("price")}
        />
        <Input
          required
          placeholder="자세한 설명"
          type="text"
          errors={state?.fieldErrors.description}
          {...register("description")}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
};

export default ProductAddPage;
