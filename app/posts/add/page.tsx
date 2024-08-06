"use client";

import Input from "@/components/input";
import NavHeader from "@/components/nav-header";
import Submit from "@/components/submit";
import Textarea from "@/components/textarea";

import { useForm } from "react-hook-form";
import { uploadPost } from "./actions";

interface PostForm {
  title: string;
  description: string;
}
const PostAdd = () => {
  const { register, handleSubmit } = useForm<PostForm>();

  const onValid = async (data: PostForm) => {
    const errors = await uploadPost(data);
  };

  return (
    <div className="">
      <NavHeader>게시글 등록</NavHeader>
      <form
        className="p-5 flex flex-col gap-5"
        onSubmit={handleSubmit(onValid)}
      >
        <Input
          required
          placeholder="제목"
          type="text"
          //   errors={[errors.title?.message ?? ""]}
          {...register("title")}
        />
        <Textarea
          required
          placeholder="내용"
          //   errors={[errors.title?.message ?? ""]}
          {...register("description")}
        />
        <Submit>등록</Submit>
      </form>
    </div>
  );
};

export default PostAdd;
