import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { HomeIcon, UserIcon, SettingsIcon } from 'lucide-react';
import NotifyBanner from '../components/NotifyBanner';
import { getTimeBasedGreeting, getCurrentDateTime, getCurrentUser } from '../utils/greetingUtils';
import { motion } from 'framer-motion';
import PostDetails from './PostDetails';

export const HomePage = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('Krit');

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

  return (
    <div className="bg-[#1C222A] min-h-screen">
      <Header title="Home" icons={[{ icon: HomeIcon, link: '/home'}, { icon: UserIcon, link: '/your-posts'}, { icon: SettingsIcon, link: '/'}]} />

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

        <PostDetails title={'Hunter'} content={'sahfhuhafh sauidfhisafkjdkj usahfiahfjopajfdsnxzia fusdhifcaiushfiuhsa dfhuehsidfnkajs f9heudshfuasmf'} author={'Hunter K'} />
        <PostDetails title={'Shikari'} content={'kafl j[aflds] sauidfhisafkjdkj usahfiahfjopajfdsnxzia dsfalkj sadjfk f9heudshfuasmf'} author={'Hunter J'} />
        <PostDetails title={'Hantarr'} content={'jaflkj af sauidfhisafkjdkj usahfiahfjopajfdsnxzia klaf dfhuehsidfnkajs asfjklf'} author={'Hunter L'} />
      </div>

      {showBanner && (
          <NotifyBanner
            message="Welcome back to the Blog Web App!"
            onClose={() => setShowBanner(false)}/>
        )}
    </div >
  );
};

export default HomePage;
