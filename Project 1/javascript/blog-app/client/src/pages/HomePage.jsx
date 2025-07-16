import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HomeIcon, UserIcon, SettingsIcon, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostDetails from '../components/PostDetails';
import NotifyBanner from '../components/ui/NotifyBanner';
import HomePageSkeleton from '../skeleton/pages/HomePageSkeleton';
import CreatePostModal from '../components/ui/modals/CreatePostModal';
import EditPostModal from '../components/ui/modals/EditPostModal';
import QuickStatsModal from '../components/ui/modals/QuickStatsModal';
import SingleStatModal from '../components/ui/modals/SingleStatModal';
import { getTimeBasedGreeting, getCurrentDateTime } from '../utils/utilityFunctions';
import blogService from '../services/blogService';

export const HomePage = () => {
  const { user: currentUser } = useAuth();
  const [selectedStat, setSelectedStat] = useState(null);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [isAllStatsOpen, setIsAllStatsOpen] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [greeting, setGreeting] = useState(getTimeBasedGreeting());
  const [currentTime, setCurrentTime] = useState(getCurrentDateTime());
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  // Stats calculation
  const stats = [
    { 
      title: 'Your Blogs', 
      count: blogs.filter(blog => blog.userId === currentUser?.id).length,
      subtitle: 'Published posts' 
    },
    { 
      title: 'Total Views', 
      count: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
      subtitle: 'Page views' 
    },
    { 
      title: 'Last Updated', 
      count: blogs.length > 0 ? 
        new Date(Math.max(...blogs.map(b => new Date(b.updatedAt || b.createdAt)))) 
        : null,
      subtitle: 'Recent activity' 
    }
  ];

  const colorMap = {
    'Your Blogs': 'text-blue-400',
    'Total Views': 'text-green-400',
    'Last Updated': 'text-purple-400'
  };

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await blogService.getAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setNotificationMessage('Failed to load blogs');
      setShowNotificationBanner(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    // Update greeting and time every second
    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
      setCurrentTime(getCurrentDateTime());
    }, 1000);

    // Set document title
    document.title = isEditPostOpen ? "Edit Post" : 
                    isCreatePostOpen ? "Create Post" : 
                    "Home - Blog Web App";

    // First visit welcome banner
    const hasVisited = localStorage.getItem('hasVisitedBlogWebApp');
    if (!hasVisited) {
      setShowWelcomeBanner(true);
      localStorage.setItem('hasVisitedBlogWebApp', 'true');
      const timer = setTimeout(() => setShowWelcomeBanner(false), 3000);
      return () => clearTimeout(timer);
    }

    return () => clearInterval(interval);
  }, [isEditPostOpen, isCreatePostOpen]);

  useEffect(() => {
    // Auto-hide notification banner
    if (showNotificationBanner) {
      const timer = setTimeout(() => {
        setShowNotificationBanner(false);
        setNotificationMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotificationBanner]);

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
    setIsStatModalOpen(true);
  };

  const handleEditPost = (postId) => {
    setIsEditPostOpen(true);
    // You would typically fetch the post details here
  };

  const handlePostCreationSuccess = (message) => {
    setNotificationMessage(message);
    setShowNotificationBanner(true);
    setIsCreatePostOpen(false);
    fetchBlogs(); // Refresh the blog list
  };

  const handlePostUpdateSuccess = (message) => {
    setNotificationMessage(message);
    setShowNotificationBanner(true);
    setIsEditPostOpen(false);
    fetchBlogs(); // Refresh the blog list
  };

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="bg-[#1C222A] min-h-screen">
      <Header
        title="Home"
        icons={[
          { icon: HomeIcon, link: '/home' },
          { icon: UserIcon, link: '/your-posts' },
          { icon: SettingsIcon, link: '/account-setting' }
        ]}
      />

      <div className="max-w-4xl mx-auto p-6">
        {/* Greeting Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {greeting}, {currentUser?.name || 'User'}!
          </h1>
          <p className="text-gray-300 text-lg">{currentTime}</p>
          {currentUser?.age && (
            <div className="flex items-center py-2 rounded-md space-x-4">
              <h2 className="text-2xl font-bold text-white">{currentUser.name}</h2>
              <h2 className="text-xl font-bold text-white">(Age: {currentUser.age})</h2>
            </div>
          )}
          <div className="h-1 w-full bg-blue-500 rounded-full mt-3"></div>
        </div>

        {/* Welcome Message */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-[#2A2E36] rounded-lg p-6 mb-6 hover:border-2 transition-all duration-100"
        >
          <h2 className="text-2xl font-semibold text-white mb-3">
            Welcome to Your Blog Space
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Ready to share your thoughts with the world? Your creative journey continues here.
          </p>
        </motion.div>

        {/* Quick Stats Container */}
        <div className="bg-[#323943] rounded-lg p-6 mb-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAllStatsOpen(true)}
              className="text-blue-400 hover:text-blue-500 font-medium underline"
            >
              View All Stats
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleStatClick(stat)}
                className="bg-[#2A2E36] rounded-lg p-4 text-center hover:border-2 transition-all duration-100 cursor-pointer"
              >
                <h3 className="text-white font-semibold mb-2">{stat.title}</h3>
                <p className={`text-2xl font-bold ${colorMap[stat.title] || 'text-gray-300'}`}>
                  {stat.count ? 
                    (stat.title === 'Last Updated' ? 
                      stat.count.toLocaleDateString() : 
                      stat.count) : 
                    '-'}
                </p>
                <p className="text-gray-400 text-sm">{stat.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        {blogs.map(blog => (
          <PostDetails
            key={blog.id}
            title={blog.title}
            content={blog.content}
            author={blog.author}
            onEdit={() => handleEditPost(blog.id)}
          />
        ))}
      </div>

      {/* Floating Action Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg cursor-pointer transition-all duration-300"
      >
        <Plus className="w-6 h-6" />
      </motion.div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostSuccess={handlePostCreationSuccess}
      />
      <EditPostModal
        isOpen={isEditPostOpen}
        onClose={() => setIsEditPostOpen(false)}
        onUpdateSuccess={handlePostUpdateSuccess}
      />
      <QuickStatsModal
        isOpen={isAllStatsOpen}
        onClose={() => setIsAllStatsOpen(false)}
        stats={stats}
      />
      <SingleStatModal
        isOpen={isStatModalOpen}
        onClose={() => setIsStatModalOpen(false)}
        stat={selectedStat}
      />

      <Footer />

      {/* Notification Banners */}
      {showWelcomeBanner && (
        <NotifyBanner
          message="Welcome to the Blog Web App!"
          onClose={() => setShowWelcomeBanner(false)}
        />
      )}
      {showNotificationBanner && (
        <NotifyBanner
          message={notificationMessage}
          onClose={() => setShowNotificationBanner(false)}
        />
      )}
    </div>
  );
};

export default HomePage;