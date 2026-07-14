import mongoose from 'mongoose'

const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: String,
    category: String,
    level: Number
})

export default mongoose.model('Skill', SkillSchema)
