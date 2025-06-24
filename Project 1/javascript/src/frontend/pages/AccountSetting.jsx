import { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import { HomeIcon, Eye, EyeOff, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import NotifyBanner from '../components/ui/NotifyBanner';
import Footer from '../components/Footer';

export const AccountSetting = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const formRef = useRef(null);
    
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const validatePassword = (password) => {
        return password === 'password123';
    };

    const handlePasswordConfirm = (e) => {
        e.preventDefault();
        if (validatePassword(confirmationPassword)) {
            setIsDialogOpen(false);
            setConfirmationPassword('');
            setErrorMessage('');

            const formData = new FormData(formRef.current);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
            };
            console.log('Form submitted:', data);

            setShowNotification(true);
        } else {
            setErrorMessage('Incorrect password. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isDialogOpen) {
            setIsDialogOpen(true);
            return;
        }
        const formData = new FormData(e.target);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
        };
        console.log('Form submitted:', data);
    };

    useEffect(() => {
        document.title = 'Account Setting';
    }, []);

    return (
        <div className="bg-[#1C222A] min-h-screen">
            <Header
                title="Account Setting"
                className="border-red-500"
                icons={[{ icon: HomeIcon, link: '/home' }]}
            />
            <div className='bg-[31C222A] min-h-screen flex items-center justify-center'>
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="w-full max-w-md space-y-6 p-4"
                >
                    {/* First Name */}
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <label
                            className="col-span-1 text-white font-bold transform transition-transform duration-200 hover:scale-110"
                            htmlFor="firstName"
                        >
                            First Name:
                        </label>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="col-span-3"
                        >
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="w-full p-3 bg-[#1C222A] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 hover:border-white hover:border-2 transition duration-200"
                                placeholder="Enter your first name"
                                required
                            />
                        </motion.div>
                    </div>

                    {/* Last Name */}
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <label
                            className="col-span-1 text-white font-bold transform transition-transform duration-200 hover:scale-110"
                            htmlFor="lastName"
                        >
                            Last Name:
                        </label>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="col-span-3"
                        >
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="w-full p-3 bg-[#1C222A] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 hover:border-white hover:border-2 transition duration-200"
                                placeholder="Enter your last name"
                                required
                            />
                        </motion.div>
                    </div>

                    {/* Email */}
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <label
                            className="col-span-1 text-white font-bold transform transition-transform duration-200 hover:scale-110"
                            htmlFor="email"
                        >
                            Email:
                        </label>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="col-span-3"
                        >
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full p-3 bg-[#1C222A] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 hover:border-white hover:border-2 transition duration-200"
                                placeholder="Enter your email"
                                required
                            />
                        </motion.div>
                    </div>

                    {/* About Yourself */}
                    <div className="grid grid-cols-4 gap-4 items-start">
                        <label
                            className="col-span-1 text-white font-bold transform transition-transform duration-200 hover:scale-110"
                            htmlFor="about"
                        >
                            About Yourself:
                        </label>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="col-span-3"
                        >
                            <textarea
                                id="about"
                                name="about"
                                rows={3}
                                className="w-full p-3 bg-[#1C222A] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 hover:border-white hover:border-2 transition duration-200 resize-none"
                                placeholder="Write something about yourself..."
                                required
                            />
                        </motion.div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center space-x-4 mt-6">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
                            >
                                Save Changes
                            </Button>
                        </motion.div>
                    </div>
                </form>
            </div>

            {/* Password Confirmation Dialog */}
            {isDialogOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        className="bg-[#1C222A] p-6 rounded-lg shadow-lg w-full max-w-sm relative"
                    >
                        <button
                            onClick={() => {
                                setIsDialogOpen(false);
                                setConfirmationPassword('');
                                setErrorMessage('');
                            }}
                            className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h2 className="text-white text-lg font-bold mb-4">Confirm Password</h2>
                        <form onSubmit={handlePasswordConfirm}>
                            <div className="relative mb-4">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmationPassword}
                                    onChange={(e) => setConfirmationPassword(e.target.value)}
                                    className="w-full p-3 bg-[#1C222A] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 hover:border-white hover:border-2 transition duration-200"
                                    placeholder="Enter your password"
                                    required
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-white" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-white" />
                                    )}
                                </div>
                            </div>
                            {errorMessage && (
                                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                            )}
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsDialogOpen(false);
                                        setConfirmationPassword('');
                                        setErrorMessage('');
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                                >
                                    Confirm
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}

            <Footer />
            
            {showNotification && (
                <NotifyBanner
                    message="Entered data has been updated."
                    duration={3000}
                    onClose={() => setShowNotification(false)}
                />
            )}
        </div>
    );
};

export default AccountSetting;