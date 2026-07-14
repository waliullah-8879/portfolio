import mongoose from 'mongoose'

const CertificateSchema = new mongoose.Schema({
    title: String,
    issuer: String,
    date: String,
    image: String,
    link: String
})

export default mongoose.model('Certificate', CertificateSchema)
