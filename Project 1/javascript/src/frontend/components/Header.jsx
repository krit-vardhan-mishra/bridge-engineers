import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = ({ title, icons = [] }) => {
    return (
        <div className="w-full h-[70px] bg-gray-800/80 backdrop-blur-md shadow-md flex items-center justify-between px-4 border-b border-gray-700">
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold hover:scale-110 transition-transform duration-300">
                {title}
            </h1>
            <div className="flex items-center space-x-2 mr-[5px]">
                {icons.map(({ icon: Icon, link }, index) => (
                    <Link to={link} key={index}>
                        <div
                            className={`group p-2 rounded-full transition duration-200 cursor-pointer ${Icon === Trash2
                                    ? 'hover:bg-red-500/50'
                                    : 'hover:bg-white/10'
                                }`}
                        >
                            <Icon className="text-white w-6 h-6 transform transition-transform duration-200 group-hover:scale-110" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Header;
