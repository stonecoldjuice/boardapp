var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = require('../models/Post');

router.get('/', function(req, res) {
    Post.find({}).populate("author").sort('-createdAt').exec(function(err, posts) {
        if (err) {
            return res.json({success: false, message: err});
        }
        res.render("posts/index", {data: posts, user: req.user});
    });
});
router.get('/new', isLoggedIn, function(req, res) {
    res.render("posts/new", {user: req.user});
});
router.post('/', isLoggedIn, function(req, res) {
    req.body.post.author = req.user._id;
    Post.create(req.body.post, function(err, post) {
        if (err) {
            return res.json({success: false, message: err});
        }
        res.redirect('/posts');
    })
})
router.get('/:id', function(req, res) {
    Post.findById(req.params.id).populate("author").exec(function(err, post) {
        if (err) {
            res.json({success: false, message: err});
        }
        res.render("posts/show", {data: post, user: req.user});
    });
});
router.get('/:id/edit', function(req, res) {
    Post.findById(req.params.id, function(err, post) {
        if (err) {
            return res.json({success: false, message: err});
        }
        if (!req.user._id.equals(post.author)) {
            return res.json({success: false, message: "Unauthorized Attempt"});
        }
        res.render("posts/edit", {data: post, user: req.user});
    })
})
router.put('/:id', function(req, res) {
    req.body.post.updatedAt=Date.now();
    Post.findById(req.params.id, function(err, post) {
        if (err) {
            return res.json({success: false, message: err});
        }
        if (!req.user._id.equals(post.author)) {
            return res.json({success: false, message: "Unauthorized Attempt"});
        }
        Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post) {
            if (err) {
                return res.json({success: false, message: err});
            }
            res.redirect('/posts/' + req.params.id);
        });
    });
});
router.delete('/posts/:id', function(req, res) {
    Post.findById(req.params.id, function(err, post) {
        if (err) {
            return res.json({success: false, message: err});
        }
        if (!req.user._id.equals(post.author)) {
            return res.json({success: false, message: "Unauthorized Attempt"});
        }
        Post.findByIdAndRemove(req.params.id, function(err, post) {
            if (err) {
                return res.json({success: false, message: err});
            }
            res.redirect('/posts');
        });
    })
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/posts');
}


module.exports = router;