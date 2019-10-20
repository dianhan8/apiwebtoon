const Episode = require('../models').episode
const Webtoon = require('../models').webtoon

//Get All Episode By Webtoon Id
exports.show = (req, res) => {
    const webtoon_id = req.params.webtoonid
    Episode.findAll({
        where: { webtoon_id },
        include: [{
            model: Webtoon,
            as: "Webtoon"
        }]
    })
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send({
                error: true,
                message: "Error Cannot Find",
                err
            })
        })
}

//Get All Episode By Webtoon Id For Screen Create My Webtoon
exports.showEpisodeById = (req, res) => {
    const webtoon_id = req.params.webtoonid
    Episode.findAll({
        where: { webtoon_id }
    })
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send({
                error: true,
                message: "Error Can't Find",
                err
            })
        })
}

//Create Episode By Webtoon
exports.storeEpisode = (req, res) => {
    const webtoon_id = req.params.webtoonid
    const body = req.body
    Episode.create({
        title: body.title,
        cover: body.cover,
        webtoon_id,
        createdAt: new Date(),
        updatedAt: new Date()
    })
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send({
                error: true,
                message: "Can't Create Webtoon",
                err
            })
        })
}

//Update Episode by Id
exports.updateByEpisode = (req, res) => {
    const id = req.params.episodeid
    const body = req.body
    Episode.update({
        title: body.title,
        cover: body.cover,
        updatedAt: new Date()
    },
        {
            where: { id }
        })
        .then(function (result) {
            res.send({
                ...body,
                result
            })
        })
        .catch(function (err) {
            res.send({
                error: true,
                message: "can't update episode",
                err
            })
        })
}

//Delete Episode
exports.DeleteEpisode = (req, res) => {
    const id = req.params.episodeid
    Episode.destroy({
        where: { id }
    })
        .then(function (result) {
            res.send({
                message: `Episode ${id} Has been deleted`,
                result
            })
        })
        .catch(function (err) {
            res.send({
                error: true,
                message: "Can't Update",
                err
            })
        })
}
