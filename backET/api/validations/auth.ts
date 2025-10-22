 import { body } from "express-validator";

 export const registerValidation=[
    body("username","Username is too short").isLength({min:3}),
    body("email","Not valid email").isEmail(),
    body("password","Password is too short(5)").isLength({min:5})
 ]

 export const loginValidation=[
    body("email","Not valid email").isEmail(),
    body("password","Password is too short(5)").isLength({min:5})
 ]

