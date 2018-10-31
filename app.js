const express = require('express')
const app = express()
// CORS模块，处理web端跨域问题
const cors = require('cors')
app.use(cors())

//body-parser 解析表单
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended:false}))
app.use(bodyParser.json())

//使用mysql中间件连接MySQL数据库
const mysql = require('mysql')
const connection = mysql.createConnection({
    host:'localhost',           //数据库地址
    user: 'root',               //用户名
    password: 'root',           //密码
    port : '3306',              //端口
    database: 'test',           //库名
    multipleStatements:true     //允许执行多条语句
})

// 查询
app.get('/api/user',(req,res,next) => {
    const sql ='SELECT * FROM user'  //user为表名
    connection.query(sql,(err,results) =>{
        if(err){
            return res.json({
                code: 1,
                message: '用户不存在',
                affextedRows: 0
            })
        }
        res.json ({
            code : 200,
            message: results,
            affextedRows:results.affextedRows
        })
    })
})

// 条件查询
app.get('/api/body',(req,res) => {
    const id = req.query.id
    const sql = 'SELECT * FROM user where id=?'
    connection.query(sql,id,(err,results) => {
        if (err) {
            return res.json({
                code: 1,
                message: '无此用户',
                affextedRows: 0
            })
        }
        res.json ({
            code: 200,
            message: results,
            affextedRows:results.affextedRows
        })
    })
})

//增加
app.post('/api/adduser', (req,res) => {
    const user = req.body
    const addSql = 'INSERT INTO user SET ?'
    connection.query(addSql,user,(err,results) => {
        if (err) {
            return res.json({
                code: 1,
                message: '添加失败',
                affextedRows: 0
            })
        }
        res.json ({
            code: 200,
            message: '添加成功',
            affextedRows:results.affextedRows
        })
    })
})

//修改
app.post('/api/updateuser',(req,res) => {
    const user = []
    user[0] = req.body.userName
    user[1] = req.body.passWord
    user[2] = req.body.id
    const updateSql = 'UPDATE user SET userName = ?,passWord = ? WHERE Id = ?'
    connection.query(updateSql,user,(err,results) => {
        if (err) {
            return res.json({
                code: 1,
                message: '修改失败',
                affextedRows: 0
            })
        }
        res.json ({
            code: 200,
            message: '修改成功',
            affextedRows:results.affextedRows
        })
    })
})

//启动服务，端口3001
app.listen(3001,() => {
    console.log('服务启动成功:'+`http://localhost:3001/`)
})