import express from 'express';
import { Post } from '../models/post.js';
import { validateToken } from '../libs/jwt.js';

const router = express.Router();

router.get('/', async (req, res) => {
  res.render('index', { title: 'Home' });
});


router.get('/posts', validateToken, async (req, res) => {
  
    const posts = await Post.find();
  
    res.render('posts', { title: 'Posts', posts });
  });


router.get('/posts/:id', validateToken, async (req, res) => {

  const { id } = req.params;
  const post = await Post.findById(id);

  res.render('post', { title: post.title, post });
});


router.get('/new', validateToken, (req, res) => {

  res.render('new', { title: 'New Post' });
});


router.post('/new', async (req, res) => {

  const { title, content, image } = req.body;
  const post = new Post({ 
    title, 
    content, 
    image 
  });
  
  await post.save()
    .then(() => {res.redirect('/')
    })
    .catch((err) => {
      console.log(err);
    });
});


router.get('/delete/:id', async (req, res) => {

  const { id } = req.params;

  await Post.findByIdAndDelete(id);

  res.redirect('/');
});


router.get('/edit/:id', async (req, res) => {  
  const { id } = req.params;
  const post = await Post.findById(id);

  res.render('edit', { title: 'Edit Post', post });
});


router.post('/edit/:id', async (req, res) => {  
  const { id } = req.params;
  const { title, content, image } = req.body;

  await Post.findByIdAndUpdate(id, { title, content, image });

  res.redirect('/posts/' + id);
});


router.get('/logout', (req, res) => {
  res.clearCookie('auth-token').redirect('/login');
});


export default router;