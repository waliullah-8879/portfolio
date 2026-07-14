import mongoose from 'mongoose'

const OverviewSchema = new mongoose.Schema({
    bio: String,
    tagline: String,
    email: String,
    location: String,
    resumeUrl: String,
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String
    }
})

export default mongoose.model('Overview', OverviewSchema)
