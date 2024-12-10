import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

interface PostActionsProps {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
  onCommentToggle: () => void;
}

export default function PostActions({ 
  isLiked, 
  likesCount, 
  commentsCount, 
  onLike, 
  onCommentToggle 
}: PostActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onLike}
        className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
      >
        <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
        <span>{likesCount}</span>
      </button>
      
      <button
        onClick={onCommentToggle}
        className="flex items-center gap-1 text-gray-500"
      >
        <MessageCircle className="w-5 h-5" />
        <span>{commentsCount}</span>
      </button>
    </div>
  );
}