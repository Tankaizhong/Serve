const db = require('../database');

//获取用户列表
exports.getUserList = (req, res) => {
  const sql = 'select * from users where admin=0'
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    console.log(results);
    res.send({
      code: 200,
      status: 0,
      data: results,
      msg: '获取用户列表成功!'
    })
  })
}
exports.getAdminList = (req, res) => {
  const sql = 'select * from users where admin=1'
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    console.log(results);
    res.send({
      code: 200,
      status: 0,
      data: results,
      msg: '获取管理员列表成功!'
    })
  })
}