/*
    业务模块
*/
const data = require('./data.json');
const path = require('path');
const fs = require('fs');
const db = require('./db');

//自动生成图书编号（自增）
let maxBookCode = () => {
    let arr = [];
    data.forEach((item) => {
        arr.push(item.id);
    });
    return Math.max.apply(null, arr);
}

//把内存中的数据写入文件中
let writeDataToFile = (res) => {
    fs.writeFile(path.join(__dirname,'data.json'),JSON.stringify(data,null,4),(err) =>{
        if (err) {
            res.send('server error');
        }
        //文件写入成功之后重新跳转到主页面
        res.redirect('/');
    })
}

//渲染主页面
exports.showIndex = (req, res) => {
    let sql = 'select * from book';
    db.base(sql, null, (result) => {
        res.render('index', {list: result});
    })

}

//跳转到添加图书的页面
exports.toAddBook = (req, res) => {
    res.render('addBook', {});
}

//添加图书，保存数据
exports.addBook = (req, res) => {
    //获取表单数据
    let info = req.body;
    let book = {};
    for (let key in info) {
        book[key] = info[key];
    }

    let sql = 'insert into book set ?';

    db.base(sql, book, (result) => {
        if (result.affectedRows == 1) {
            res.redirect('/');
        }
    })

}

//跳转编辑页面
exports.toEditBook = (req, res) => {
    let id = req.query.id;
    // let book = null;
    // data.forEach((item)=> {
    //     if (id == item.id) {
    //         book = item;
    //         return;
    //     }
    // });
    let sql = 'select * from book where id =?';
    let data = [id];
    db.base(sql, data, (result) => {
        res.render('editBook', result[0]);
    })
}

//编辑图书，更新数据
exports.editBook = (req, res) => {
    let info = req.body;
    // data.forEach((item)=>{
    //     if(info.id == item.id) {
    //         for (let key in info) {
    //             item[key] = info[key]
    //         }
    //         return;
    //     }
    // });
    let sql = 'update book set name=?,author=?,category=?,description=? where id=?';
    let data = [info.name,info.author,info.category,info.description,info.id];
    db.base(sql,data,(result)=>{
        if (result.affectedRows == 1) {
            res.redirect('/');
        }
    })
}

//删除图书信息
exports.deleteBook = (req,res) =>{
    let id = req.query.id;
    let sql = 'delete from book where id = ?';
    let data = [id];
    db.base(sql,data,(result)=>{
        if (result.affectedRows == 1) {
            res.redirect('/');
        }
     })
}