const Favorite = require('../models').favorite
const Webtoon = require('../models').webtoon

//Get Favorite
exports.Favorite = (req, res) =>{
    const user_id = req.params.userid
    Favorite.findAll({
        where: {user_id},
        include:[{
            model:Webtoon,
            as:"Webtoon"
        }]
    })
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        res.send({
            error:true,
            message: "Can't Find Favorite",
            err
        })
    })
}