const express = require('express');
const router = express.Router();//创建路由对象

//引入handler
const handler = require('../router-handler/user')
//2.1. 验证规则中间件
const expressJoi = require('@escook/express-joi')
//2.2. 需要验证规则对象
const {login_schema,register_schema} = require('../schema/user')

//注册
router.post('/registered',expressJoi(register_schema),handler.regUser); 

//登录
router.post('/login',expressJoi(login_schema),handler.loginUser);

//用户是否存在
router.post('/userExist',handler.userExist);


//测试

module.exports = router;