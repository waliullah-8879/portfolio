import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeProvider";
import { FaGithub, FaExternalLinkAlt, FaFilter, FaTimes, FaGooglePlay } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { fallbackProjects } from "../data/fallbackData";

export default function Projects() {
    const { theme } = useTheme();
    const [activeFilter, setActiveFilter] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    const ALLOWED_PROJECT_TITLES = [
        "Fake News Detector",
        "TutorZone – UI design",
        "Personal Portfolio",
        "Prisoner Management System",
        "Breast AI App",
        "PhishGuard – Spam Email Detector",
        "Fire Fighting Robot",
        "Cavdar Multibrand Store",
        "Aims Collection, E-Commerce Website",
        "Fake Store – React + Axios",
        "Initial SignIn Android View"
    ];

    // Titles for which the GitHub link should be hidden
    const NO_GITHUB_TITLES = ["cavdar multibrand store", "aims collection, e-commerce website"];

    const stripGithubIfNeeded = (project) => {
        if (!project) return project;
        if (NO_GITHUB_TITLES.includes(normalizeTitle(project.title))) {
            const { github, ...rest } = project;
            return rest;
        }
        return project;
    };

    const normalizeTitle = (title) => {
        if (!title) return "";
        return title.toLowerCase().replace(/[\u2013\u2014]/g, "-").replace(/\s+/g, " ").trim();
    };

    const fetchProjects = async () => {
        setError(null);
        try {
            // Option 1: Try remote deployed server first
            const res = await fetch('https://portfolio-fuaq.onrender.com/api/portfolio/projects');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            const merged = ALLOWED_PROJECT_TITLES.map(allowedTitle => {
                const normAllowed = normalizeTitle(allowedTitle);
                const fetchedProject = (data || []).find(p => normalizeTitle(p.title) === normAllowed);
                const localProject = fallbackProjects.find(p => normalizeTitle(p.title) === normAllowed);
                const project = fetchedProject || localProject;
                // Always prefer local image (handles imported assets & overrides stale API images)
                const merged = project && localProject?.image ? { ...project, image: localProject.image } : project;
                return stripGithubIfNeeded(merged);
            }).filter(Boolean);
            setProjects(merged);
        } catch (remoteErr) {
            console.warn("Projects: Remote fetch failed, trying local proxy fallback:", remoteErr);
            try {
                // Option 2: Try local server via proxy (/api/projects)
                const res = await fetch('/api/projects');
                if (!res.ok) throw new Error(`HTTP local error! status: ${res.status}`);
                const data = await res.json();
                const merged = ALLOWED_PROJECT_TITLES.map(allowedTitle => {
                    const normAllowed = normalizeTitle(allowedTitle);
                    const fetchedProject = (data || []).find(p => normalizeTitle(p.title) === normAllowed);
                    const localProject = fallbackProjects.find(p => normalizeTitle(p.title) === normAllowed);
                    const project = fetchedProject || localProject;
                    // Always prefer local image (handles imported assets & overrides stale API images)
                    const merged = project && localProject?.image ? { ...project, image: localProject.image } : project;
                    return stripGithubIfNeeded(merged);
                }).filter(Boolean);
                setProjects(merged);
            } catch (localErr) {
                console.error("Projects: Both remote and local fetches failed, loading local fallback data:", localErr);
                setProjects(fallbackProjects);
                setError(null); // Clear error, load fallback projects instead
            }
        }
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

        // Recalculate on window resize
        window.addEventListener('resize', calculateNavbarHeight);

        fetchProjects();

        return () => window.removeEventListener('resize', calculateNavbarHeight);
    }, []);


    const categories = [
        { id: "all", name: "All Projects", count: projects.length },
        { id: "react", name: "React.js", count: projects.filter(p => p.category.includes("react")).length },
        { id: "react native", name: "Mobile App Development", count: projects.filter(p => p.category.includes("react native")).length },
        { id: "htmlcss", name: "HTML/CSS", count: projects.filter(p => p.category.includes("htmlcss")).length },
        { id: "management", name: "Management System", count: projects.filter(p => p.category.includes("management")).length },
        { id: "robotics", name: "🤖 Robotics", count: projects.filter(p => p.category.includes("robotics")).length },
        { id: "andriod", name: "Android Development", count: projects.filter(p => p.category.includes("andriod")).length },
        { id: "javascript", name: "Javascript", count: projects.filter(p => p.category.includes("javascript")).length },
        { id: "php", name: "PHP", count: projects.filter(p => p.category.includes("php")).length },
        { id: "ai", name: "AI/Machine Learning", count: projects.filter(p => p.category.includes("ai")).length }
    ];

    const filteredProjects = activeFilter === "all"
        ? projects
        : projects.filter(project =>
            Array.isArray(project.category)
                ? project.category.includes(activeFilter)
                : project.category === activeFilter
        );

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
            style={{ paddingTop: `${navbarHeight}px` }}
        >
            {/* Mobile Filter Toggle Button */}
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                style={{ top: `calc(1rem + ${navbarHeight}px)` }}
            >
                <FaFilter className="text-blue-600" />
            </button>

            {/* Main Content Container */}
            <div className="flex w-full px-6 sm:px-10 lg:px-16">
                {/* Sidebar Filter - Desktop */}
                <div className="hidden lg:block w-64 flex-shrink-0 py-6 pr-4">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                                Filter Projects
                            </h2>
                            <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold">
                                {filteredProjects.length} projects
                            </span>
                        </div>

                        {/* Filter Categories */}
                        <div className="space-y-1.5">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveFilter(category.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-300 border group ${activeFilter === category.id
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md font-medium scale-[1.02]"
                                            : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:scale-[1.02] hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 shadow-sm"
                                        }`}
                                >
                                    <span className={`text-xs font-medium transition-colors duration-200 ${activeFilter === category.id ? "text-white" : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                        }`}>{category.name}</span>
                                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 ${activeFilter === category.id
                                            ? "bg-white/20 text-white"
                                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300"
                                        }`}>
                                        {category.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Tip Section */}
                        <div className="mt-5 p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                            <h3 className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1 text-xs mb-1">💡 Tip</h3>
                            <p className="text-blue-700 dark:text-blue-300 text-[11px] leading-relaxed">
                                Check out my Android Development projects including native mobile applications!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile Filter Overlay */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                                onClick={() => setIsFilterOpen(false)}
                            />
                            <motion.div
                                initial={{ x: -300 }}
                                animate={{ x: 0 }}
                                exit={{ x: -300 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="fixed left-0 top-0 h-screen w-80 bg-white dark:bg-gray-800 z-50 lg:hidden overflow-y-auto"
                                style={{ paddingTop: `${navbarHeight}px` }}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Filter Projects
                                        </h2>
                                        <button
                                            onClick={() => setIsFilterOpen(false)}
                                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            <FaTimes size={20} />
                                        </button>
                                    </div>

                                    {/* Mobile Filter Categories */}
                                    <div className="space-y-2">
                                        {categories.map(category => (
                                            <button
                                                key={category.id}
                                                onClick={() => {
                                                    setActiveFilter(category.id);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-300 ${activeFilter === category.id
                                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-[1.02]"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:shadow-md hover:scale-[1.01] dark:bg-gray-700 dark:text-gray-300 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 dark:hover:text-blue-300"
                                                    }`}
                                            >
                                                <span className="font-medium">{category.name}</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${activeFilter === category.id
                                                        ? "bg-white/20 text-white"
                                                        : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                                                    }`}>
                                                    {category.count}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Content Area */}
                <div className="flex-1 py-6 lg:pl-6">
                    <div className="w-full">

                        {/* Hero Section */}
                        <div className="relative h-64 md:h-60 flex items-center justify-center overflow-hidden rounded-3xl mb-8 
                    bg-gradient-to-br from-gray-100 to-gray-200 
                    dark:from-gray-900 dark:to-gray-800 
                    transition-colors duration-500">

                            <div className="absolute top-0 right-0 w-1/2 h-full 
                      bg-gradient-to-br from-blue-400/10 to-transparent 
                      dark:from-blue-500/10 dark:to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 
                      bg-gradient-to-tr from-purple-400/10 to-transparent 
                      dark:from-purple-500/10 dark:to-transparent"></div>

                            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full 
                      bg-blue-400/20 dark:bg-blue-500/20 
                      animate-pulse-slow"></div>
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full 
                      bg-purple-400/20 dark:bg-purple-500/20 
                      animate-pulse-slower"></div>

                            <div className="relative z-10 text-center px-6">
                                <div className="inline-block p-2 rounded-full 
                        bg-white/20 dark:bg-white/5 
                        backdrop-blur-sm border border-gray-300/30 dark:border-white/10 
                        mb-6 transition-all duration-500">
                                    <div className="w-3 h-3 
                          bg-blue-500 dark:bg-blue-400 
                          rounded-full animate-pulse 
                          transition-colors duration-500"></div>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold 
                       text-gray-800 dark:text-white 
                       mb-4 transition-colors duration-500">
                                    My <span className="text-blue-600 dark:text-blue-400 transition-colors duration-500">Projects</span>
                                </h1>

                                <p className="text-lg 
                     text-gray-600 dark:text-gray-300 
                     font-light max-w-md mx-auto 
                     transition-colors duration-500">
                                    Explore my Android Development projects including native mobile applications and various web applications
                                </p>
                            </div>
                        </div>

                        {/* Current Filter Indicator */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {filteredProjects.length} of {projects.length} projects
                                </span>
                                {activeFilter !== "all" && (
                                    <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-full">
                                        {categories.find(c => c.id === activeFilter)?.name}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <FaFilter size={14} />
                                Filter
                            </button>
                        </div>

                        {/* Projects Grid */}
                        <div className="mb-12">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFilter}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                                >
                                    {filteredProjects.map((project) => (
                                        <motion.div
                                            key={project._id || project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4 }}
                                            whileHover={{ y: -8 }}
                                            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.technologies.slice(0, 3).map((tech, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-1 bg-blue-600/90 text-white text-xs rounded-full font-medium"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {project.technologies.length > 3 && (
                                                            <span className="px-3 py-1 bg-gray-800/90 text-white text-xs rounded-full font-medium">
                                                                +{project.technologies.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                                    {project.description}
                                                </p>

                                                {/* Tech stack visible on mobile/tablet (below lg), hidden on desktop where mouse hover works */}
                                                <div className="flex flex-wrap gap-2 mb-4 lg:hidden">
                                                    {project.technologies.map((tech, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex gap-2">
                                                        {project.github && (
                                                            <a
                                                                href={project.github}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                                title="View Code"
                                                            >
                                                                <FaGithub size={16} />
                                                            </a>
                                                        )}
                                                        {project.live && (
                                                            <a
                                                                href={project.live}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                                                title="Live Demo"
                                                            >
                                                                <FaExternalLinkAlt size={14} />
                                                            </a>
                                                        )}
                                                        {project.playStore && (
                                                            <a
                                                                href={project.playStore}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                                                title="Google Play Store"
                                                            >
                                                                <FaGooglePlay size={14} />
                                                            </a>
                                                        )}
                                                    </div>

                                                    <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full font-medium">
                                                        {Array.isArray(project.category)
                                                            ? project.category[0].toUpperCase()
                                                            : project.category.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            {/* Error or No Projects Found Message */}
                            {error ? (
                                <div className="text-center py-16 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 max-w-lg mx-auto shadow-sm">
                                    <div className="text-5xl mb-4">⚠️</div>
                                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
                                        Server Connection Issue
                                    </h3>
                                    <p className="text-red-700 dark:text-red-400 text-sm mb-5">
                                        Could not load projects. This may happen if the remote database is sleeping or if you are running locally without starting your database server.
                                        <br />
                                        <span className="font-mono text-xs opacity-80 mt-1 block">({error})</span>
                                    </p>
                                    <button
                                        onClick={fetchProjects}
                                        className="px-5 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium shadow-md cursor-pointer"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : filteredProjects.length === 0 && (
                                <div className="text-center py-16">
                                    <div className="text-5xl mb-4">🔍</div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        No projects found
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Try selecting a different category or check back later for new projects.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Animation Styles */}
            <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.03); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .animate-bounce { animation: bounce 1.5s ease-in-out infinite; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
}
