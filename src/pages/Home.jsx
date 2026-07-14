import { Link } from "react-router-dom";
import profilePic from "../assets/profile (2).png";
import { useState, useEffect } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useTheme } from "../context/ThemeProvider";
import { fallbackOverview, fallbackProjects } from "../data/fallbackData";

// Typing effect component
function TypingHeading() {
    const texts = [
        "WEB DEVELOPER",
        "MOBILE APP DEVELOPER",
        "B.S COMPUTER SCIENCE",
    ];

    const [text, setText] = useState("");
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (index === texts.length) setIndex(0);

        const timeout = setTimeout(() => {
            const current = texts[index];
            if (!deleting) {
                setText(current.substring(0, subIndex + 1));
                setSubIndex(subIndex + 1);
                if (subIndex + 1 === current.length) {
                    setTimeout(() => setDeleting(true), 1500);
                }
            } else {
                setText(current.substring(0, subIndex - 1));
                setSubIndex(subIndex - 1);
                if (subIndex - 1 === 0) {
                    setDeleting(false);
                    setIndex((index + 1) % texts.length);
                }
            }
        }, deleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [subIndex, index, deleting, texts]);

    return (
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-2 h-8 sm:h-10 md:h-12">
            {text}
            <span className="animate-pulse">|</span>
        </h3>
    );
}

export default function Home() {
    const { theme } = useTheme();
    const [navbarHeight, setNavbarHeight] = useState(0);
    const [overview, setOverview] = useState({});
    const [latestProject, setLatestProject] = useState(null);

    const handleCVDownload = () => {
        // Always use fallbackOverview.cvUrl to avoid stale API data overriding the link
        const cvUrl = fallbackOverview.cvUrl;
        window.open(cvUrl, '_blank');
    };

    // Calculate navbar height after component mounts
    useEffect(() => {
        const calculateNavbarHeight = () => {
            const navbar = document.querySelector('nav, header, [role="navigation"]');
            if (navbar) {
                setNavbarHeight(navbar.offsetHeight);
            } else {
                setNavbarHeight(64);
            }
        };

        calculateNavbarHeight();
        window.addEventListener('resize', calculateNavbarHeight);

        const ALLOWED_PROJECT_TITLES = [
            "Fake News Detector",
            "TutorZone – UI design",
            "Personal Portfolio",
            "Cavdar Multibrand Store",
            "Aims Collection, E-Commerce Website",
            "Fake Store – React + Axios",
            "Initial SignIn Android View"
        ];

        const normalizeTitle = (title) => {
            if (!title) return "";
            return title.toLowerCase().replace(/[\u2013\u2014]/g, "-").replace(/\s+/g, " ").trim();
        };

        const fetchData = async () => {
            try {
                // Try remote first
                const [overviewData, projects] = await Promise.all([
                    fetch('https://portfolio-fuaq.onrender.com/api/portfolio/overview').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
                    fetch('https://portfolio-fuaq.onrender.com/api/portfolio/projects').then(r => { if (!r.ok) throw new Error(); return r.json(); })
                ]);
                setOverview(overviewData || {});
                const merged = ALLOWED_PROJECT_TITLES.map(allowedTitle => {
                    const normAllowed = normalizeTitle(allowedTitle);
                    const fetchedProject = (projects || []).find(p => normalizeTitle(p.title) === normAllowed);
                    return fetchedProject || fallbackProjects.find(p => normalizeTitle(p.title) === normAllowed);
                }).filter(Boolean);

                if (merged.length > 0) {
                    const featured = merged.find(p => p.featured) || merged[0];
                    setLatestProject(featured);
                }
            } catch (remoteErr) {
                console.warn("Home: Remote fetch failed, trying local proxy fallback:", remoteErr);
                try {
                    // Fallback to local server proxy
                    const [overviewData, projects] = await Promise.all([
                        fetch('/api/overview').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
                        fetch('/api/projects').then(r => { if (!r.ok) throw new Error(); return r.json(); })
                    ]);
                    setOverview(overviewData || {});
                    const merged = ALLOWED_PROJECT_TITLES.map(allowedTitle => {
                        const normAllowed = normalizeTitle(allowedTitle);
                        const fetchedProject = (projects || []).find(p => normalizeTitle(p.title) === normAllowed);
                        return fetchedProject || fallbackProjects.find(p => normalizeTitle(p.title) === normAllowed);
                    }).filter(Boolean);

                    if (merged.length > 0) {
                        const featured = merged.find(p => p.featured) || merged[0];
                        setLatestProject(featured);
                    }
                } catch (localErr) {
                    console.error("Home: Both remote and local fetches failed, loading local fallback data:", localErr);
                    setOverview(fallbackOverview);
                    if (fallbackProjects && fallbackProjects.length > 0) {
                        setLatestProject(fallbackProjects[0]);
                    }
                }
            }
        };

        fetchData();

        return () => window.removeEventListener('resize', calculateNavbarHeight);
    }, []);

    const workProjects = [
        {
            id: 1,
            title: "TutorZone – UI design",
            description: "Designed and developed a smart mobile application with modern design system. Implemented responsive layouts, interactive UI/UX, dark/light mode theming,real time chat, live location tracking, tutor booking, parental controll and much more features.",
            image: "https://u.today/sites/default/files/styles/736x/public/2024-01/s1348.jpg",
            link: "https://play.google.com/store/apps/details?id=com.tutorzone.app",
            live: "https://play.google.com/store/apps/details?id=com.tutorzone.app",
            tech: ["React native", "Tailwind CSS", "JavaScript", "rest api", "UI/UX Design"]
        }
    ];

    return (
        <section
            className="relative flex flex-col items-center justify-center gap-12 px-6 py-16 max-w-6xl mx-auto transition-colors duration-300 overflow-hidden"
            style={{ paddingTop: `calc(1.5rem + ${navbarHeight}px)` }}
        >
            {/* Light mode gradient background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-10 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Dark mode animated background */}
            {theme === "dark" && (
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                        {[...Array(30)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-white animate-float"
                                style={{
                                    width: `${Math.random() * 3 + 1}px`,
                                    height: `${Math.random() * 3 + 1}px`,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: Math.random() * 0.6 + 0.2,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${Math.random() * 10 + 10}s`,
                                }}
                            />
                        ))}

                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full animate-pulse-slow mix-blend-soft-light"></div>
                            <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full animate-pulse-slower mix-blend-soft-light"></div>
                            <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-indigo-500 rounded-full animate-pulse-slowest mix-blend-soft-light"></div>
                        </div>

                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-12 w-full mt-4 md:mt-0">
                {/* Left Content */}
                <div className="text-center md:text-left flex-1">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
                        Hi, I'm{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-purple-400 dark:to-pink-400">
                            Waliullah
                        </span>{" "}
                        👋
                    </h2>

                    <TypingHeading />

                    <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
                        junior software engineer | mobile app developer
                    </p>

                    {/* Tech Stack */}
                    <div className="mt-6 flex flex-wrap gap-2 py-2 justify-center md:justify-start">
                        {["HTML/CSS", "Figma", "Bootstrap", "JavaScript", "React", "Tailwind", "Github"].map((tech, idx) => (
                            <span
                                key={idx}
                                className={`px-3 py-1.5 rounded-full font-medium text-xs sm:text-sm ${idx % 2 === 0
                                    ? "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                    : "bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                                    }`}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-row gap-4 justify-center md:justify-start">
                        <button
                            onClick={handleCVDownload}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium 
                       bg-gradient-to-r from-blue-500 to-purple-500 text-white 
                       hover:opacity-90 transition-all 
                       text-sm sm:text-base shadow-md"
                        >
                            Download CV <ArrowRight size={16} />
                        </button>
                        <Link
                            to="/contact"
                            className="flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm sm:text-base border-opacity-70 bg-white/50 dark:bg-gray-800"
                        >
                            Contact Me
                        </Link>
                    </div>
                </div>

                {/* Right Side - Profile Image */}
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 flex-shrink-0 mx-auto md:mx-0 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl ring-4 ring-white dark:ring-gray-800 group-hover:scale-105 transition-all">
                        <img
                            src={profilePic}
                            alt="Sameer Khan"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* About Me Card */}
            <div className="w-full max-w-6xl mt-8 sm:mt-12 px-4 mx-auto">
                <div
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl 
                     border border-gray-100 dark:border-gray-700 
                     h-80 sm:h-96 overflow-y-auto 
                     transition-all duration-300 
                     hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] 
                     hover:border-blue-400"
                >
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        About Me
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 text-justify leading-relaxed">
                        I am currently completing my Bachelor's in Computer Science at City
                        University of Science and Information Technology, Peshawar, while
                        simultaneously advancing my expertise in mobile app development and web app development.
                    </p>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 text-justify leading-relaxed">
                        I specialize in creating modern, scalable web applications, mobile application that
                        prioritize performance, responsiveness, and exceptional user
                        experiences.
                    </p>
                    <div className="text-center mt-6 sm:mt-8">
                        <Link
                            to="/about"
                            className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
                        >
                            More
                        </Link>
                    </div>
                </div>
            </div>

            {/* Latest Work Card */}
            <div className="w-full max-w-6xl mt-12 sm:mt-16 px-4 mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                    Recent Work
                </h3>
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:border-emerald-400">
                    <div className="w-full h-48 sm:h-60 md:h-72 lg:h-80 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <img
                            src={latestProject?.image || ""}
                            alt={latestProject?.title || "Latest Project"}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors">
                            {latestProject?.title || "portfolio website"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base">
                            {latestProject?.description || "A full-stack modern platform built with the MERN stack."}
                        </p>

                        <div className="flex flex-wrap gap-1 sm:gap-2">
                            {(latestProject?.technologies || ["React", "Express", "MongoDB", "Node.js"]).map((tech, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 sm:px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm font-medium"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-4 gap-3 sm:gap-4">
                            <Link
                                to={latestProject?.live || "#"}
                                className="flex items-center text-blue-600 dark:text-purple-400 hover:underline font-medium text-sm sm:text-base"
                            >
                                View Details <ArrowRight size={16} className="ml-1" />
                            </Link>

                            <div className="flex gap-2 sm:gap-3">
                                <a
                                    href={latestProject?.github || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <FaGithub size={16} className="sm:w-4 sm:h-4" />
                                </a>
                                <a
                                    href={latestProject?.live || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <ExternalLink size={16} className="sm:w-4 sm:h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View All Projects Button */}
            <div className="text-center mt-8 sm:mt-10">
                <Link
                    to="/projects"
                    className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                    View All Projects
                </Link>
            </div>
        </section>
    );
}
