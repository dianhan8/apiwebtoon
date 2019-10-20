const Favorite = require('../models').favorite
const Webtoon = require('../models').webtoon

//Get Favorite
exports.Favorite = (req, res) => {
    const user_id = req.params.userid
    Favorite.findAll({
        where: { user_id },
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
                message: "Can't Find Favorite",
                err
            })
        })
}

//Add Favorite And Find Favorite
exports.FindAndStore = (req, res) => {
    const user_id = req.params.userid
    const webtoon_id = req.params.webtoon_id
    Favorite.findOrCreate({
        where: { user_id, webtoon_id },
        defaults: {
            user_id,
            webtoon_id,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
        .then(function (favorite) {
            res.send({
                disable: true,
                message: "Your Favorite Has Be Save in My Favorite"
            })
        })
        .catch((err) => {
            res.send({
                disable: false,
                message: "This Favorite has be haved"
            })
        })
}