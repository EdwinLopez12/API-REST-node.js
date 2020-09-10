const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
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
    permits: [
        {
            name: {
                type: String,
                required: true,
                max: 255, 
                min: 1
            },
            actions: [
                {
                    type: String,
                    required: true,
                    max: 4,
                    min: 1
                }
            ]
        }
    ],
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

module.exports = mongoose.model('Role', roleSchema);