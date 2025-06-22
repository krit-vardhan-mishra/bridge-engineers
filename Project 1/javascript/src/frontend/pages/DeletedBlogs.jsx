import { useEffect } from 'react';
import Header from '../components/Header';
import { HomeIcon, UserIcon, Trash2, SettingsIcon } from 'lucide-react';

export const DeletedBlogs = () => {
  useEffect(() => {
    document.title = "Deleted Blogs";
  }, []);

  return (
    <div className="bg-[#1C222A] min-h-screen">
      <Header
        title="Your Deleted Posts" className="text-red-600" icons={[{ icon: Trash2, link: '/delete' }]}
      />
    </div>
  );
}

export default DeletedBlogs;