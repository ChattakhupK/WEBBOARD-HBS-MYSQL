const express = require('express');
const dayjs = require('dayjs');
const db = require('../db');

const router =  express.Router();


router.get('/', async (request, response) => {
    let allPosts = [];
    try {
        allPosts = await db
            .select('post.id', 'post.title', 'post.from', 'post.createdAt')
            .count('comment.id as commentsCount')
            .from('post')
            .leftJoin('comment', 'post.id', 'comment.postid')
            .groupBy('post.id')
            .orderBy('post.id', 'desc');
        allPosts = allPosts.map(post => {
            const createdAtText = dayjs(post.createdAt).format('DD MMM YYYY - HH:mm')
            return {...post, createdAtText};
        })
    }
    catch (err) {
        console.error(err);
    }
    response.render('home', { allPosts })
})

module.exports = router;