import React, { useEffect, useState } from 'react';
import Header from '../components/Header.jsx'; // Added .jsx extension
import { HomeIcon, UserIcon, SettingsIcon, Plus } from 'lucide-react';
import NotifyBanner from '../components/ui/NotifyBanner.jsx'; // Added .jsx extension
import { getTimeBasedGreeting, getCurrentDateTime } from '../utils/utilityFunctions.js'; // Added .js extension
import { motion } from 'framer-motion';
import PostDetails from '../components/PostDetails.jsx'; // Added .jsx extension
import Footer from '../components/Footer.jsx'; // Added .jsx extension
import HomePageSkeleton from '../skeleton/pages/HomePageSkeleton.jsx'; // Added .jsx extension
import CreatePostModal from '../components/ui/modals/CreatePostModal.jsx'; // Added .jsx extension
import EditPostModal from '../components/ui/modals/EditPostModal.jsx'; // Added .jsx extension
import QuickStatsModal from '../components/ui/modals/QuickStatsModal.jsx'; // Added .jsx extension
import SingleStatModal from '../components/ui/modals/SingleStatModal.jsx'; // Added .jsx extension
import useAuth from '../hooks/useAuth.js'; // Already had .js, kept as is
import * as blogService from '../api/blogService.js'; // Already had .js, kept as is

export const HomePage = () => {
  const { user, token } = useAuth(); // Use the useAuth hook to get user and token

  const [selectedStat, setSelectedStat] = useState(null);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [isAllStatsOpen, setIsAllStatsOpen] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [greeting, setGreeting] = useState('');
  const [displayedUserName, setDisplayedUserName] = useState('Guest'); // Renamed to avoid conflict
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(getCurrentDateTime());
  const [isLoading, setIsLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState([]); // Renamed from 'blogs' to avoid confusion with stats.count

  // Fetch all blogs on component mount or when token changes
  useEffect(() => {
    const fetchAllBlogsData = async () => {
      try {
        setIsLoading(true);
        // Fetch all blogs using the service
        const blogsData = await blogService.fetchAllBlogs(token);
        setAllBlogs(blogsData);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
        // Optionally set an error state here to display to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBlogsData();
  }, [token]); // Re-run if token changes (user logs in/out)

  // Update greeting and user name based on logged-in user
  useEffect(() => {
    setGreeting(getTimeBasedGreeting());
    // Use user.name from the auth context, which now includes the full name
    setDisplayedUserName(user?.name || 'Guest');

    const interval = setInterval(() => {
      setCurrentTime(getCurrentDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [user]); // Re-run if user object changes

  // Dynamic document title
  useEffect(() => {
    if (isEditPostOpen) {
      document.title = "Edit Post";
    } else if (isCreatePostOpen) {
      document.title = "Create Post";
    } else {
      document.title = "Home - Blog Web App";
    }
  }, [isEditPostOpen, isCreatePostOpen]);

  // Welcome banner effect
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBlogWebApp');
    if (!hasVisited) {
      setShowWelcomeBanner(true);
      localStorage.setItem('hasVisitedBlogWebApp', true);
      const timer = setTimeout(() => {
        setShowWelcomeBanner(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Notification banner effect
  useEffect(() => {
    if (showNotificationBanner) {
      const timer = setTimeout(() => {
        setShowNotificationBanner(false);
        setNotificationMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotificationBanner]);

  // Calculate stats based on fetched data
  const userBlogsCount = allBlogs.filter(blog => blog.userId === user?.id).length;
  // Placeholder for total views and last updated - these would come from a real analytics system
  const totalViews = 0; // This would be fetched from backend analytics
  const lastUpdated = "N/A"; // This would be the timestamp of the latest user blog update

  const stats = [
    { title: 'Your Blogs', count: userBlogsCount, subtitle: 'Published posts' },
    { title: 'Total Views', count: totalViews, subtitle: 'Page views' },
    { title: 'Last Updated', count: lastUpdated, subtitle: 'Recent activity' }
  ];

  const colorMap = {
    'Your Blogs': 'text-blue-400',
    'Total Views': 'text-green-400',
    'Last Updated': 'text-purple-400'
  };

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
    setIsStatModalOpen(true);
  };

  const handleEditPost = () => {
    setIsEditPostOpen(true); // This would typically open a modal to edit a specific post
  };

  const handlePostCreationSuccess = (message) => {
    setNotificationMessage(message);
    setShowNotificationBanner(true);
    setIsCreatePostOpen(false);
    // Re-fetch blogs after successful creation to update the list
    blogService.fetchAllBlogs(token).then(setAllBlogs).catch(err => console.error("Failed to refresh blogs:", err));
  };

  const handlePostUpdateSuccess = (message) => {
    setNotificationMessage(message);
    setShowNotificationBanner(true);
    setIsEditPostOpen(false);
    // Re-fetch blogs after successful update to update the list
    blogService.fetchAllBlogs(token).then(setAllBlogs).catch(err => console.error("Failed to refresh blogs:", err));
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
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {greeting}, {displayedUserName}!
          </h1>
          <p className="text-gray-300 text-lg">{currentTime}</p>
          <div className="flex items-center py-2 rounded-md space-x-4">
            <h2 className="text-2xl font-bold text-white">{user?.name || 'Loading Name...'}</h2>
            <h2 className="text-xl font-bold text-white">( Age: {user?.age || 'N/A'} )</h2>
          </div>
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
          {/* View All Stats Button (Top-right) */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAllStatsOpen(true)}
              className="text-blue-400 hover:text-blue-500 font-medium underline"
            >
              View All Stats
            </button>
          </div>

          {/* Quick Stats Grid */}
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
                  {stat.count || stat.count === 0 ? stat.count : '-'}
                </p>
                <p className="text-gray-400 text-sm">{stat.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* All Posts Section */}
        <h2 className="text-3xl font-bold mb-6 text-gray-100 border-b-2 border-indigo-300 pb-2">Recent Posts</h2>
        {allBlogs.length === 0 ? (
            <p className="text-center text-lg text-gray-300 p-8 bg-[#2A2E36] rounded-lg shadow-sm">
                No blogs available yet.
            </p>
        ) : (
            <div className="space-y-6">
                {allBlogs.map((blog) => (
                    <PostDetails
                        key={blog.id} // Ensure a unique key
                        title={blog.title}
                        content={blog.content}
                        author={blog.author}
                        // onEdit is passed, but actual editing happens in MyPosts
                        // You might want to remove this if posts are read-only here
                        onEdit={handleEditPost}
                    />
                ))}
            </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg cursor-pointer transition-all duration-300"
      >
        <Plus className="w-6 h-6" />
      </div>

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
          message="Welcome back to the Blog Web App!"
          onClose={() => setShowWelcomeBanner(false)}
        />
      )}
      {showNotificationBanner && notificationMessage && (
        <NotifyBanner
          message={notificationMessage}
          onClose={() => setShowNotificationBanner(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
