const crypto = require('crypto');

exports.responseClient = (res, code = 201, message = '服务器内部错误', data = {}) => {
    const responseData = {
        code,
        message,
        data
    }
    return res.json(responseData);
};
exports.md5 = (pwd) => {
    let md5 = crypto.createHash('md5');
    return md5.update(pwd).digest('hex');
};