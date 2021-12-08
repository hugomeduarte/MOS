var express = require('express');
var router = express.Router();
var lModel = require("../models/locationModel");

router.get('/', async function(req, res, next) {
    let result = await lModel.getAllLocations();
    res.status(result.status).send(result.result);
});

router.get('/:id', async function(req, res, next) {
    let id = req.params.id;
    console.log("Sending location with id "+id);
    let result = await lModel.getLocationById(id);
    res.status(result.status).send(result.result);
  });








module.exports = router;