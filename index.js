const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const path = require('path');

const postRouter = require('./routers/post');
const post_info = require('./schemas/post_info');
const Post = require('./schemas/post_info');

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('public'));
app.use("/api", [postRouter]);




//라우터
//아래 2줄은 views 세팅 건드리지 말기
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//views 경로 지정
app.get('/post/:postID', async (req, res) => {
  const { postID } = req.params;
  const detailPost = await Post.find({ postID: postID }, { _id: false });
  res.render('detail_page', { detailPost });
});


// app.get('/main_page', (req, res) => {
//   let name = req.query.name; //name은 request 쿼리에서 name 값을 받아옴
//   res.render('main_page', {name});//res.send는 뭘 그릴지 바로 알려주는거고, res.render는 views로 가서 해당 파일 그려줌
// })

app.get('/main_page', async (req, res) => {
  console.log("111111111111DDDDDDDDDDDD")

  // 작성순으로 내림차순 정렬
  try {
    const post = await post_info.find({}).sort({ postID: -1 });
    res.render('main_page', { post });
  } catch (err) {
    console.log(err);
  }
});


app.get('/main_page', (req, res) => {
  console.log("DDDDDDDDDDDD")
  post_info.find((err, post) => {
    if (err) return res.status(500).send({ error: `database failuere` });
    //console.log(post);
    try {
      res.render('main_page', { post });
    } catch (error) {
      console.log(error);
      res.render('main_page');
    }
  })});
  app.get('/modify/:postID', async(req,res) => {
    console.log("CCCCCCCCCCCCCC")
    const {postID} = req.params;
    const detailPost = await post_info.find({postID: postID}, {_id: false});
    res.render('modify_page', {detailPost});
  })

    //이게 왜 없어도 바로 넘어가는 거지?
  app.get('/modify',(req,res) => {
    console.log("AAAAAAAAAAA")

    res.render('modify_page');
    console.log("BBBBBBBBBBBBB")

  });
  


app.get('/write_page', (req, res) => {
  let name = req.query.name; //name은 request 쿼리에서 name 값을 받아옴
  res.render('write_page', {name});//res.send는 뭘 그릴지 바로 알려주는거고, res.render는 views로 가서 해당 파일 그려줌
})

//스키마를 통해 몽고db 연결하는 문구2개
const connect = require('./schemas');
connect();


app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})