const UserModel = require('../model/user.model');
const { responseClient, md5 } = require('../util/index');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.register = async (req, res, next) => {
   try {
       let {userName, passWord, type = false} = req.body;
       if (!userName) {
        responseClient(res, 201, '用户名不能为空');
        next();
       } else if (!passWord) {
        responseClient(res, 201, '密码不能为空');
        next();
       } else {
           let registerInfo =await UserModel.findOne({userName}).catch(err => {
               responseClient(res);
               next();
           });
           
           console.log(registerInfo);
           if (registerInfo) {
               responseClient(res, 201, '该用户名已经存在');
               next();
           } else {
               let newUser = new UserModel({
                userName: userName,
                passWord: md5(passWord + config.MD5_SUFFIXSTR),
                type: type,
                description: '',
                order: ''
               });
               newUser.save().then(() => {
                UserModel.findOne({userName}).then(data => {
                    responseClient(res, 200, '注册新用户成功', data);
                    next();
                })
               });
           }
       }

   } catch (err) {
    responseClient(res, 201, '服务器内部错误', err);
    next();
   }
};
exports.login = async (req, res, next) => {
    try {
        let {userName, passWord} = req.body;
        if (!userName) {
            responseClient(res, 201, '用户名不能为空');
            next();
        } else if (!passWord) {
            responseClient(res, 201, '密码不能为空');
            next();
        } else {
            let userInfo = await UserModel.findOne({
                userName, 
                passWord: md5(passWord + config.MD5_SUFFIXSTR)
            });
            if (userInfo) {
                const token = jwt.sign({
                    userName,
                    passWord,
                    exp: Math.floor(Date.now() / 1000) + config.expires
                }, config.secret);
                req.session.userName = userName;
                responseClient(res, 200, '登录成功', {token});
                next();
            } else {
                responseClient(res, 201, '用户名或密码错误');
                next();
            }
        }
    } catch (err) {
        responseClient(res);
        next();
    }
};
exports.getUserInfo = (req, res, next) => {
    if (req.session.userName) {
        UserModel.findOne({userName: req.session.userName}).then((data) => {
            responseClient(res, 200, '查询成功', data);
            next();
        }).catch((err) => {
                responseClient(res, 201, '服务器内部错误', err);
                next();
            });
    } else {
        responseClient(res, 201, '当前session无用户信息');
        next();
    }
};
exports.logout = (req, res, next) => {
    try {
        req.session.userName = null;
        console.log('logout');
        console.log(req.session.userName);
        responseClient(res, 200, '退出登录成功');
        next();
    } catch (err) {
        responseClient(res, 201, '服务器内部错误', err);
        next();
    };
};
