import React from 'react';

interface Comment {
  userId: string;
  userName: string;
  content: string;
}

interface CommentsProps {
  comments: Comment[];
  newComment: string;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function Comments({ 
  comments, 
  newComment, 
  onCommentChange, 
  onSubmit 
}: CommentsProps) {
  return (
    <div className="mt-4">
      {comments.map((comment, index) => (
        <div key={index} className="mb-2">
          <span className="font-semibold">{comment.userName}</span>
          <span className="ml-2">{comment.content}</span>
        </div>
      ))}
      
      <form onSubmit={onSubmit} className="mt-4">
        <input
          type="text"
          value={newComment}
          onChange={onCommentChange}
          placeholder="মন্তব্য লিখুন..."
          className="w-full p-2 border rounded"
        />
      </form>
    </div>
  );
}