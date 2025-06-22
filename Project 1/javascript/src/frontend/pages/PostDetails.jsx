import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { useEffect } from 'react';

export const PostDetails = ({ title, content, author, onEdit }) => {
  useEffect(() => {
    document.title = "Edit Post";
  })

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Pencil clicked for:', title);
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div className='pt-7 pr-7 pl-7 p-5 bg-[#1a1d23] rounded-lg shadow-lg'>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="bg-[#2A2E36] rounded-lg p-6 hover:border-2 transition-all duration-100"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <button
            onClick={handleEditClick}
            className="p-2 rounded-lg hover:bg-[#3A3E46] transition-all duration-200"
            aria-label="Edit post"
          >
            <Pencil
              className="h-5 w-5 text-white cursor-pointer hover:text-blue-400"
            />
          </button>
        </div>
        <p className="pt-2 text-gray-300 leading-relaxed">{content}</p>
        <p className='text-gray-400 mt-2'>Author: {author}</p>
      </motion.div>
    </div>
  );
};

export default PostDetails;