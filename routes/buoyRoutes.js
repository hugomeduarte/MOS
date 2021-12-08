var express = require('express');
var router = express.Router();
var bModel = require("../models/buoyModel");

router.get('/', async function(req, res, next) {
    let result = await bModel.getAllBuoys();
    res.status(result.status).send(result.result);
});
router.get('/:id', async function(req, res, next) {
    let id = req.params.id;
    console.log("Sending buoy with id "+id);
    let result = await bModel.getBuoyById(id);
    res.status(result.status).send(result.result);
  });





module.exports = router;