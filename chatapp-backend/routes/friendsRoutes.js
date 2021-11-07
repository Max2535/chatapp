const express = require('express');

const router = express.Router();

const FriendCtrl = require('../controllers/friends');
const AuthHelper = require('../Helpers/AuthHelper');

router.post('/follow-user',AuthHelper.VerifyToken,FriendCtrl.FolloweUser);
router.post('/unfollow-user',AuthHelper.VerifyToken,FriendCtrl.UnFolloweUser);
router.post('/mark/:id',AuthHelper.VerifyToken,FriendCtrl.MarkNotication);
router.post('/mark-all',AuthHelper.VerifyToken,FriendCtrl.MarkAllNotications);

module.exports = router;