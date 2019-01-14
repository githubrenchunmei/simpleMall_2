exports.responseClient = (res, code = 202, message = '服务器内部错误', data = {}) => {
    const responseData = {
        code,
        message,
        data
    }
    return res.json(responseData);
};