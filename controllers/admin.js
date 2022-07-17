const mongoose = require('mongoose');
const Blog = require('../models/blog');


module.exports.getBlogs = (req,res,next)=>{
    Blog.find()
        .then(blogs=>{
            res.render('admin/blogs',{
                title: "Bloglarım",
                path:'/adminblogs',
                blogs: blogs,
                action: req.query.action
            });
        })
        .catch(err=>console.log(err))
}

module.exports.getAddBlog = (req,res,next)=>{
    res.render('admin/add-blog', {
        title: "Blog Ekle",
        path:'/add-blog',
        input: {
            title:'',
            body:''
        },
    });
}

module.exports.getEditBlog = (req,res,next)=>{
    const urlExt = req.params.urlExt;

    Blog.findOne({urlExt: urlExt})
        .then(blog=>{
            res.render('admin/edit-blog',{
                title: "Düzenle",
                path:'/editblog',
                blog: blog
            });
        })
        .catch(err=>console.log(err))
}

module.exports.postAddBlog = (req,res,next)=>{
    const title = req.body.title;
    const readMin = req.body.readMin
    const body = req.body.editor;
    const urlExt = title.toLowerCase().replace(' ', "-");
   ;
    const blog = new Blog({
        _id: mongoose.Types.ObjectId(),
        title: title,
        readMin: readMin,
        body: body,
        urlExt:urlExt
    });
    blog.save()
        .then(()=>{
            res.redirect('/admin/blogs');
        })
        .catch(err=> console.log(err));
}

module.exports.postEditBlog = (req,res,next)=>{
    const urlExt = req.params.urlExt;
    const title = req.body.title;
    const readMin = req.body.readMin;
    const body = req.body.editor;
    const newurlExt = title.toLowerCase().replace(' ', "-");

    Blog.updateOne({urlExt: urlExt}, {
        $set: {
            title: title,
            readMin: readMin,
            body: body,
            urlExt:newurlExt
        }
    })
    .then(() => {
        res.redirect("/admin/blogs?action=updated");
    })
    .catch(err => {
        console.log(err);
    });
}

module.exports.postDeleteBlog = (req,res,next)=>{
    const blogid = req.body.blogid;

    Blog.deleteOne({_id: blogid})
        .then(result=>{
            res.redirect('/admin/blogs?action=deleted')
        })
        .catch(err=>console.log(err))
}
