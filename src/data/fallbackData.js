// Static fallback dataset to load when Live API is offline or blocked by ISP/adblockers

import fakeNewsImg from "../assets/fake_news_detector.png";
import pmsImg from "../assets/PMS.png";
import portfolioImg from "../assets/porfolio.png";
import tutorZoneImg from "../assets/tutorzone.png";
import breastCancerImg from "../assets/breastCancer.png";
import phishGuardImg from "../assets/phishGuard.png";
import fireFighterImg from "../assets/fireFighter.png";
import certJsImg from "../assets/javascript.png";
import certNetImg from "../assets/networking.png";
import certPyImg from "../assets/phyton.png";
import certCssImg from "../assets/CSS.png";

export const fallbackProjects = [
    {
        _id: "fake_news_detector",
        title: "Fake News Detector",
        description: "A machine learning-driven web application for veracity analysis, assessing the truthfulness of statements based on source reputation, speaker history, and semantic context analysis.",
        image: fakeNewsImg,
        github: "https://github.com/waliullah-8879/truth-detector.git",
        live: "https://www.linkedin.com/posts/wali-ullah-476747377_python-react-nlp-activity-7478650985712824320-dpTG?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAF0xOdoBiWLZLGG4efDcvV_3zS2CwDFwAyE",
        technologies: ["Python", "Flask", "React", "Tailwind CSS", "Docker", "Machine Learning"],
        category: ["react"],
        featured: true
    },
    {
        _id: "TutorZone",
        title: "TutorZone – UI design",
        description: " design and developed a smart mobile application for connecting students with subject specific tuors using live location and real chatting",
        image: tutorZoneImg,
        live: "https://play.google.com/store/apps/details?id=com.tutorzone.app",
        technologies: ["React native", "Tailwind CSS", "JavaScript", "UI/UX Design", "firebase", "appwrite", "react native map"],
        category: ["react native"],
        featured: false
    },
    {
        _id: "69f70fb5760bd47519fdae29",
        title: "Personal Portfolio",
        description: "It is my personal portfolio. Built with React and Tailwind CSS. Responsive on all device sizes with dynamic state-driven navigation and theme transitions.",
        image: portfolioImg,
        github: "https://github.com/waliullah-8879/Portfolio",
        live: "https://portfolio-waliullah.vercel.app",
        technologies: ["React", "NodeJS", "ReactJS", "MongoDB"],
        category: ["react"],
        featured: false
    },
    {
        _id: "prisoner_management_system",
        title: "Prisoner Management System",
        description: "A comprehensive web application for managing prisoner records, cell allocations, release schedules, and staff assignments. Streamlines jail administration through a structured database-driven interface.",
        image: pmsImg,
        github: "https://github.com/waliullah-8879/Prisoner-Management-System",
        live: "https://lnkd.in/p/dQYmTwp5",
        technologies: ["javascript", "MySQL", "HTML5", "CSS3", "Bootstrap", "JavaScript"],
        category: ["management"],
        featured: false
    },
    {
        _id: "breast_ai_app",
        title: "Breast AI App",
        description: "A React Native mobile application for breast cancer detection with personalized stage-based diet plan recommendations powered by AI.",
        image: breastCancerImg,
        github: "",
        live: "",
        technologies: ["React Native", "Python", "Machine Learning", "Firebase", "JavaScript"],
        category: ["react native"],
        featured: false
    },
    {
        _id: "phish_guard",
        title: "PhishGuard – Spam Email Detector",
        description: "A React Native mobile application for AI-powered spam email detection with real-time email classification and threat identification.",
        image: phishGuardImg,
        github: "",
        live: "",
        technologies: ["React Native", "Python", "Machine Learning", "NLP", "JavaScript"],
        category: ["react native"],
        featured: false
    },
    {
        _id: "fire_fighting_robot",
        title: "Fire Fighting Robot",
        description: "An Arduino Uno-based autonomous robot equipped with IR flame sensors, servo control, and a water pump to detect and extinguish fires in real time.",
        image: fireFighterImg,
        github: "",
        live: "https://lnkd.in/p/dqKviT89",
        technologies: ["Arduino", "C++", "IR Sensors", "Servo Motor", "Embedded Systems"],
        category: ["robotics"],
        featured: false
    },
    {
        _id: "69ccf92c2aa721941e525f04",
        title: "Cavdar Multibrand Store",
        description: "Modern E-Commerce platform with landing view, client routing, filtering, search, cart management, and localStorage caching.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        live: "https://cavdar-store.vercel.app/",
        technologies: ["JavaScript", "Bootstrap", "HTML5", "CSS3", "LocalStorage API"],
        category: ["javascript"],
        featured: false
    },
    {
        _id: "69ccf92c2aa721941e525f05",
        title: "Aims Collection, E-Commerce Website",
        description: "Web storefront featuring seamless responsive product catalogs, details modal, cart checkout, and SVG transitions.",
        image: "https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?cs=srgb&dl=pexels-pixabay-325876.jpg&fm=jpg",
        live: "https://aims-collection.vercel.app/",
        technologies: ["JavaScript", "Bootstrap", "ReactJS", "Tailwind CSS"],
        category: ["react"],
        featured: false
    },
    {
        _id: "69ccf92c2aa721941e525f02",
        title: "Fake Store – React + Axios",
        description: "Developed a responsive e-commerce web app using React and Axios that fetches real product data from a public API.",
        image: "https://tse4.mm.bing.net/th/id/OIP.DfXj70PID4YvRZAjXCr4RgHaEK?pid=Api&P=0&h=220",
        live: "https://fake-store-using-apis-axios.vercel.app",
        technologies: ["React", "Axios", "JavaScript", "Tailwind CSS", "Context API"],
        category: ["react"],
        featured: false
    },
    {
        _id: "69ccf92c2aa721941e525ee8",
        title: "Initial SignIn Android View",
        description: "Designed a clean mobile application login landing page mockup layout using raw XML components.",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        live: "https://protected-routes-three.vercel.app/",
        technologies: ["Kotlin", "Android SDK", "XML Layouts"],
        category: ["android"],
        featured: false
    },
];

export const fallbackSkills = [
    { name: "Frontend Development", items: ["HTML5", "CSS3", "JavaScript (ES6+)", "React.js", "React Native", "Tailwind CSS", "Bootstrap", "Framer Motion"] },
    { name: "Backend & Databases", items: ["Node.js", "Express.js", "MongoDB", "MySQL", "PHP", "RESTful APIs", "firebase"] },
    { name: "Tools & Technologies", items: ["Git", "GitHub", "Vite", "npm", "Postman", "Figma"] }
];

export const fallbackCertificates = [
    {
        name: "JavaScript Essentials 1",
        issuer: "Cisco Networking Academy",
        image: certJsImg,
        pdf: "https://drive.google.com/file/d/18YsDsPpeZuiAcZ1quVP7dEpiCDdaS92d/view?usp=drive_link",
        badgeLink: "https://drive.google.com/file/d/18YsDsPpeZuiAcZ1quVP7dEpiCDdaS92d/view?usp=drive_link"
    },
    {
        name: "Networking Essentials",
        issuer: "Cisco Networking Academy",
        image: certNetImg,
        pdf: "https://drive.google.com/file/d/1D3rDN8umfPODbLOwKtiFfi8cclFJODgn/view?usp=drive_link",
        badgeLink: "https://drive.google.com/file/d/1D3rDN8umfPODbLOwKtiFfi8cclFJODgn/view?usp=drive_link"
    },
    {
        name: "Data Science Essentials with Python",
        issuer: "Cisco Networking Academy",
        image: certPyImg,
        pdf: "https://drive.google.com/file/d/15ds_7m2_COfnFO_iBvC0QVuyAn4c3w1A/view?usp=drive_link",
        badgeLink: "https://drive.google.com/file/d/15ds_7m2_COfnFO_iBvC0QVuyAn4c3w1A/view?usp=drive_link"
    },
    {
        name: "CSS Essentials",
        issuer: "Cisco Networking Academy",
        image: certCssImg,
        pdf: "https://drive.google.com/file/d/137eZ1Olpx7jjX1s3nsbvkXlFJQUkz_9k/view?usp=drive_link",
        badgeLink: "https://drive.google.com/file/d/137eZ1Olpx7jjX1s3nsbvkXlFJQUkz_9k/view?usp=drive_link"
    }
];


export const fallbackOverview = {
    name: "Waliullah",
    title: "Junior Software Engineer | Mobile App Developer",
    cvUrl: "https://drive.google.com/file/d/1RP-SsXp2eppaf591JhBcen6NSilZIQWn/view?usp=drive_link",
    aboutMe1: "I am currently completing my Bachelor's in Computer Science at City University of Science and Information Technology, Peshawar, while simultaneously advancing my expertise in completing of multiple real projects",
    aboutMe2: "I specialize in creating modern, scalable web applications and mobile applications that prioritize performance, responsiveness, and exceptional user experiences.",
    toolsUsed: ["HTML/CSS", "Figma", "Bootstrap", "JavaScript", "React", "Tailwind", "Github", "PHP", "Python", "MySQL", "Node.js"]
};

export const fallbackInternships = [];
