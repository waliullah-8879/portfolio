import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }
})

UserSchema.pre('save', async function () {
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password)
}

export default mongoose.model('User', UserSchema)
