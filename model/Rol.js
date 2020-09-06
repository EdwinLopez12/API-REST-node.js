const mongoose = require('module');

const rolSchema = new mongoose.Schema({
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
    description: {
        type: String,
        required: true,
        max: 255,
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
    _permisos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permit' }]
});

module.exports = mongoose.model('Rol', rolSchema);