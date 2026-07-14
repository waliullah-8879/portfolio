import mongoose from 'mongoose'

const InternshipSchema = new mongoose.Schema({
    company: String,
    role: String,
    startDate: String,
    endDate: String,
    description: String
})

export default mongoose.model('Internship', InternshipSchema)
