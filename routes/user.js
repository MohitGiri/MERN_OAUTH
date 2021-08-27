const express = require('express')
const router = express.Router()

const {getUserById,getUser,getAllUsers,userPurchaseList} = require("../controllers/user")
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")

router.param("userId",getUserById)


//router.get("/user/:userId",isSignedIn,isAuthenticated,getUser)

//router.get("/user/:userId",getUser)


router.get("/users",getAllUsers);

//router.put("/user/:userId",)

router.get("/orders/user/:userId",isSignedIn,isAuthenticated,userPurchaseList)

//router.get("/orders/user/:userId",userPurchaseList)

module.exports = router