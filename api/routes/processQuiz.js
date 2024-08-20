var express = require("express");
var router = express.Router();
router.use(express.json())

router.post('/', function(req, res) {
    const body = req.body;
    console.log("post request includes " + body)
    res.send("post request");

});


router.get("/", function(req, res, next) {
    res.send("API is working properly");
});



module.exports = router;
