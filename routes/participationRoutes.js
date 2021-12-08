var express = require('express');
var router = express.Router();
var pModel = require("../models/participationModel");

router.get('/', async function(req, res, next) {
    let result = await pModel.getAllParticipations();
    res.status(result.status).send(result.result);
});

router.post('/',async function(req, res, next) {
    let newParticipation = req.body;
    let result = await pModel.insertParticipation(newParticipation);
    res.status(result.status).send(result.result);
});

router.delete('/:id',async function(req, res, next) {
    let id = req.params.id;
    let result = await pModel.RemoveParticipationById(id);
    res.status(result.status).send(result.result);
});







module.exports = router;