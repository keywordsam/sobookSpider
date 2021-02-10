//b站 https://www.bilibili.com/video/BV1i7411G7kW?p=32
const axios = require("axios");
const cheerio = require("cheerio");
const mysql = require("mysql");

let page = 1;
let count = 1;


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

// 将延迟函数封装成promise对象
function timeWait(milliSecondes) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve("成功执行延迟函数，延迟:" + milliSecondes);
    }, milliSecondes);
  });
}

// 获取页面总数
async function getNum() {
let httpUrl = "https://sobooks.cc/page/1";
  res = await axios.get(httpUrl);
  let $ = cheerio.load(res.data);
  let allNum = $(".content .pagination li:last-child").text().slice(2, -2);
  return allNum;
}

async function spider() {
  // 获取所有的页面总数
  let allPageNum = await getNum();
  // console.log(allPageNum)
  for (let i = 1; i <= allPageNum.length; i++) {
    await timeWait(15000 * i); //i 是每个页面循环等待时间
    getPageUrl(i);
  }
}



// 获取第N个页面所有书籍的链接
async function getPageUrl(num) {
  let httpUrl = "https://sobooks.cc/page/" + num;
  console.log(httpUrl)
  let res = await axios.get(httpUrl);
  // 测试请求资源
  //  console.log( res.data)
  let $ = cheerio.load(res.data);
  $("#cardslist .card-item .thumb-img>a").each((i, ele) => {
    let href = $(ele).attr("href");
    console.log(i);
    timeWait(8000);
    console.log(href);
    // 根据地质访问书籍详情页面
    // getBookInfo(href);
  });
}


async function getBookInfo(href) {
  let res = await axios.get(href);
  let $ = cheerio.load(res.data);
  // 书籍图片
  let bookimg = $(".article-content .bookpic img ").attr("src");
  // 书籍名称
  let bookname = $(".article-content .bookinfo li:nth-child(1) ").text();
  bookname = bookname.substring(3, bookname.length);
  // 书籍作者
  let author = $(".article-content .bookinfo li:nth-child(2) ").text();
  author = author.substring(3, author.length);
  // 文件格式
  let formspecif = $(".article-content .bookinfo li:nth-child(3) ").text();
  formspecif = formspecif.substring(3, formspecif.length - 1);
  // 标签类型
  let tag = $(".article-content .bookinfo li:nth-child(4) ").text();
  tag = tag.substring(3, tag.length);
  // 时间
  let pubtime = $(".article-content .bookinfo li:nth-child(5) ").text();
  pubtime = pubtime.substring(3, pubtime.length);
  // 评分
  let score = $(".article-content .bookinfo li:nth-child(6) b").attr("class");
  score = score[score.length - 1];
  // 出版编码
  let pubcompany = $(".article-content .bookinfo li:nth-child(7) ").text();
  pubcompany = pubcompany.substring(5, pubcompany.length);
  // 分类
  let cataory = $("#mute-category > a").text().trim();
  // 详情
  let brief = $(".article-content").html();
  let bookUrl = href;
  // console.log(
  //   bookname,
  //   author,
  //   formspecif,
  //   tag,
  //   pubtime,
  //   score,
  //   pubcompany,
  //   cataory,
  //   brief,
  //   bookUrl
  // );
  let arr = [
    bookname,
    author,
    formspecif,
    tag,
    pubtime,
    score,
    pubcompany,
    bookimg,
    cataory,
    brief,
    bookUrl,
  ];
  let strSql =
    "insert into book (  bookname,author,formspecif,tag,pubtime,score,pubcompany,bookimg,cataory,brief,bookUrl) values(?,?,?,?,?,?,?,?,?,?,?)";
  console.log(arr);
  con.query(strSql, arr, (err, results) => {
    // console.log(err);
    // console.log(results);
  });
}



spider()
// getPageUrl(page);
// let tempBook = "https://sobooks.cc/books/17589.html";
// getBookInfo(tempBook);
