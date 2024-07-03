const {addToLikedMovies, getLikedMovies, removeFromLikedMovies} =require("../controllers/UserController");

const router=require("express").Router();

router.post("/add",addToLikedMovies);
router.get("/liked/:email",getLikedMovies);
Routes.put("/delete",removeFromLikedMovies);
module.exports=router;