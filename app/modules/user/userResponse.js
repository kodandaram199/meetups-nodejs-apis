import jwt from 'jsonwebtoken';
import { SECRET } from "../../../config";
import { generateToken } from "../../../utils";
const userResponse = (response, includeToken=false) => {
    const modifiedResponse = {};

    Object.entries(response).forEach(
        ([key, value]) => {
            if(
                key !== 'password' &&
                key !== 'updatedAt' &&
                key !== 'createdAt' &&
                key !== '__v'
            ){
                modifiedResponse[key] = response[key];
            }
        }
    );
    if(includeToken){
        const token = generateToken(response._id);
        modifiedResponse['token'] = token;
    }
    return modifiedResponse;
};

export default userResponse;