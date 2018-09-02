export const RESPONSE_MESSAGES = {
    MISSING_FIELDS: 'Required fields missing',
    SERVER_ERROR: 'Something went wrong ..!',
    INVALID_API_KEY: 'Invalid api key ..!',
    INVALID_REQUEST: 'Invalid request ..!',
    NO_MATCH: 'No match found ..!',
    DEFAULT_SUCCESS_MESSAGE: 'Action successful'
};

export const STATUS_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORISED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

export const ACTIONS = {
    ADD: 'add',
    EDIT: 'edit',
    DELETE: 'delete',
    FETCH: 'fetch'
};

export const AUTH_TYPES = {
    LOCAL: 'local',
    GOOGLE: 'google',
    FACEBOOK: 'facebook'
};

export const DEFAULT_LIMIT = 10;

export const DEFAULT_SKIP = 0;