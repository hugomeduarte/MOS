var express = require('express');
var router = express.Router();
var uModel = require("../models/userModel");

router.get('/', async function(req, res, next) {
    let result = await uModel.getAllUsers();
    res.status(result.status).send(result.result);
});

router.post('/login',async function(req, res, next) {
    let nome = req.body.nome;
    let password = req.body.password;
    let result = await uModel.login(nome,password);
    res.status(result.status).send(result.result);
});

router.get('/:id', async function(req, res, next) {
    let id = req.params.id;
    console.log("Sending user with id "+id);
    let result = await uModel.getUserById(id);
    res.status(result.status).send(result.result);
  });

router.get('/:id/points/season/:season', async function(req, res, next) {
    let id = req.params.id;
    let season = req.params.season;
    console.log("Sending points of user with id "+id);
    let result = await uModel.getUserPointsBySeason(id,season);
    res.status(result.status).send(result.result);
  });

  router.get('/:id/participations/:filter/season/:season', async function(req, res, next) {
    let id = req.params.id;
    let season = req.params.season;
    let filter = req.params.filter;
    console.log("Sending participations of user with id "+id);
    let result = await uModel.getUserParticipations(id,season,filter);
    res.status(result.status).send(result.result);
  });

 





module.exports = router;