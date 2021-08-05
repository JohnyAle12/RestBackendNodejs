const { Router } = require('express');
const { userPost, userGet, userPut, userPatch, userDetele } = require('../controllers/user.controller');

const router = Router();

// Ruta de ejemplo
router.get('/example',  (req, res) => {
    //res.send('Hello World');
    // res.json({
    //     status: 200,
    //     msg: 'Hello World'
    // });

    res.status(403).json({
        status: 200,
        msg: 'Hello World GET method'
    });
});

router.get('/', userGet);
router.post('/', userPost);
router.put('/:id', userPut);
router.patch('/', userPatch);
router.delete('/', userDetele);


module.exports = router;