import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { HomeIcon, UserIcon, SettingsIcon, Plus, X } from 'lucide-react';
import NotifyBanner from '../components/NotifyBanner';
import { getTimeBasedGreeting, getCurrentDateTime, getCurrentUser } from '../utils/greetingUtils';
import { motion, AnimatePresence } from 'framer-motion';
import CreatePost from '../components/CreatePost';
import PostDetails from './PostDetails';
import EditPost from '../components/EditPost';

export const HomePage = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('Krit');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);

  useEffect(() => {
    document.title = "Home - Blog Web App";
    setShowBanner(true);

    const currentUser = getCurrentUser();
    const greetingMessage = getTimeBasedGreeting();
    const name = currentUser.name || 'Kriti';

    setGreeting(greetingMessage);
    setUserName(name);

    const interval = setInterval(() => {
      const updateGreeting = getTimeBasedGreeting();
      setGreeting(updateGreeting);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleEditPost = () => {
    console.log('Edit post clicked');
    setIsEditPostOpen(true);
  };

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
            {getCurrentDateTime()}
          </p>
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
            <div className="bg-[#2A2E36] rounded-lg p-4 text-center">
              <h3 className="text-white font-semibold mb-2">Your Blogs</h3>
              <p className="text-2xl font-bold text-blue-400">0</p>
              <p className="text-gray-400 text-sm">Published posts</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="bg-[#2A2E36] rounded-lg p-4 text-center hover:border-2 transition-all duration-100">
            <div className="bg-[#2A2E36] rounded-lg p-4 text-center">
              <h3 className="text-white font-semibold mb-2">Total Views</h3>
              <p className="text-2xl font-bold text-green-400">0</p>
              <p className="text-gray-400 text-sm">Page views</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="bg-[#2A2E36] rounded-lg p-4 text-center hover:border-2 transition-all duration-100">
            <div className="bg-[#2A2E36] rounded-lg p-4 text-center">
              <h3 className="text-white font-semibold mb-2">Last Updated</h3>
              <p className="text-2xl font-bold text-purple-400">-</p>
              <p className="text-gray-400 text-sm">Recent activity</p>
            </div>
          </motion.div>
        </div>

        <PostDetails title={'Hunter'} content={'sahfhuhafh sauidfhisafkjdkj usahfiahfjopajfdsnxzia fusdhifcaiushfiuhsa dfhuehsidfnkajs f9heudshfuasmf'} author={'Hunter K'} onEdit={handleEditPost} />
        <PostDetails title={'Shikari'} content={'kafl j[aflds] sauidfhisafkjdkj usahfiahfjopajfdsnxzia dsfalkj sadjfk f9heudshfuasmf'} author={'Hunter J'} onEdit={handleEditPost} />
        <PostDetails title={'Hantarr'} content={'jaflkj af sauidfhisafkjdkj usahfiahfjopajfdsnxzia klaf dfhuehsidfnkajs asfjklf'} author={'Hunter L'} onEdit={handleEditPost} />
      </div>

      <div
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg cursor-pointer transition-all duration-300">
        <Plus className="w-6 h-6" />
      </div>

       <AnimatePresence>
        {isCreatePostOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsCreatePostOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-[#1C222A] p-6 rounded-lg shadow-lg w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsCreatePostOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5 m-2 text-red-700 hover:text-red-500" />
              </button>
              <CreatePost />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditPostOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsEditPostOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-[#1C222A] p-6 rounded-lg shadow-lg w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsEditPostOpen(false)}
                className="absolute top-2 right-2 text-red-500 hover:text-white"
              >
                <X className="h-5 w-5 m-5 text-red-700 hover:text-red-500" />
              </button>
              <EditPost />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showBanner && (
        <NotifyBanner
          message="Welcome back to the Blog Web App!"
          onClose={() => setShowBanner(false)} />
      )}
    </div >
  );
};

export default HomePage;
