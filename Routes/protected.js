const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


router.get('/profile', auth, async (req, res) => {
// req.user contains id and email
res.json({ message: 'Protected data', user: req.user });
});

router.get('/create', auth, async (req, res) => {
// req.user contains id and email
res.json({ message: 'Protected data', user: req.user });
});

router.get('/comment', auth, async (req, res) => {
// req.user contains id and email
res.json({ message: 'Protected data', user: req.user });
});


module.exports = router;