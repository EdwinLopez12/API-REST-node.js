const mongoose = require('mongoose');

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
    permits: [
        {
            _view: { type: mongoose.Schema.Types.ObjectId, ref: 'View' },
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

module.exports = mongoose.model('Rol', rolSchema);