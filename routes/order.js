const express = require("express");
const router = express.Router();


const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth")
const {getUserById,pushOrderInPurchaseList} = require("../controllers/user")
const {updateStockAndSold} = require("../controllers/product")
const {getOrderById, createOrder,getAllOrders,updateStatus,getOrderStatus} = require("../controllers/order")


//params

router.param("userId",getUserById)
router.param("orderId",getOrderById)



// actual routes

//CREATE 
router.post("/order/create/:userId",isSignedIn,isAuthenticated,
pushOrderInPurchaseList,
updateStockAndSold,
createOrder)
// router.post("/order/create/:userId",
// pushOrderInPurchaseList,
// updateStockAndSold,
// createOrder)



// READ

router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders)
//router.get("/order/all/:userId",isSignedIn,getAllOrders)

// Order status

// router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus)
// router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)

router.get("/order/status/:userId",isAdmin,getOrderStatus)
router.put("/order/:orderId/status/:userId",isAdmin,updateStatus)


module.exports = router;