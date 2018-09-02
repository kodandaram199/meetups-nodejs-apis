import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    authType: {
        type: 'String',
        enum: ['local', 'google', 'facebook']
    },
    firstName: {
        type: String,
        //required: true
    },
    lastName: {
        type: String,
        //required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String
    },
    googleId: {
        type: String,
    },
    facebookId: {
        type: String,
    },
    githubId: {
        type: String
    },
    isAdmin: {
        type: Boolean
    }
}, {timestamps: true});

UserSchema.methods.isValidPassword = async function(newPassword, oldPassword) {
    try {
        const isMatch = await bcrypt.compare(newPassword, oldPassword);
        return isMatch;
    } catch(error) {
        throw new Error(error);
    }
};

UserSchema.pre('findOneAndUpdate', async function(next) {
    try {
        const user = this.getUpdate();
        if((!user.authType || user.authType) === 'local' && user.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
        next();
    } catch(error) {
        next(error);
    }
});

UserSchema.pre('save', async function(next) {
    try {
        console.log(this.authType === 'local', (this.isModified('password') || this.isNew));
        if((!this.authType || this.authType === 'local') && (this.isModified('password') || this.isNew)){
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch(error) {
        next(error);
    }
});

const modifyResponse = (result, next) => {
    try{
        delete result._doc.password;
        delete result._doc.__v;
        delete result._doc.updatedAt;
        delete result._doc.createdAt;
        next();
    }catch (e) {
        next(e);
    }
};

UserSchema.post('findOneAndUpdate', async function(result, next) {
    modifyResponse(result, next);
});

UserSchema.post('save', async function(result, next) {
    modifyResponse(result, next);
});

const User = mongoose.model('User', UserSchema);

export default User;
