const mysql = require("mysql");

let options = {
  host: "localhost",
  user: "root",
  password: "admin",
  database: "book",
};
// 创建与数据库的连接对象
let con = mysql.createConnection(options);

// 建立连接
con.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("数据库连接成功");
  }
});
function sqlQuery(strSql, arr) {
  return new Promise(function (resolve, reject) {
    con.query(strSql, arr, (err, results) => {
      console.log(err);
      console.log(results);
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function getBookList(page) {
  let strSql = "select * from book limit ?,4";
  let offsetIndex = (page - 1) * 4;
  let result = await sqlQuery(strSql, [offsetIndex]);
  console.log(result);
}

getBookList(1)