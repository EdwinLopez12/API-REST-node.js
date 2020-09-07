const mongoose = require('mongoose')

const permitSchema = new mongoose.Schema({
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
    actions: [
        { 
            type: String, 
            required: true,
            max: 1,
            min:1
        }
    ],
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
    }
});

module.exports = mongoose.model('Permit', permitSchema);