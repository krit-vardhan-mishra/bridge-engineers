import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { HomeIcon, UserIcon, SettingsIcon, Plus, X } from 'lucide-react';
import NotifyBanner from '../components/ui/NotifyBanner';
import { getTimeBasedGreeting, getCurrentDateTime, getCurrentUser } from '../utils/utilityFunctions';
import { motion } from 'framer-motion';
import PostDetails from '../components/PostDetails';
import Footer from '../components/Footer';
import HomePageSkeleton from '../skeleton/pages/HomePageSkeleton';
import CreatePostModal from '../components/ui/modals/CreatePostModal';
import EditPostModal from '../components/ui/modals/EditPostModal';

export const HomePage = () => {
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('Krit');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(getCurrentDateTime());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    if (isEditPostOpen) {
      document.title = "Edit Post";
    } else if (isCreatePostOpen) {
      document.title = "Create Post";
    } else {
      document.title = "Home - Blog Web App";
    }

    const currentUser = getCurrentUser();
    const greetingMessage = getTimeBasedGreeting();
    const name = currentUser.name || 'Kriti';

    setGreeting(greetingMessage);
    setUserName(name);

    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
      setCurrentTime(getCurrentDateTime());
    }, 1000);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(interval);
    }
  }, [isEditPostOpen, isCreatePostOpen]);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVistiedBlogWebApp');

    if (!hasVisited) {
      setShowWelcomeBanner(true);
      localStorage.setItem('hasVistiedBlogWebApp', true);
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [])

  useEffect(() => {
    if (showNotificationBanner) {
      const timer = setTimeout(() => {
        setShowNotificationBanner(false);
        setNotificationMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotificationBanner]);

  const handleEditPost = () => {
    console.log('Edit post clicked');
    setIsEditPostOpen(true);
  };

  const handlePostCreationSuccess = (message) => {
    setNotificationMessage(message);
    setShowNotificationBanner(true);
    setIsCreatePostOpen(false);
  };

  const handlePostUpdateSuccess = (message) => {
    setNotificationMessage(message);
    setShowNotificationBanner(true);
    setIsEditPostOpen(false);
  }

  if (isLoading) {
    return <HomePageSkeleton />
  }

  return (
    <div className="bg-[#1C222A] min-h-screen">
      <Header title="Home" icons={[{ icon: HomeIcon, link: '/home' }, { icon: UserIcon, link: '/your-posts' }, { icon: SettingsIcon, link: '/account-setting' }]} />

      <div className="max-w-4xl mx-auto p-6">
        {/* Dynamic Greeting */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {greeting}, {userName}...!
          </h1>
          <p className="text-gray-300 text-lg">
            {currentTime}
          </p>
          { /* User Name and Age */}
          <div className="flex items-center py-2 rounded-md space-x-4">
            <h2 className="text-2xl font-bold text-white">Kirti Vardhan Mishra</h2>
            <h2 className="text-xl font-bold text-white">( Age: 21 )</h2>
          </div>

          <div className="h-1 w-full bg-blue-500 rounded-full mt-3"></div>
        </div>

        {/* Welcome Message */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-[#2A2E36] rounded-lg p-6 mb-6 hover:border-2 transition-all duration-100">
          <h2 className="text-2xl font-semibold text-white mb-3">
            Welcome to Your Blog Space
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Ready to share your thoughts with the world? Your creative journey continues here.
          </p>
        </motion.div>

        {/* Quick Stats or Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="bg-[#2A2E36] rounded-lg p-4 text-center hover:border-2 transition-all duration-100">
            <h3 className="text-white font-semibold mb-2">Your Blogs</h3>
            <p className="text-2xl font-bold text-blue-400">0</p>
            <p className="text-gray-400 text-sm">Published posts</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="bg-[#2A2E36] rounded-lg p-4 text-center hover:border-2 transition-all duration-100">
            <h3 className="text-white font-semibold mb-2">Total Views</h3>
            <p className="text-2xl font-bold text-green-400">0</p>
            <p className="text-gray-400 text-sm">Page views</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="bg-[#2A2E36] rounded-lg p-4 text-center hover:border-2 transition-all duration-100">
            <h3 className="text-white font-semibold mb-2">Last Updated</h3>
            <p className="text-2xl font-bold text-purple-400">-</p>
            <p className="text-gray-400 text-sm">Recent activity</p>
          </motion.div>
        </div>

        <PostDetails title={'Hunter'} content={'sahfhuhafh sauidfhisafkjdkj usahfiahfjopajfdsnxzia fusdhifcaiushfiuhsa dfhuehsidfnkajs f9heudshfuasmf'} author={'Hunter K'} onEdit={handleEditPost} />
        <PostDetails title={'Shikari'} content={'kafl j[aflds] sauidfhisafkjdkj usahfiahfjopajfdsnxzia dsfalkj sadjfk f9heudshfuasmf'} author={'Hunter J'} onEdit={handleEditPost} />
        <PostDetails title={'Hantarr'} content={'jaflkj af sauidfhisafkjdkj usahfiahfjopajfdsnxzia klaf dfhuehsidfnkajs asfjklf'} author={'Hunter L'} onEdit={handleEditPost} />
      </div>

      {/* Floating Action Button */}
      <div
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg cursor-pointer transition-all duration-300">
        <Plus className="w-6 h-6" />
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostSuccess={handlePostCreationSuccess}
      />

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={isEditPostOpen}
        onClose={() => setIsEditPostOpen(false)}
        onUpdateSuccess={handlePostUpdateSuccess}
      />

      <Footer />

      {/* Notification Banner */}
      {showWelcomeBanner && (
        <NotifyBanner
          message="Welcome back to the Blog Web App!"
          onClose={() => setShowWelcomeBanner(false)} />
      )}

      {showNotificationBanner && notificationMessage && (
        <NotifyBanner
          message={notificationMessage}
          onClose={() => setShowNotificationBanner(false)} />
      )}
    </div>
  );
};

export default HomePage;