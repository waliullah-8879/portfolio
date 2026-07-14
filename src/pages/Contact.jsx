// src/pages/Contact.jsx
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeProvider";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    Loader2,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Contact() {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(0);

    // Calculate navbar height after component mounts
    useEffect(() => {
        const calculateNavbarHeight = () => {
            const navbar = document.querySelector('nav, header, [role="navigation"]');
            if (navbar) {
                setNavbarHeight(navbar.offsetHeight);
            } else {
                // Fallback for common navbar heights
                setNavbarHeight(64);
            }
        };

        calculateNavbarHeight();

        // Recalculate on window resize
        window.addEventListener('resize', calculateNavbarHeight);
        return () => window.removeEventListener('resize', calculateNavbarHeight);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (formData.phone && !/^3\d{9}$/.test(formData.phone)) {
            newErrors.phone =
                "Please enter a valid Pakistani phone number (10 digits starting with 3)";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters long";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log("Form submitted:", formData);

            setIsSubmitted(true);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                message: "",
            });
        } catch (error) {
            console.error("Form submission error:", error);
            setErrors({ submit: "Failed to send message. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            label: "Email",
            value: "waliullah8879@gmail.com",
            href: "mailto:waliullah8879@gmail.com",
        },
        {
            icon: Phone,
            label: "Phone",
            value: "+92 346 9376199",
            href: "tel:+923469376199",
        },
        {
            icon: MapPin,
            label: "Location",
            value: "Peshawar, Pakistan",
            href: "#",
        },
    ];

    if (isSubmitted) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"
                    }`}
                style={{ paddingTop: `${navbarHeight}px` }}
            >
                <div className="max-w-md w-full text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                        <CheckCircle className="w-12 sm:w-16 h-12 sm:h-16 text-green-500 mx-auto mb-4" />
                        <h2
                            className={`text-xl sm:text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"
                                }`}
                        >
                            Message Sent Successfully!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
                            Thank you for reaching out. I'll get back to you as soon as
                            possible.
                        </p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                        >
                            Send Another Message
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`relative min-h-screen px-4 sm:px-6 py-12 sm:py-16 lg:px-8 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"
                }`}
            style={{ paddingTop: `${navbarHeight}px` }}
        >
            {/* Background Shape */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                    className="relative left-1/2 -z-10 aspect-[1155/678] w-[72rem] max-w-none 
            -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr 
            from-pink-300 to-indigo-400 opacity-20
            sm:left-[calc(50%-40rem)] sm:w-[90rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%,100% 61.6%,97.5% 26.9%,85.5% 0.1%,80.7% 2%,72.5% 32.5%,60.2% 62.4%,52.4% 68.1%,47.5% 58.3%,45.2% 34.5%,27.5% 76.7%,0.1% 64.9%,17.9% 100%,27.6% 76.8%,76.1% 97.7%,74.1% 44.1%)",
                    }}
                ></div>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2
                        className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                    >
                        Get In Touch
                    </h2>
                    <p
                        className={`text-base sm:text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        Have a project in mind or just want to say hello? I'd love to hear
                        from you!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                    {/* Left Side - Info */}
                    <div>
                        <h3
                            className={`text-xl sm:text-2xl font-semibold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"
                                }`}
                        >
                            Let's talk about your project
                        </h3>

                        <p
                            className={`text-base sm:text-lg mb-6 sm:mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            I'm currently available for freelance work and open to new
                            opportunities. Feel free to reach out if you have any questions or
                            would like to collaborate.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 sm:space-y-4">
                            {contactInfo.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    className={`flex items-center py-2 transition-all duration-300 ${theme === "dark"
                                        ? "text-gray-300 hover:text-white"
                                        : "text-gray-700 hover:text-blue-600"
                                        }`}
                                >
                                    <div
                                        className="mr-3 sm:mr-4"
                                    >
                                        <item.icon className="w-5 sm:w-6 h-5 sm:h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm sm:text-base leading-tight">{item.label}</p>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{item.value}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="mt-6 sm:mt-8">
                            <h4
                                className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${theme === "dark" ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                Follow me on
                            </h4>
                            <div className="flex space-x-3 sm:space-x-4">
                                {[
                                    {
                                        name: "LinkedIn",
                                        href: "https://www.linkedin.com/in/wali-ullah-476747377",
                                        icon: <FaLinkedin />,
                                    },
                                    {
                                        name: "GitHub",
                                        href: "https://github.com/waliullah-8879",
                                        icon: <FaGithub />,
                                    },
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`transition-colors ${theme === "dark"
                                            ? "text-gray-400 hover:text-white"
                                            : "text-gray-800 hover:text-blue-600"
                                            } text-xl sm:text-2xl`}
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div
                        className={`rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"
                            }`}
                    >
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            {/* First/Last Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* First Name */}
                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className={`block text-sm font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"
                                            }`}
                                    >
                                        First name *
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`block w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${errors.firstName ? "border-red-500" : "border-gray-300"
                                            } ${theme === "dark"
                                                ? "bg-gray-700 text-white border-gray-600"
                                                : "bg-gray-50 text-gray-900 border-gray-300"
                                            } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                                        placeholder="Your first name"
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                                            <AlertCircle size={12} className="mr-1" />{" "}
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className={`block text-sm font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"
                                            }`}
                                    >
                                        Last name *
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`block w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${errors.lastName ? "border-red-500" : "border-gray-300"
                                            } ${theme === "dark"
                                                ? "bg-gray-700 text-white border-gray-600"
                                                : "bg-gray-50 text-gray-900 border-gray-300"
                                            } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                                        placeholder="Your last name"
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                                            <AlertCircle size={12} className="mr-1" />{" "}
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className={`block text-sm font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"
                                        }`}
                                >
                                    Email address *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`block w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${errors.email ? "border-red-500" : "border-gray-300"
                                        } ${theme === "dark"
                                            ? "bg-gray-700 text-white border-gray-600"
                                            : "bg-gray-50 text-gray-900 border-gray-300"
                                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                                    placeholder="your.email@example.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                                        <AlertCircle size={12} className="mr-1" /> {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className={`block text-sm font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"
                                        }`}
                                >
                                    Phone number (optional)
                                </label>
                                <div className="flex">
                                    <span
                                        className={`inline-flex items-center px-3 sm:px-4 rounded-l-lg text-xs sm:text-sm border-r ${theme === "dark"
                                            ? "bg-gray-700 text-gray-300 border-gray-600"
                                            : "bg-gray-100 text-gray-700 border-gray-300"
                                            }`}
                                    >
                                        +92
                                    </span>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`flex-1 border block w-full rounded-r-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${errors.phone ? "border-red-500" : "border-gray-300"
                                            } ${theme === "dark"
                                                ? "bg-gray-700 text-white border-gray-600"
                                                : "bg-gray-50 text-gray-900 border-gray-300"
                                            } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                                        placeholder="3001234567"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                                        <AlertCircle size={12} className="mr-1" /> {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <label
                                    htmlFor="message"
                                    className={`block text-sm font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"
                                        }`}
                                >
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={`block w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${errors.message ? "border-red-500" : "border-gray-300"
                                        } ${theme === "dark"
                                            ? "bg-gray-700 text-white border-gray-600"
                                            : "bg-gray-50 text-gray-900 border-gray-300"
                                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                                    placeholder="Tell me about your project or just say hello..."
                                />
                                {errors.message && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                                        <AlertCircle size={12} className="mr-1" /> {errors.message}
                                    </p>
                                )}
                            </div>

                            {errors.submit && (
                                <p className="text-red-500 text-xs sm:text-sm flex items-center">
                                    <AlertCircle size={12} className="mr-1" /> {errors.submit}
                                </p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold 
                  hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} className="mr-2" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}