import React, { useState } from 'react';
import { auth, db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import PostActions from './PostActions';
import Comments from './Comments';

interface PostProps {
  id: string;
  content: string;
  imageUrl?: string;
  authorName: string;
  createdAt: string;
  likes: string[];
  comments: Array<{ userId: string; userName: string; content: string }>;
}

export default function Post({ 
  id, 
  content, 
  imageUrl, 
  authorName, 
  createdAt, 
  likes, 
  comments 
}: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const currentUserId = auth.currentUser?.uid;
  const isLiked = currentUserId ? likes.includes(currentUserId) : false;

  const handleLike = async () => {
    if (!currentUserId) return;
    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, {
      likes: isLiked ? arrayRemove(currentUserId) : arrayUnion(currentUserId)
    });
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !newComment.trim()) return;

    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, {
      comments: arrayUnion({
        userId: currentUserId,
        userName: auth.currentUser?.displayName || 'Anonymous',
        content: newComment.trim()
      })
    });
    setNewComment('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center mb-4">
        <div className="font-semibold">{authorName}</div>
        <div className="text-gray-500 text-sm ml-2">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </div>
      </div>
      
      <p className="mb-4">{content}</p>
      
      {imageUrl && (
        <img src={imageUrl} alt="Post content" className="w-full rounded-lg mb-4" />
      )}
      
      <PostActions
        isLiked={isLiked}
        likesCount={likes.length}
        commentsCount={comments.length}
        onLike={handleLike}
        onCommentToggle={() => setShowComments(!showComments)}
      />

      {showComments && (
        <Comments
          comments={comments}
          newComment={newComment}
          onCommentChange={(e) => setNewComment(e.target.value)}
          onSubmit={handleComment}
        />
      )}
    </div>
  );
}