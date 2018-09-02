import redis from 'redis';
import { promisify } from 'util';

import { REDIS } from "../config";

export const client = redis.createClient({
    host: REDIS.HOST,
    port: REDIS.PORT,
});

client.on('connect', () => {
    log.info(`Connected to redis successfully`);
});

client.on('error', error => {
    log.error('Redis connection failed', error);
});

export const getAsync = promisify(client.get).bind(client);
