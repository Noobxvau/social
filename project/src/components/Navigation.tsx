import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { Home, User, LogOut } from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/feed" className="text-xl font-bold">সোশ্যাল মিডিয়া</Link>
          
          <div className="flex items-center gap-4">
            <Link to="/feed" className="p-2 hover:bg-gray-100 rounded-full">
              <Home className="w-6 h-6" />
            </Link>
            
            <Link to={`/profile/${auth.currentUser?.uid}`} className="p-2 hover:bg-gray-100 rounded-full">
              <User className="w-6 h-6" />
            </Link>
            
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}