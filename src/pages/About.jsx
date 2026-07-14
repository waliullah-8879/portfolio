// src/pages/About.jsx
import { useState, useEffect } from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { ArrowDown, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { fallbackOverview, fallbackSkills, fallbackCertificates, fallbackInternships } from "../data/fallbackData";

export default function About() {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [currentSkillSet, setCurrentSkillSet] = useState(0);
    const [navbarHeight, setNavbarHeight] = useState(0);

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

        // Always ensure Mobile App Development category is present
        const MOBILE_SKILL = {
            category: "Mobile App Development",
            technologies: ["React Native", "Firebase", "Appwrite", "React Native Maps", "Expo", "Android SDK", "UI/UX Design", "Push Notifications"]
        };
        const mergeSkills = (skills) => {
            let list = [...(skills || [])];
            // Normalize skills to consistently have category and technologies properties
            list = list.map(s => ({
                category: s.category || s.name || "",
                technologies: s.technologies || s.items || []
            }));
            // Add Mobile App Development if not already present
            const hasMobile = list.some(s => s.category?.toLowerCase().includes("mobile"));
            if (!hasMobile) list = [...list, MOBILE_SKILL];
            // Swap Networking & Cisco with Mobile App Development positions
            const netIdx = list.findIndex(s => s.category?.toLowerCase().includes("networking"));
            const mobIdx = list.findIndex(s => s.category?.toLowerCase().includes("mobile"));
            if (netIdx !== -1 && mobIdx !== -1) {
                [list[netIdx], list[mobIdx]] = [list[mobIdx], list[netIdx]];
            }
            return list;
        };

        const fetchData = async () => {
            // Always use local fallback for certificates (remote DB has stale data)
            setCertificates(fallbackCertificates || []);

            try {
                // Try remote first for other data
                const [interns, skills, overviewData] = await Promise.all([
                    fetch('https://portfolio-fuaq.onrender.com/api/portfolio/internships').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
                    fetch('https://portfolio-fuaq.onrender.com/api/portfolio/skills').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
                    fetch('https://portfolio-fuaq.onrender.com/api/portfolio/overview').then(r => { if (!r.ok) throw new Error(); return r.json(); })
                ]);
                setInternships(interns || []);
                setSkillsData(mergeSkills(skills));
                setOverview(overviewData || {});
            } catch (remoteErr) {
                console.warn("About: Remote fetch failed, trying local proxy fallback:", remoteErr);
                try {
                    // Fallback to local server proxy
                    const [interns, skills, overviewData] = await Promise.all([
                        fetch('/api/internships').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
                        fetch('/api/skills').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
                        fetch('/api/overview').then(r => { if (!r.ok) throw new Error(); return r.json(); })
                    ]);
                    setInternships(interns || []);
                    setSkillsData(mergeSkills(skills));
                    setOverview(overviewData || {});
                } catch (localErr) {
                    console.error("About: Both remote and local fetches failed, loading local fallback data:", localErr);
                    setInternships(fallbackInternships || []);
                    setSkillsData(mergeSkills(fallbackSkills));
                    setOverview(fallbackOverview || {});
                }
            }
        };

        fetchData();

        return () => window.removeEventListener('resize', calculateNavbarHeight);
    }, []);

    const [certificates, setCertificates] = useState([]);
    const [internships, setInternships] = useState([]);
    const [skillsData, setSkillsData] = useState([]);
    const [overview, setOverview] = useState({});

    const toolsUsed = overview.toolsUsed?.length > 0 ? overview.toolsUsed : [
        "HTML/CSS", "react native", "Bootstrap", "JavaScript", "React", "Tailwind",
        "Github", "Php", "Blender", "RestApis", "Python", "MySQL",
        "Generative AI", "Cisco Packet Tracer", "Network Essentials", "Machine Learning"
    ];

    const skillSets = skillsData.length > 0
        ? skillsData.map(s => ({ title: s.category, skills: s.technologies }))
        : [{ title: 'Loading...', skills: [] }];



    const toggleCategory = (index) => {
        setExpandedCategory(expandedCategory === index ? null : index);
    };

    const nextSkillSet = () => {
        setCurrentSkillSet((prev) => (prev + 1) % skillSets.length);
    };

    const prevSkillSet = () => {
        setCurrentSkillSet((prev) => (prev - 1 + skillSets.length) % skillSets.length);
    };

    const CustomArrow = ({ direction, onClick }) => (
        <button
            onClick={onClick}
            className={`absolute top-1/2 transform -translate-y-1/2 z-10 
                  bg-black/50 hover:bg-black/70 text-white rounded-full p-2
                  transition-all duration-300 ${direction === 'prev' ? 'left-4' : 'right-4'}`}
        >
            {direction === 'prev' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
    );

    const handleCVDownload = () => {
        const cvUrl = overview.cvUrl || "https://drive.google.com/file/d/1zqWkUkjK718UCRa1PkvlqkbeJcGXV93u/view?usp=sharing";
        window.open(cvUrl, '_blank');
    };

    return (
        <section
            className="px-4 sm:px-6 py-12 sm:py-16 space-y-8 sm:space-y-12 max-w-6xl mx-auto"
            style={{ paddingTop: `${navbarHeight}px` }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:border-blue-400">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                    About Me
                </h1>
                <p className="text-sm sm:text-md text-gray-600 dark:text-gray-300 text-justify leading-relaxed mb-4">
                    I am Sameer Khan, a Computer Science student at CUSIT and SMIT trainee,
                    passionate about building modern, responsive, and scalable web
                    applications using the MERN stack. I have experience in Front-End Development
                    and continuously work to improve my skills.
                </p>

                <p className="text-sm sm:text-md text-gray-600 dark:text-gray-300 text-justify leading-relaxed mb-4">
                    {overview.aboutMeText || `Throughout my career, I have used tools like React, Bootstrap,
          Php, JavaScript, Tailwind CSS, and Figma. Continuous practice is
          key — skills get rusty if you stop using them, so I keep sharpening my
          knowledge through projects and learning.
          Here are some tools and techniques that I have used while making projects.`}
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
                    {toolsUsed.map((tool, idx) => (
                        <span
                            key={idx}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                         dark:from-gray-700 dark:to-gray-800 
                         text-gray-800 dark:text-gray-200 font-medium text-xs sm:text-sm shadow-sm"
                        >
                            {tool}
                        </span>
                    ))}
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleCVDownload}
                        className="flex items-center justify-center gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg font-medium 
                     bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                     hover:from-blue-700 hover:to-purple-700 transition-all duration-300 
                     shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm sm:text-base"
                    >
                        Download CV <ArrowDown size={16} className="sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:border-amber-400">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
                    SKILLS & TECHNOLOGIES
                </h1>
                <p className="text-sm sm:text-md text-gray-600 dark:text-gray-300 text-justify leading-relaxed mb-6">
                    Many of these skills were first learned and practiced during our university
                    projects. However, as time has passed, some concepts have faded slightly due
                    to less frequent use, so I've been actively revisiting and refreshing them
                    through new practice and learning.
                </p>

                <div className="space-y-4">
                    {skillsData.map((skillGroup, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleCategory(index)}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 
                           flex justify-between items-center text-left font-semibold text-gray-900 dark:text-white 
                           transition-all duration-300 text-sm sm:text-base"
                            >
                                <span>{skillGroup.category}</span>
                                {expandedCategory === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            {expandedCategory === index && (
                                <div className="p-4 bg-white dark:bg-gray-800">
                                    <div className="flex flex-wrap gap-2">
                                        {skillGroup.technologies.map((skill, skillIndex) => (
                                            <span
                                                key={skillIndex}
                                                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 
                                   dark:from-gray-600 dark:to-gray-700 
                                   text-gray-800 dark:text-gray-200 font-medium text-xs sm:text-sm shadow-sm
                                   hover:scale-105 transition-transform duration-200"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-10 sm:mt-12 px-2 sm:px-4 md:px-6">
                    <div className="w-full max-w-4xl mx-auto">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
                            Browse Skills by Category
                        </h2>

                        <div className="relative bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 min-h-[14rem] md:h-64 flex flex-col justify-between">
                            <div className="text-center mb-3 sm:mb-4">
                                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
                                    {skillSets[currentSkillSet]?.title}
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center flex-1 items-center overflow-y-auto py-2">
                                {skillSets[currentSkillSet]?.skills?.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-green-100 to-teal-100 
                               dark:from-gray-600 dark:to-gray-700 
                               text-gray-800 dark:text-gray-200 font-medium text-xs sm:text-sm shadow-sm
                               whitespace-nowrap"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={prevSkillSet}
                                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 
                           bg-black/50 hover:bg-black/70 text-white 
                           rounded-full p-1 sm:p-2 transition-all duration-300
                           hidden sm:block"
                                aria-label="Previous skills"
                            >
                                <ChevronLeft size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            </button>

                            <button
                                onClick={nextSkillSet}
                                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 
                           bg-black/50 hover:bg-black/70 text-white 
                           rounded-full p-1 sm:p-2 transition-all duration-300
                           hidden sm:block"
                                aria-label="Next skills"
                            >
                                <ChevronRight size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            </button>

                            <div className="flex justify-center gap-3 sm:gap-4 sm:hidden mt-3">
                                <button
                                    onClick={prevSkillSet}
                                    className="p-2 bg-black/50 text-white rounded-full"
                                    aria-label="Previous skills"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={nextSkillSet}
                                    className="p-2 bg-black/50 text-white rounded-full"
                                    aria-label="Next skills"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            <div className="flex justify-center mt-3 sm:mt-4 space-x-2">
                                {skillSets.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSkillSet(idx)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSkillSet === idx
                                            ? 'bg-amber-500 scale-125'
                                            : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        aria-label={`Go to skill set ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:border-emerald-400">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
                        INTERNSHIPS
                    </h1>

                    <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                        infiniteLoop={true}
                        renderArrowPrev={(onClickHandler, hasPrev) =>
                            hasPrev && <CustomArrow direction="prev" onClick={onClickHandler} />
                        }
                        renderArrowNext={(onClickHandler, hasNext) =>
                            hasNext && <CustomArrow direction="next" onClick={onClickHandler} />
                        }
                    >
                        {internships.map((intern, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <img
                                    src={intern.image}
                                    alt={intern.company}
                                    className="w-full max-h-[300px] sm:max-h-[350px] md:max-h-[400px] object-contain rounded-t-2xl"
                                />
                                <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-b-2xl w-full">
                                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                                        {intern.role}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm sm:text-base">{intern.company}</p>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{intern.description}</p>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] hover:border-purple-400">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
                    CERTIFICATIONS
                </h3>

                <Carousel
                    showArrows={true}
                    showStatus={false}
                    showThumbs={false}
                    infiniteLoop={true}
                    renderArrowPrev={(onClickHandler, hasPrev) =>
                        hasPrev && <CustomArrow direction="prev" onClick={onClickHandler} />
                    }
                    renderArrowNext={(onClickHandler, hasNext) =>
                        hasNext && <CustomArrow direction="next" onClick={onClickHandler} />
                    }
                >
                    {certificates.map((cert, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                            <img
                                src={cert.image}
                                alt={cert.name}
                                className="w-full max-h-[300px] sm:max-h-[350px] md:max-h-[400px] object-contain rounded-t-2xl"
                            />
                            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-b-2xl w-full">
                                <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">{cert.name}</h4>
                                <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm sm:text-base">{cert.issuer}</p>
                                <div className="flex justify-center gap-2 sm:gap-3 mt-4">
                                    <a
                                        href={cert.pdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm shadow-md transition-colors"
                                    >
                                        View PDF
                                    </a>
                                    {cert.badgeLink && cert.badgeLink !== "#" && (
                                        <a
                                            href={cert.badgeLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs sm:text-sm shadow-md transition-colors"
                                        >
                                            View Badge
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}
