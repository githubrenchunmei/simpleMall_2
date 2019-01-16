const jwt = require('jsonwebtoken');
const config = require('../config/config');
const {responseClient} = require('../util/index');

exports.tokenValidate = (req, res, next) => {
    try {
        const url = req.originalUrl;
        const token = req.query.token;
        console.log(req.session.id);
        if (token) {
            //判断token是有效
            try {
                const {userName, exp} = jwt.verify(token, config.secret);
                if (exp > Math.floor(Date.now() / 1000)) {
                    //token未过期
                    next();
                    // if (req.session.userName && req.session.userName === userName) {
                    //     next();
                    // } else {
                    //     req.session.userName = userName;
                    //     next();
                    // }
                } else {
                    //token过期
                    responseClient(res, 201, 'token 已过期', err);
                    next();
                }
            } catch (err) {
                responseClient(res, 201, '解析token出错', err);
                next();
            }
        } else if (url.indexOf('login') > 0 || url.indexOf('register') > 0) {
            next();
        } else {
            responseClient(res, 201, '无token');
            next();
        }
    } catch(err) {
        responseClient(res, 201, '无token');
        next();
    }
};