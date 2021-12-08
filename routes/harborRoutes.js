var express = require('express');
var router = express.Router();
var hModel = require("../models/harborModel");

router.get('/', async function(req, res, next) {
    let result = await hModel.getAllHarbors();
    res.status(result.status).send(result.result);
});

router.get('/:id', async function(req, res, next) {
    let id = req.params.id;
    console.log("Sending harbor with id "+id);
    let result = await hModel.getHarborById(id);
    res.status(result.status).send(result.result);
  });



module.exports = router;