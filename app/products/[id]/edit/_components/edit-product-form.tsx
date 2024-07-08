"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { PhotoIcon } from "@heroicons/react/24/solid";
import Input from "@/components/input";
import Button from "@/components/button";

import { toCloudflareImageUrl } from "@/lib/utils";
import { productEditSchema, ProductEditType } from "../schema";
import { editProduct, getUploadUrl } from "@/app/products/add/actions";
import { Prisma } from "@prisma/client";

interface EditProductFormProps {
  original: Prisma.ProductGetPayload<{
    include: {
      user: {
        select: {
          username: true;
          avatar: true;
        };
      };
    };
  }>;
}

const EditProductForm = ({ original }: EditProductFormProps) => {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductEditType>({ resolver: zodResolver(productEditSchema) });

  useEffect(() => {
    const { id, photo, title, price, description } = original;

    setPreview(`${photo}/public`);

    reset({ id, photo, title, price, description });
  }, [original, reset]);

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
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue("photo", toCloudflareImageUrl(id));
    }
  };

  const onSubmit = handleSubmit(async (data: ProductEditType) => {
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

    const formData = new FormData();
    formData.append("id", data.id + "");
    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);
    formData.append("photo", data.photo);

    const errors = await editProduct(formData);

    if (errors) {
      console.log(errors);
    }
  });

  const onValid = async () => {
    await onSubmit();
  };
  return (
    <form action={onValid} className="p-5 flex flex-col gap-5">
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
              {[errors.photo?.message ?? ""]}
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
        errors={[errors.title?.message ?? ""]}
        {...register("title")}
      />
      <Input
        required
        placeholder="가격"
        type="number"
        errors={[errors.price?.message ?? ""]}
        {...register("price")}
      />
      <Input
        required
        placeholder="자세한 설명"
        type="text"
        errors={[errors.description?.message ?? ""]}
        {...register("description")}
      />
      <Button text="작성 완료" />
    </form>
  );
};

export default EditProductForm;
