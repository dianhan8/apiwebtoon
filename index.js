require('express-group-routes')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 2050
const path = require('path')

//STATIC FILE
app.use("/public", express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())
//CKECKED
app.get('/', (req, res) => {
    res.send('Succes')
})

//MiddleWare
const { authenticated } = require('./middleware')

//API V2
const AuthController = require('./controllers/controllerApiV2/auth')
const RoomController = require('./controllers/controllerApiV2/room')
const CustomerController = require('./controllers/controllerApiV2/customers')
const OrderCustomerController = require('./controllers/controllerApiV2/order')
const UsersController = require('./controllers/user')

//API V2
app.group('/api/v2', (router) => {
    //Users
    router.get('/user',authenticated, UsersController.GetProfile)
    router.post('/login', AuthController.login)
    router.post('/register', AuthController.register)

    //Room
    router.get('/rooms', authenticated, RoomController.index)
    router.post('/room', authenticated, RoomController.store)
    router.patch('/room/:id', authenticated, RoomController.update)

    //Customer
    router.get('/customers', authenticated, CustomerController.index)
    router.post('/customer', authenticated, CustomerController.store)
    router.patch('/customer/:id', authenticated, CustomerController.update)

    //Order
    router.get('/checkin', authenticated, OrderCustomerController.index)
    router.post('/checkin', authenticated, OrderCustomerController.store)
    router.delete('/checkin/:id', authenticated, OrderCustomerController.update)
})


//API V1
const WebtoonController = require('./controllers/webtoon')
const EpisodeController = require('./controllers/episode')
const DetailController = require('./controllers/detail')
const FavoriteController = require('./controllers/favorite')
const UserController = require('./controllers/user')

//API v1 
app.group('/api/v1', (router) => {
    //User
    router.post('/login',
        AuthController.login)
    router.post('/register',
        AuthController.register)

    //Get Data Users By Id
    router.get('/users/:userId', authenticated, UserController.getDataUser)

    //Update User By Id
    router.patch('/users/:userId', authenticated, UserController.updateDataUser)

    //Webtoon
    //Show All Webtoon
    router.get('/webtoons', WebtoonController.index)
    //Get All Webtoon By Title with Query
    router.get('/webtoon', authenticated, WebtoonController.showFavoriteSearch)
    //Create Webtoon By Users
    router.post('/user/:id/webtoons', authenticated, WebtoonController.store)
    //Get All Webtoon By Users
    router.get('/user/:id/webtoons', authenticated, WebtoonController.showByUsers)
    //Update Webtoon By Users
    router.put('/user/:userid/webtoon/:webtoonid', authenticated, WebtoonController.UpdateByWebtoons)
    //Delete Webtoon By Users 
    router.delete('/user/:userid/webtoon/:webtoonid', authenticated, WebtoonController.DeleteByWebtoons)

    //Favorite
    router.get('/user/:userid/favorite', authenticated, FavoriteController.Favorite)
    router.post('/user/:userid/favorite/:webtoonid', authenticated, FavoriteController.FindAndStore)
    router.delete('/user/:userid/favorite/:webtoonid', authenticated, FavoriteController.deleteFavorite)

    //Episode
    //Show All Episode
    router.get('/webtoon/:webtoonid/episode', EpisodeController.show)
    //Get All Episode By Id For Webtoon 
    router.get('/user/:userid/webtoon/:webtoonid/episodes', authenticated, EpisodeController.showEpisodeById)
    //Create Episode By Webtoon 
    router.post('/user/:userid/webtoon/:webtoonid/episode', authenticated, EpisodeController.storeEpisode)
    //Update Episode By Webtoon
    router.put('/user/:userid/webtoon/:webtoonid/episode/:episodeid', authenticated, EpisodeController.updateByEpisode)
    //Delete Episode by Webtoon
    router.delete('/user/:userid/webtoon/:webtoonid/episode/:episodeid', authenticated, EpisodeController.DeleteEpisode)

    //Detail Image
    //Get All Images For Episode
    router.get('/user/:userid/webtoon/:webtoonid/episode/:episodeid/images', authenticated, DetailController.showByDetail)
    //Get Image By Episode
    router.get('/webtoon/:webtoonid/episode/:episodeid', DetailController.showByEpisode)
    //Create Image Episode
    router.post('/user/:userid/webtoon/:webtoonid/episode/:episodeid/images', authenticated, DetailController.storeDetail)
    //Delete Image Episode
    router.delete('/user/:userid/webtoon/:webtoonid/episode/:episodeid/images/:imagesid', authenticated, DetailController.deleteImage)
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});