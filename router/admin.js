const express = require('express');
const router = express.Router();
const handler = require('../router-handler/admin')


//获取用户列表
router.get('/getUserList',handler.getUserList);
router.get('/getAdminList',handler.getAdminList)

//使用
module.exports = router;