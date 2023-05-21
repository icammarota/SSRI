const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
});

/**
 * Encrypts password if needed before every save.
 */
adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

/**
 * Generates a log in token [ 15 minutes ] for admin.
 */

adminSchema.methods.generateToken = async function () {
    return jwt.sign({ ID: this.ID }, process.env.JWT_KEY, { expiresIn: "1d" });
};

/**
 * Verifies the given token.
 */
adminSchema.statics.verifyToken = async ( token ) => {
    return jwt.verify(token, process.env.JWT_KEY);
}

module.exports = mongoose.model('Admins', adminSchema);