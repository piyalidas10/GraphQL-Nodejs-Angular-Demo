const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

const auth = ({req}) => {
    const {authorization} = req.headers // extract authorization key value from request headers
    if(authorization) {
        const {userId} = jwt.verify(authorization, JWT_SECRET) // decrypt token to get userId
        return {userId}
    }
}

module.exports = {auth}