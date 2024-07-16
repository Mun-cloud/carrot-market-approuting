"use client";

import { useOptimistic } from "react";
import AddComment from "./add-comment";

interface Comment {
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

const PostComments = ({
  comments,
  postId,
  commentsCount,
}: PostCommentsProps) => {
  const [state, reducerFn] = useOptimistic(
    { comments, commentsCount },
    (previousState, payload: Comment) => ({
      comments: { ...previousState.comments, payload },
      commentsCount: previousState.commentsCount + 1,
    })
  );
  return (
    <div className="p-5 text-white border-t">
      <AddComment postId={postId} reducerFn={reducerFn} />
      {comments.map((comment) => (
        <div key={comment.payload}>{comment.payload}</div>
      ))}
    </div>
  );
};

export default PostComments;
