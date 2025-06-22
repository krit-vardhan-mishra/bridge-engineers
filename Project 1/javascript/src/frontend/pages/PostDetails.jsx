import { motion } from 'framer-motion';

export const PostDetails = ({ title, content, author }) => {
    return (
        <div className='pt-7 pr-7 pl-7 p-5 bg-[#1a1d23] rounded-lg shadow-lg'>
            <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#2A2E36] rounded-lg p-6 hover:border-2 transition-all duration-100">
                <h2 className="text-2xl font-semibold text-white mb-3">{title}</h2>
                <p className="text-gray-300 leading-relaxed">{content}</p>
                <p className='text-gray-400 mt-2'>Author: {author}</p>
            </motion.div>
        </div>
    );
}

export default PostDetails;
