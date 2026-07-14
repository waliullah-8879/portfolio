import { Mail, Phone, MessageCircle, Copyright } from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const phoneNumber = "923469376199";
    const email = "waliullah8879@gmail.com";
    const linkedin = "https://www.linkedin.com/in/wali-ullah-476747377";
    const github = "https://github.com/waliullah-8879";
    const instagram = "https://www.instagram.com/waliullah5837";

    const openWhatsApp = () => window.open(`https://wa.me/${phoneNumber}`, '_blank');
    const callNumber = () => window.open(`tel:${phoneNumber}`, '_blank');
    const openGmail = () => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');

    return (
        <footer className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white py-6 sm:py-8 border-t border-gray-200 dark:border-gray-700 font-sans shadow-[0_-4px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_10px_rgba(255,255,255,0.05)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col items-center space-y-8">
                    <div className="flex flex-col items-center space-y-4">
                        <h3 className="text-lg sm:text-xl font-bold">Connect With Me</h3>
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
                            <button
                                onClick={openWhatsApp}
                                className="bg-green-500 dark:bg-green-600 p-3 rounded-full hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-white"
                                aria-label="Chat on WhatsApp"
                            >
                                <MessageCircle size={20} />
                            </button>
                            <button
                                onClick={callNumber}
                                className="bg-blue-500 dark:bg-blue-600 p-3 rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-white"
                                aria-label="Call me"
                            >
                                <Phone size={20} />
                            </button>
                            <button
                                onClick={openGmail}
                                className="bg-red-500 dark:bg-red-600 p-3 rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-white"
                                aria-label="Send email"
                                title="Send email"
                            >
                                <Mail size={20} />
                            </button>
                            <a
                                href={linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-400 dark:bg-blue-800 p-3 rounded-full hover:bg-blue-500 dark:hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 text-white"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin size={20} />
                            </a>
                            <a
                                href={github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-500 dark:bg-gray-700 p-3 rounded-full hover:bg-gray-600 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 text-white"
                                aria-label="GitHub"
                            >
                                <FaGithub size={20} />
                            </a>
                            <a
                                href={instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-pink-500 dark:bg-pink-600 p-3 rounded-full hover:bg-pink-600 dark:hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 text-white"
                                aria-label="Instagram"
                            >
                                <FaInstagram size={20} />
                            </a>
                        </div>
                    </div>

                </div>
                <div className="border-t border-gray-300 dark:border-gray-700 mt-6 pt-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                        <Copyright size={12} />
                        <span>{currentYear} Waliullah. All rights reserved.</span>
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                        Built with React & Tailwind CSS
                    </p>
                </div>
            </div>
        </footer>
    );
}
