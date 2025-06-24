import { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import DeletedPost from '../components/DeletedPost';
import NotifyBanner from '../components/ui/NotifyBanner';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';

export const DeletedBlogs = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmationDeleteId, setConfirmationDeleteId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    document.title = "Deleted Blogs";
  }, []);

  const [deletedPosts, setDeletedPosts] = useState([
    { id: 1, title: 'Hello', content: 'This is a deleted blog post.', author: 'Yash' },
    { id: 2, title: 'Namaste', content: 'Namaste from the other side.', author: 'Amit' },
    { id: 3, title: 'Namoskar', content: 'A greeting post.', author: 'Priya' },
    { id: 4, title: 'Pranaam', content: 'Respectfully deleted.', author: 'Ravi' }
  ]);

  const handleRestore = (id) => {
    setDeletedPosts(prev => prev.filter(post => post.id !== id));
    setNotificationMessage('Post restored successfully.');
    setShowNotification(true);
  };

  // Trigger dialog
  const handleDelete = (id) => {
    setConfirmationDeleteId(id);
    setIsDialogOpen(true);
  };

  // Confirm deletion
  const handleDeletionConfirm = (e) => {
    e.preventDefault();

    if (confirmationDeleteId !== null) {
      setDeletedPosts(prev =>
        prev.filter(post => post.id !== confirmationDeleteId)
      );
      setNotificationMessage('Blog deleted permanently.');
      setShowNotification(true);
      setConfirmationDeleteId(null);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="bg-[#1C222A] min-h-screen">
      <Header
        title="Your Deleted Posts"
        className="text-red-600"
        icons={[{ icon: Trash2, link: '/delete' }]}
      />

      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="bg-[#2A2E36] rounded-lg p-4 hover:border-2 transition-all duration-100 m-10"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-white font-semibold">Total Deleted Posts:</h3>
          <p className="text-xl font-bold text-red-400">{deletedPosts.length} Posts</p>
        </div>
      </motion.div>

      <div className="space-y-6 px-6 pb-10">
        {deletedPosts.map((post) => (
          <DeletedPost
            key={post.id}
            title={post.title}
            content={post.content}
            author={post.author}
            onRestore={() => handleRestore(post.id)}
            onDelete={() => handleDelete(post.id)}
          />
        ))}
      </div>

      {/* Confirm Delete Dialog */}
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setIsDialogOpen(false);
              setConfirmationDeleteId(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-[#1C222A] p-6 rounded-lg shadow-lg w-full max-w-sm relative"
              onClick={(e) => e.stopPropagation()} // Prevent backdrop click from closing when clicking inside
            >
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setConfirmationDeleteId(null);
                }}
                className="absolute top-2 right-2"
              >
                <X className="h-5 w-5 m-5 text-red-700 hover:text-red-500" />
              </button>
              <h2 className="text-white text-lg font-bold mb-4">
                Do you want to delete this blog permanently?
              </h2>
              <form onSubmit={handleDeletionConfirm}>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setConfirmationDeleteId(null);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-red-700 hover:bg-red-500 text-white py-2 px-4 rounded-lg"
                  >
                    Delete
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      {/* Deletion Notification */}
      {showNotification && (
        <NotifyBanner
          message={notificationMessage}
          duration={3000}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default DeletedBlogs;
