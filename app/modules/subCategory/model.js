import mongoose, { Schema } from 'mongoose';

const SubCategorySchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId
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

const SubCategory = mongoose.model('SubCategory', SubCategorySchema);

export default SubCategory;
