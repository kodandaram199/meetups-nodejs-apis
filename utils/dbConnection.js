import mongoose from 'mongoose';
import { MONGO } from "../config";

export const connectToDatabase = () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(MONGO.URI, {useMongoClient: true});
    mongoose.connection
        .once('open', () => log.info('Connected to db successfully'))
        .on('error', (error) => log.error('Database connection failed', error))
};
