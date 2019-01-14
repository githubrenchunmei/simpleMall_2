const jwt = require('jsonwebtoken');
const config = require('../config/config');
const {responseClient} = require('../util/index');

exports.tokenValidate = (req, res, next) => {
    const url = req.originalUrl;
    const token = req.query.token;
    console.log(token);
    if (token) {
        //判断token是有效
        try {
            console.log(config.secret);
            const decoded = jwt.verify(token, config.secret);
        } catch (err) {
            responseClient(res, 201, '解析token出错', err);
            next();
        }
    } else if (url.indexOf('login') > 0 || url.indexOf('register') > 0) {
    } else {
        responseClient(res, 201, '无token');
    }
    next();
};