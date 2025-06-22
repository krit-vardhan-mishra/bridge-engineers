import { motion } from "framer-motion";

export default function CardBox({title, content, icon: Icon, actionButton}) {
    return (
        <motion.div whileHover={{ scale: 1.03}} whileTap={{ scale: 0.97}}
        className="bg-[#2A2E36] text-white rounded-2xl shadow-log p-6 w-full">
            <div className="flex items-center gap-3 mb-4">
                {Icon && <Icon size={28} />}
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>
            <p className="text-gray-300 mb-4">{content}</p>
            {actionButton && <div>{actionButton}</div>}
        </motion.div>
    );
}