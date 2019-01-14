const UserModel = require('../model/user.model');
const { responseClient } = require('../util/index');

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
               console.log(1);
               responseClient(res);
               next();
           });
           
           console.log(registerInfo);
           if (registerInfo) {
               console.log(2);
               responseClient(res, 201, '该用户名已经存在');
               next();
           } else {
            console.log(3);
               let newUser = new UserModel({
                userName: userName,
                passWord: passWord,
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
    console.log(err);
    responseClient(res, 201, '服务器内部错误', err);
   }
};
