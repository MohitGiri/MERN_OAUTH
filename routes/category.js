const express = require('express');
const router = express.Router();

const {getCategoryById,createCategory,getCategory,getAllCategories,updateCategory,deleteCategory} = require("../controllers/category")
const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")


router.param("userId",getUserById)
router.param("categoryId",getCategoryById)



//router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory)
router.post("/category/create/:userId",isAdmin,createCategory)


//READ
router.get("/category/:categoryId",getCategory)
router.get("/categories",getAllCategories)

//UPDATE
//router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory)
router.put("/category/:categoryId/:userId",isAdmin,updateCategory)


//DELETE
//router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteCategory)
router.delete("/category/:categoryId/:userId",isAdmin,deleteCategory)


module.exports = router;