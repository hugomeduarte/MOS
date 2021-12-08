var express = require('express');
var router = express.Router();
var eModel = require("../models/eventModel");

router.get('/', async function(req, res, next) {
    let result = await eModel.getAllEvents();
    res.status(result.status).send(result.result);
});

router.post('/',async function(req, res, next) {
    let newEvent = req.body;
    let result = await eModel.insertEvent(newEvent);
    res.status(result.status).send(result.result);
});

router.get('/available', async function(req, res, next) {
    let result = await eModel.getAllAvailableEvents();
    res.status(result.status).send(result.result);
});

router.get('/:event_id/participants', async function(req, res, next) {
    let event_id = req.params.event_id;
    let result = await eModel.getParticipantsByEventId(event_id);
    res.status(result.status).send(result.result);
});

router.get('/:available/buoy/:id', async function(req, res, next) {
    let id = req.params.id;
    let result = await eModel.getAvailableEventsCountbyBuoyId(id);
    res.status(result.status).send(result.result);
});

router.delete('/:id',async function(req, res, next) {
    let id = req.params.id;
    let result = await eModel.RemoveEventById(id);
    res.status(result.status).send(result.result);
});

router.get('/last', async function(req, res, next) {
    let result = await eModel.getLastEventId();
    res.status(result.status).send(result.result);
});


module.exports = router;