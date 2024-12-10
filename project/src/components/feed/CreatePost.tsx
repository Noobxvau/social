import React, { useState } from 'react';
import { auth, db, storage } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ImagePlus } from 'lucide-react';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'posts'), {
        content,
        imageUrl,
        authorId: auth.currentUser?.uid,
        authorName: auth.currentUser?.displayName,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: []
      });

      setContent('');
      setImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="আপনার মনের কথা লিখুন..."
          className="w-full p-2 border rounded mb-2 min-h-[100px]"
        />
        <div className="flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-2">
            <ImagePlus className="w-6 h-6 text-gray-500" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="hidden"
            />
            {image && <span className="text-sm text-gray-500">{image.name}</span>}
          </label>
          <button
            type="submit"
            disabled={loading || (!content.trim() && !image)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'পোস্ট করা হচ্ছে...' : 'পোস্ট করুন'}
          </button>
        </div>
      </form>
    </div>
  );
}