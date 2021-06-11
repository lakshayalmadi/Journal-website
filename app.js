const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');


const homeStartingContent = "This website is to post about your ideas or how your day went. You can add your name to the post or even leave it for it to be anonymous. Click on compose to add your post and to know more about me check out the about section.";
const aboutContent = "Hello, I am Lakshay Almadi. A pre-final year student at Vellore Institute of Technology. I am a machine learning enthusiast and a web developer currently open to work. You can check out my github in the bottom link or reach out to me through mail.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-lakshay:Test12@cluster0.wbkxf.mongodb.net/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  author: String,
  content: String
};

const Post = mongoose.model('Post', postSchema)

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    if(err){
      console.log(err);
    }else{
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    }
  })
  
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    author: req.body.postAuthor,
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect('/');
    }
  });

});

app.get("/posts/:postID", function(req, res){
  const requestedPostId = req.params.postID;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      author: post.author,
      content: post.content
    });
  })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
