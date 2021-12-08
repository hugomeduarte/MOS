var express = require('express');
var router = express.Router();
var sModel = require("../models/seasonModel");

router.get('/', async function(req, res, next) {
    let result = await sModel.getAllSeasons();
    res.status(result.status).send(result.result);
});

router.get('/curdate', async function(req, res, next) {
    let result = await sModel.getSeasonByCURRENT_DATE();
    res.status(result.status).send(result.result);
});








module.exports = router;