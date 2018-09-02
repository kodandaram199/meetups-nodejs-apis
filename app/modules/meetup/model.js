import mongoose, { Schema } from 'mongoose';
import Group from "../group/model";

const MeetUpSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date
    },
    eventTime: {
        type: Date
    },
    location: {
        latitude: Number,
        longitude: Number,
        place: String
    },
    categoryId : {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategoryId : {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }
}, {timestamps: true});

const MeetUp = mongoose.model('MeetUp', MeetUpSchema);

export default MeetUp;
