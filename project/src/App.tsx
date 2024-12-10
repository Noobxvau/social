import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Feed from './components/feed/Feed';
import Profile from './components/profile/Profile';
import Navigation from './components/Navigation';

export default function App() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {user && <Navigation />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/feed" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/feed" />} />
        <Route path="/feed" element={user ? <Feed /> : <Navigate to="/login" />} />
        <Route path="/profile/:userId" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/feed" : "/login"} />} />
      </Routes>
    </Router>
  );
}