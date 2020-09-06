const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: null
    },
    deleted_at: {
        type: Date,
        default: null
    },
    _rol: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rol' }],
    _permisos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permit' }]
});

module.exports = mongoose.model('User', userSchema);