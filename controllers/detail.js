const Detail = require('../models').detail

//Create Image Detail
exports.storeDetail = (req, res) => {
    const episode_id = req.params.episodeid
    const body = req.body
    Detail.create({
        page: body.page,
        image: body.image,
        episode_id
    })
    .then({
        message: `Image ${page} has Created`,
        result
    })
    .catch(function(err){
        res.send({
            error: true,
            message: "Can't Create Image",
            err
        })
    })
}

//Delete Image Detail
exports.deleteImage = (req, res) => {
    const id = req.params.imagesid
    Detail.destroy({
        where: {id}
    })
    .then(function(result){
        res.send({
            message: `Image ${id} has been deleted`,
            result
        })
    })
    .catch(function(err){
        res.send({
            error: true,
            message: "Can't delete image",
            err
        })
    })
}

//Get All Images for Create My Screen Webtoon
exports.showByDetail = (req, res) => {
    const episode_id = req.params.episodeid
    Detail.findAll({
        where: {episode_id}
    })
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        res.send({
            error: true,
            message: "Can't Find This Detail",
            err
        })
    })
}

//Get All Image Episode By Episode Id
exports.showByEpisode = (req, res) => {
    const episode_id = req.params.episodeid
    Detail.findAll({
        where:{episode_id}
    })
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        res.send({
            error: true,
            message: "Error Cannot Find",
            err
        })
    })
}