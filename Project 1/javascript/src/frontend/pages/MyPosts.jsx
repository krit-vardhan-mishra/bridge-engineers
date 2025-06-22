import React, { useEffect } from 'react';
import Header from '../components/Header';
import { HomeIcon, UserIcon, Trash2, SettingsIcon } from 'lucide-react';

export const MyPosts = () => {
  useEffect(() => {
    document.title = "Your Blogs";
  }, []);

  return (
    <div className="bg-[#1C222A] min-h-screen">
      <Header title="Your Posts" icons={[HomeIcon, UserIcon, Trash2, SettingsIcon]}/>
    </div>
  );
};

export default MyPosts;
