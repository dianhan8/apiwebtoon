const jwt = require('jsonwebtoken')

const models = require('../models')
const User = models.user

exports.login = (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({ where: { email, password } })
        .then(user => {
            if (user) {
                const token = jwt.sign({ userId: user.id }, 'my-secret-token')
                res.send({
                    token
                })
            } else {
                res.send({
                    error: true,
                    message: "Wrong Email or Password!"
                })
            }
        })


}
exports.register = (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    User.findOrCreate({
        where: { email },
        defaults: {
            email: email,
            password: password,
            name: name,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
        .then(function (user) {
            res.send({
                msg: `Account has created, you can login now`
            })
        })
        .catch((err) => {
            res.send({
                msg: "Email has be used"
            })
        })
}
