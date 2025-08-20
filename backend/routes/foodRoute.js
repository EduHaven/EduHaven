import express from "express"
import { addFood, getFoodByRestaurant , removeFood} from "../controllers/foodController.js"
import multer from "multer"

const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
      },
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.post("/remove", removeFood)
foodRouter.get("/restaurant/:restaurantId", getFoodByRestaurant);
export default foodRouter;