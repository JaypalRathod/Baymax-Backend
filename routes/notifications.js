const express = require('express');
const { sendNotification, broadcastNotification, registerToken } = require('../controller/notifications');

const router = express.Router();

router.post("/send", sendNotification);
router.post("/broadcast", broadcastNotification);
router.post("/register-token", registerToken);

module.exports = router;