"use client";

import { useOptimistic } from "react";
import AddComment from "./add-comment";
import { formatToTimeAgo } from "@/lib/utils";

interface Comment {
  id: number;
  created_at: Date;
  user: {
    username: string;
  };
  payload: string;
}

interface PostCommentsProps {
  comments: Comment[];
  postId: number;
  commentsCount: number;
}

interface CommentsOptimistic {
  comments: Comment[];
  commentsCount: number;
}

const PostComments = ({
  comments,
  postId,
  commentsCount,
}: PostCommentsProps) => {
  const [state, reducerFn] = useOptimistic(
    { comments, commentsCount },
    (previousState, newComment: Comment) => {
      return {
        comments: [...previousState.comments, newComment],
        commentsCount: previousState.commentsCount + 1,
      };
    }
  );
  return (
    <div className="p-5 text-white border-t">
      <AddComment
        commentsCount={state.commentsCount}
        postId={postId}
        reducerFn={reducerFn}
      />
      <div className="py-4">
        {state.comments.map((comment) => (
          <div
            className="border-b py-1 px-2 flex flex-col gap-px last:border-b-0"
            key={`comment-${comment.id}`}
          >
            <span>{comment.payload}</span>
            <div className="text-[10px] text-white/50">
              <span>{comment.user.username}</span>
              <span>{formatToTimeAgo(comment.created_at.toString())}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostComments;
