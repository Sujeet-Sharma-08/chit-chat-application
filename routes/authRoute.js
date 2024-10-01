import express from 'express'
const router = express.Router()

import { loginUser, logoutUser, signupUser } from '../controllers/authController.js'

router.post('/login', loginUser) // login user with existing accounts
router.post('/signup', signupUser ) // creating a new accounts
router.post('/logout', logoutUser) // logout user



export default router;