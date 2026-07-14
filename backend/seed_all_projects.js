import mongoose from 'mongoose'
import Project from './models/Project.js'
import dotenv from 'dotenv'
dotenv.config()

await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio')

await Project.deleteMany()
const projects = [
    {
        _id: "fake_smartledger",
        title: "SmartLedger – UI design",
        description: "Designed and developed a comprehensive manufacturing and financial dashboard UI with modern design system. Implemented responsive layouts, interactive Chart.js visualizations, dark/light mode theming, and mobile-first sidebar navigation. Features multiple dashboard views for manufacturing, payments, taxes, and AI copilot with consistent design patterns.",
        image: "https://u.today/sites/default/files/styles/736x/public/2024-01/s1348.jpg",
        github: "https://github.com/samzayoff/smartledgerUI.git",
        live: "https://smartledger-ui.vercel.app/",
        technologies: ["React native", "Tailwind CSS", "JavaScript", "UI/UX Design", "firebase"],
        category: ["react native"],
        featured: true
    },
    {
        _id: "69f70fb5760bd47519fdae29",
        title: "Personal Portfolio",
        description: "It is my personal portfolio. Built with React and Tailwind CSS. Responsive on all device sizes with dynamic state-driven navigation and theme transitions.",
        image: "https://res.cloudinary.com/djol393ox/image/upload/v1777799075/Clipped_image_20260429_122707_scpxki.png",
        github: "https://github.com/samzayoff/Portfolio",
        live: "https://sameerkhan-drab.vercel.app/#/projects",
        technologies: ["React", "NodeJS", "ReactJS", "MongoDB"],
        category: ["react"],
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
    }
]

await Project.insertMany(projects)
console.log(`✅ Seeded ${projects.length} projects`)
await mongoose.disconnect()
