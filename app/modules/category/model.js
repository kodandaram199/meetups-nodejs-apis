import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images : [{
        dimension: {
            type: String
        },
        url: {
            type: String
        }
    }],
    status: {
        type: String,
        enum: [ 'a', 'r' ], //a - active, r - archive
        default: 'a',
    }
}, {timestamps: true});

const Category = mongoose.model('Category', CategorySchema);

export default Category;
