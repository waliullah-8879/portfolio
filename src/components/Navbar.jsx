// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeProvider";
import { Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const navLinks = [{ to: "/", label: "Home" }];
    const dropdownLinks = [
        { to: "/about", label: "About" },
        { to: "/projects", label: "Projects" },
        { to: "/contact", label: "Contact" },
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const isActive = (path) =>
        location.pathname === path
            ? theme === "dark"
                ? "text-purple-400"
                : "text-blue-600"
            : "";

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 flex flex-col justify-center 
        px-6 py-3 transition-all duration-300 backdrop-blur-md
        ${theme === "dark" ? "text-white" : "text-gray-900"}
        ${isScrolled
                    ? theme === "dark"
                        ? "bg-gray-900/95 shadow-lg border-b border-gray-800"
                        : "bg-white/95 shadow-md border-b border-gray-100"
                    : "bg-transparent shadow-none"
                }`}
        >
            <div className="flex items-center justify-between w-full max-w-6xl mx-auto px-4 sm:px-6">
                <Link
                    to="/"
                    className={`text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-300 ${theme === "dark" ? "text-purple-400" : "text-blue-600"
                        }`}
                >
                    <Typewriter
                        words={["MY PORTFOLIO", "WALI ULLAH"]}
                        loop={0}
                        cursor
                        cursorStyle="|"
                        typeSpeed={80}
                        deleteSpeed={50}
                        delaySpeed={3500}
                    />
                </Link>

                <div className="hidden md:flex items-center gap-6 relative">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`relative font-semibold hover:opacity-80 transition-colors ${isActive(
                                link.to,
                            )}`}
                        >
                            {link.label}
                            {location.pathname === link.to && (
                                <motion.div
                                    layoutId="underline"
                                    className={`absolute left-0 -bottom-1 h-[2px] w-full ${theme === "dark" ? "bg-purple-400" : "bg-blue-600"
                                        }`}
                                />
                            )}
                        </Link>
                    ))}

                    <div
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <button
                            className="flex items-center gap-1 font-semibold hover:opacity-80 pb-2"
                        >
                            Menu <ChevronDown size={18} />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute top-full left-0 w-48 rounded-lg shadow-xl border overflow-hidden
                    ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                                >
                                    {dropdownLinks.map((link) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className={`block px-4 py-3 transition-colors duration-200 font-medium
                        hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 ${isActive(link.to)}`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full transition-colors duration-300 
                bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 shadow-sm border border-gray-300 dark:border-gray-600"
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <div className="md:hidden flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full transition-colors duration-300 
                bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 shadow-sm border border-gray-300 dark:border-gray-600"
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-full transition-colors duration-300 
                bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 shadow-sm border border-gray-300 dark:border-gray-600"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-40 md:hidden"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`fixed top-16 left-0 right-0 z-50 md:hidden
                  ${theme === "dark" ? "bg-gray-900" : "bg-white"} shadow-lg`}
                        >
                            <div className="flex flex-col px-6 py-4 space-y-2">
                                {navLinks.concat(dropdownLinks).map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`py-3 px-4 rounded font-medium transition-colors duration-300 
                        hover:bg-gray-100 dark:hover:bg-gray-800 items-center justify-center flex ${isActive(link.to)}`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default Navbar;
