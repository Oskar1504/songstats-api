const express = require('express')
const fs = require('fs')

const Response = require('../helper/Response');

const router = express.Router();

router.get('/list', async (req, res) => {
    try{
        res.json(Response.buildResponse(JSON.parse(fs.readFileSync("./server/data/loadArtists.json"))))
    }
    catch(e){
        res.json(Response.buildErrorResponse(e))
    }
})

router.get('/get/*', async (req, res) => {
    try{
        let artist = req.url.split("/").pop()
        res.json(Response.buildResponse(JSON.parse(fs.readFileSync(`./server/data/artists/${artist}.json`))))
    }
    catch(e){
        res.json(Response.buildErrorResponse(e))
    }
})

router.get('/source/*/*', async (req, res) => {
    try{
        let artist = req.url.split("/")[2]
        let source = req.url.split("/")[3]
        let o = JSON.parse(fs.readFileSync(`./server/data/artists/${artist}.json`))
        o = o.charts[source]
        res.json(Response.buildResponse(o))
    }
    catch(e){
        res.json(Response.buildErrorResponse(e))
    }
})

module.exports = router;