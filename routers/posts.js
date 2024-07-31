const express = require("express")
const dayjs = require('dayjs')
const db = require('../db')

const router = express.Router();

async function getPostAndComments(postid) {
    let onePost = null;
    let postComments = [];
    try {
        // Get one post
        const somePosts = await db
            .select('*')
            .from('post')
            .where('id', +postid);
        onePost = somePosts[0];
        onePost.createdAtText = dayjs(onePost.createdAt).format('DD MMM YYYY - HH:mm')
        
        // Get post comments
        postComments = await db
            .select('*')
            .from('comment')
            .where('postid', +postid);
            postComments = postComments.map(Comment => {
                const createdAtText = dayjs(Comment.createdAt).format('DD MMM YYYY - HH:mm')
                return {...Comment, createdAtText};
            })
    } catch (err) {
        console.error(err);
    }
    
    const customTitle = !!onePost ? `${onePost.title} | ` : 'ไม่พบโพสต์นี้ | '
    return { onePost, postComments, customTitle };
}

router.get('/new', (request, response) => {
    response.render('postNew')
})

router.post('/new', async (request, response) => {
    const { title, content, from, accepted } = request.body ?? {};
    try {
        // Validation
        if (!title || !content || !from) {
            throw new Error('no text');
        }
        else if (accepted != 'on') {
            throw new Error('no accepted')
        }

        // Create post
        await db.insert({ title, content, from, createdAt: new Date() }).into('post');
    } 
    catch (error) {
       console.error(error);
       let errorMessage = 'ผิดพลาดอะไรสักอย่าง'
       if(error.message === 'no text') {
        errorMessage = 'กรุณาใส่ข้อมูลให้ครบถ้วน';
       }
       else if (error.message === 'no accepted') {
        errorMessage = 'กรุณาติ๊กถูกยอมรับด้วย';
       }
       return response.render('postNew', { errorMessage, values:{ title, content, from }})
    }
    response.redirect('/p/new/done')
})

router.get('/new/done', (request, response) => {
    response.render('postNewDone')
})

//.params คือตัวเลขหน้า
router.get('/:postid', async (request, response) => {
    const { postid } = request.params
    const postData = await getPostAndComments(postid);
    response.render('postid', postData)
})

router.post('/:postid/comment', async (request, response) => {
    const { postid } = request.params;
    const { content, from, accepted } = request.body ?? {};
    try {
        // Validation
        if (!content || !from) {
            throw new Error('no text');
        }
        else if (accepted != 'on') {
            throw new Error('no accepted')
        }

        // Create comment
        await db.insert({ content, from, createdAt: new Date(), postid: +postid }).into('comment');
    } 
    catch (error) {
       console.error(error);
       let errorMessage = 'ผิดพลาดอะไรสักอย่าง'
       if(error.message === 'no text') {
        errorMessage = 'กรุณาใส่ข้อมูลให้ครบถ้วน';
       }
       else if (error.message === 'no accepted') {
        errorMessage = 'กรุณาติ๊กถูกยอมรับด้วย';
       }

       const postData = await getPostAndComments(postid);
       return response.render('postid', { ...postData, errorMessage, values:{ content, from }})
    }
    response.redirect(`/p/${postid}`)
})

module.exports = router;