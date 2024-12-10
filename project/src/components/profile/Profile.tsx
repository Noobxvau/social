import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { UserCircle } from 'lucide-react';

export default function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const currentUserId = auth.currentUser?.uid;
  const isOwnProfile = userId === currentUserId;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() });
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    if (!currentUserId || !userId || !profile) return;

    const isFollowing = profile.followers.includes(currentUserId);
    const userRef = doc(db, 'users', userId);
    const currentUserRef = doc(db, 'users', currentUserId);

    if (isFollowing) {
      await updateDoc(userRef, {
        followers: arrayRemove(currentUserId)
      });
      await updateDoc(currentUserRef, {
        following: arrayRemove(userId)
      });
    } else {
      await updateDoc(userRef, {
        followers: arrayUnion(currentUserId)
      });
      await updateDoc(currentUserRef, {
        following: arrayUnion(userId)
      });
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-6">
          <UserCircle className="w-20 h-20 text-gray-400" />
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-500">{profile.email}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div>
            <div className="font-bold">{profile.followers?.length || 0}</div>
            <div className="text-gray-500">ফলোয়ার্স</div>
          </div>
          <div>
            <div className="font-bold">{profile.following?.length || 0}</div>
            <div className="text-gray-500">ফলোয়িং</div>
          </div>
        </div>

        {!isOwnProfile && (
          <button
            onClick={handleFollow}
            className={`px-4 py-2 rounded ${
              profile.followers?.includes(currentUserId)
                ? 'bg-gray-200 hover:bg-gray-300'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {profile.followers?.includes(currentUserId) ? 'আনফলো' : 'ফলো করুন'}
          </button>
        )}
      </div>
    </div>
  );
}