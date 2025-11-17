const router = require("express").Router()
const emailSubscribed  = require("../email-controllers/send-email.controller")

router.post("/subscribed-email",emailSubscribed)

module.exports = router