//导入数据库
const db = require('../database')

//加密密码
const bcrypt = require('bcryptjs');
//生成token
const jwt = require('jsonwebtoken');
//导入全局配置文件
const config = require('../config')

//注册
exports.regUser = (req, res) => {
  console.log(req.body);
  let { username, password, id, admin } = req.body;
  // 首先进行表达验证
  // 前面已经校验成功
  // 1. 首先检查是否有用户
  const sql = 'select * from users where username=?'
  db.query(sql, username, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    //判断用户名是否占用
    if (results.length > 0) {
      return res.cc('用户名被占用!')
      // return res.send({
      //   status:1,
      //   message:'用户名被占用!'
      // })
    }
    //TODO 用户名可用
    password = bcrypt.hashSync(password, 10);
    const sqlInsert = 'insert into users set ?'
    //执行sql
    db.query(sqlInsert, { username, password, id, admin }, (err, results) => {
      if (err) {
        console.log(err);
        return res.cc(err)
      }
      if (results.affectedRows !== 1) {
        // return res.send({
        //   status:1,
        //   message:'注册失败!'
        // })
        return res.cc('注册失败!')
      }
      // res.send({
      //   status:0,
      //   message:'注册成功!'
      // })
      res.cc('注册成功', 0, 200);
    })
  })
}

//登录用户
exports.loginUser = (req, res) => {
  console.log(req.body);
  let { password, username } = req.body;
  const sql = 'select * from users where username=?';
  db.query(sql, username, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length !== 1) {
      return results.length === 0 ? res.cc('该用户未注册!') : res.cc('重复的用户!')
    }
    //TODO 密码是否正确
    const isPass = bcrypt.compareSync(password, results[0].password);
    if (!isPass) return res.cc('密码错误!')
    // TODE 在服务器端生成 Token 字符串
    const user = {
      ...results[0],
      password: '',
    }
    console.log(user);
    // TODO 对用户信息进行加密,并且生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      //有效期
      expiresIn: config.timeOfDuration
    })
    // TODO 响应给客户端
    res.send({
      status: 0,
      msg: '登录成功',
      code: 200,
      token: 'Bearer ' + tokenStr
    })
  })

}

//用户是否存在
exports.userExist = (req, res) => {
  const { body: { username } } = req;
  if (username === null) return res.cc('用户名不能为空!', 0);
  const sql = 'select * from users where username=?';
  db.query(sql, username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) res.cc('用户不存在!', 0, 200)
    if (results.length === 1) res.cc('用户存在!', 1, 200)
  })
}
