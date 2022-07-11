//导入express
const express = require('express');
//创建服务器的实例对象
const app = express();

//导入cors
const cors = require('cors');
const joi = require('joi')
//解析 token 中间件
app.use(express.json())
//注册全局组件
app.use(cors());
//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }));
//配置解析格式为form-data格式的数据
const multiparty = require('multiparty');
//定义中间件,---代码优化, 一定要在 路由 之前封装
app.use(function (req, res, next) {
  res.cc = function (err, status = 1,code=400) {
    res.send({
      code,
      status,
      msg: err instanceof Error ? err.message : err
    })
  }
  next()
})

//一定要在路由之前,配置解析 Token 的中间件
const expressJWT = require('express-jwt');
const config = require('./config')
//注册
app.use(expressJWT({
  secret: config.jwtSecretKey
}).unless({
  //排除不需要解密token的接口,如路径为 api 开头的不需要解密
  path: [/^\/api/]
})
)


//导入和使用用户路由
const userRouter = require('./router/user')
app.use('/api', userRouter);

//导入和使用管理员中间件
const adminRouter = require('./router/admin')
app.use('/admin',adminRouter);

//错误的中间件
app.use(function (err, req, res, next) {
  //验证失败的错误
  if (err instanceof joi.ValidationError) return res.cc(err);
  // Token 认证错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！',1,401)
  //未知错误
  res.cc(err)
})

//启动
app.listen(3007, () => {
  console.log('API server running at http://localhost:3007');
})