import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    technologies: [String],
    category: [String],
    github: String,
    live: String,
    image: String,
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Project', ProjectSchema)
