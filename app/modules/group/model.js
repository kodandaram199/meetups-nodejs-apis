import mongoose, { Schema } from 'mongoose';

const GroupSchema = new Schema({
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
    categoryId : {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategoryId : {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    }
}, {timestamps: true});

const Group = mongoose.model('Group', GroupSchema);

export default Group;
