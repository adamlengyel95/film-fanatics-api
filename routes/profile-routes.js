const router = require('express').Router();

const authCheck = (req, res, next) => {
    if(!req.user){
        res.send({authError: 'User is not authenticated.'})
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    res.send(req.user);
});

module.exports = router;