const express = require('express');
const router = require('../router/index');
const bodyParser = require('body-parser');
const session = require('express-session');
const  MongoStore  = require("connect-mongo")(session);
const config = require('../config/config');

const app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: '12345',// 可以随便写。 一个 String 类型的字符串，作为服务器端生成 session 的签名
    resave: true,//强制保存 session 即使它并没有变化,。默认为 true。建议设置成 false。
    name: 'simple-mall',//保存在本地cookie的一个名字 默认connect.sid  可以不设置
    saveUninitialized: true,//强制将未初始化的 session 存储。  默认值是true  建议设置成true
    rolling: true,//在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
    cookie: { maxAge: config.expires * 1000 },//过期时间：单位ms
    store:new MongoStore({ 
        url: config.DB_URL, //数据库的地址 
        touchAfter: 24 * 3600 //time period in seconds  通过这样做，设置touchAfter:24 * 3600，您在24小时内只更新一次会话，不管有多少请求(除了在会话数据上更改某些内容的除外) 
    })
}));
app.use('/api', router);


module.exports = app;