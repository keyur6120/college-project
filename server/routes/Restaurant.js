import {Router} from 'express'
import { makeProfileforRestaurant } from '../controllers/restaurant.js'



const router  = Router()


router.post('/create',makeProfileforRestaurant)

export default router