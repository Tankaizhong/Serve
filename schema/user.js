// 1. 为表中携带的数据线定义规则  
const joi = require('joi')

// 2. 定义用户名和密码的验证规则
const username = joi.string().required();
const password = joi.string().min(6).required();
const id = joi.string().required();
const admin = joi.number().required();

// 3. 定义验证登录表单数据的规则对象
exports.login_schema = {
  body: {
    username,
    password
  }
}
//4. 定义注册
exports.register_schema = {
  body: {
    id,
    admin,
    username,
    password
  }
}