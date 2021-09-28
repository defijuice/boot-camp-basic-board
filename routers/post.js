var express = require('express');
const post_info = require("../schemas/post_info");//스키마폴더에 있는 DB 관련 제이슨 파일
var router = express.Router();

//예시
router.get("/post", async (req, res, next) => {
  try {
    const { category } = req.query;
    const post = await post_info.sort("-postDate"); //find 앞에는 어떤 api를 통해 찾아올지임으로 2번째줄
    res.json({ post: post }); //맨 앞 post는 제이슨 파일 출력시 제목
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/post/:postID", async (req, res) => {
  const { postID } = req.params;
  post = await post_info.findOne({ postID: postID });
  res.json({ detail: post });
});



//게시물 작성 API
router.post('/post', async (req, res) => {
  try{
  const { postID, postTitle, postContent, postWriter, postDate, postPassword} = req.body;
  

  Post.create({
    postID,
    postTitle,
    postContent,
    postWriter,
    postDate,
    postPassword,
  });
  res.send({ result: "success" });
} catch (error) {
  // 실패할 경우,
  res.send({
    result: 'fail',
    message: '컨텐츠를 추가하는데 문제가 발생했습니다.',
    error: error,
  });
  }
});

//삭제
router.delete('/post/delete/:postID', async (req, res) => {
  try {
    const { postID } = req.params;
    const { postPassword } = req.body;
    console.log("postPassword: ", postPassword);
    const detailPost = await post_info.find({ postID: postID }, { _id: false });
    // DB에 저장된 비밀번호와 일치하지 않은 경우
    if (detailPost[0].postPassword != postPassword) {
      res.send({ msg: '비밀번호가 일치하지 않습니다.', result: false });
      return;
    }
    await post_info.deleteOne({ postID: postID });
    res.send({ msg: '해당 게시글의 삭제를 완료하였습니다.', result: true });
  } catch (error) {
    console.log(error);
  }
});


//수정
router.put('/modify/:postID', async (req, res) => {
  console.log("333333333333333333")
  try {
    const { postID } = req.params;
    const { postTitle, postContent, postPassword } = req.body;
    const detailPost = await post_info.find({ postID: postID }, { _id: false });

    // DB에 저장된 비밀번호와 일치하지 않은 경우
    if (detailPost[0].postPassword != postPassword) {
      console.log("444444444444444444")

      res.send({ msg: '비밀번호가 일치하지 않습니다.', result: false });
      return;
    }

    await post_info.updateOne(
      { postID: postID },
      { $set: { postTitle: postTitle, postContent: postContent } }
    );
    res.send({ msg: '해당 게시글의 수정을 완료하였습니다.', result: true });
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;

//삭제
// router.delete("/post/:postID/delete", async(req, res) => {
//   const {postID} =req.params;

//   const isGoodsInCart = await post_info.find({postID});
//   if (isGoodsInCart.postID || isGoodsInCart.postTitle || isGoodsInCart.postContent == 0){
//     await Cart.deleteOne({postID});
//   }

//   res.send({result: "success"});
// })



// const { Schema } = mongoose;
// const postSchema = new Schema({
//   postID: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   postTitle: {
//     type: String,
//     required: true,
//     unique: false,
//   },
//   postContent: {
//     type: String,
//     required: true,
//   },
//   postWriter: {
//     type: String,
//     required: true,
//     unique: false,
//   },
//   postDate: {
//     type: String,
//     required: true,
//   },
//   postPassword: {
//     type: String,
//     required: true,
//   },
// });