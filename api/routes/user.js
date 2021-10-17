"use strict";
/**
 * routes.userAuth.js
 * created by Tanuj
 * copyright © 2020 . All rights reserved.
 */

const express = require("express");
const authController = require("../controllers/auth");
const isAuth = require("../../middleware/jwt-auth");
const { check, body } = require("express-validator");
const User = require("../models/user");
const router = express.Router();

router.get('/', (req, res) => {
  res.json({success: 200})
})

/**
 * Post signUP Creates a User
 */
router.post(
  "/signup",
  [
    check("email_address")
      .isEmail()
      .withMessage("Please enter a valid email Address")
      .custom((value, { req }) => {
        return User.findOne({ email_address: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body("phone_no")
      .isLength({
        min: 10,
      })
      .withMessage("Please enter a valid Mobile Number."),
    body("phone_no")
      .isNumeric()
      .withMessage("Please Enter Only Digits in Mobile Number"),
    check("phone_no").custom((value, { req }) => {
      return User.findOne({ mobile_Number: value }).then((userNumber) => {
        if (userNumber) {
          return Promise.reject(
            "Mobile number exists already, please pick a different one."
          );
        }
      });
    }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({
        min: 5,
      })
      .isAlphanumeric()
      .trim(),
    body("confirm_password")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authController.signup
);

/**
 * Post Login
 */
router.post("/login", authController.login);

/**
 * post Api phone_verification
 */
router.post(
  "/phone_verification",
  [
    body("mobile_Number")
      .isLength({
        min: 10,
        max: 12,
      })
      .withMessage("Please enter a valid Mobile Number."),
  ],
  authController.phone_verification
);

router.post("/findByName", authController.findByName);

/**
 * Post Verification
 */
router.post("/verify", authController.verify);

/**
 * Get Status of Logged of user, whether user is verified or not
 */
router.get("/status", isAuth, authController.getUserStatus);

/**
 * Returns user on the basis of search result matched with user's name.
 */
router.post("/getUserByName/:user_name", isAuth, authController.getUserByName);

/**
 * Update Status of User.
 */
router.patch(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
  authController.updateUserStatus
);

/*
 * Deletes a particular user by id.
 */
router.delete("/deleteById/:id", isAuth, authController.deleteById);

/**
 * Get users by id.
 */
router.get("/getById/:id", isAuth, authController.getById);

/*
 * getAll users.
 */
router.get("/get-all", isAuth, authController.getAll);

module.exports = router;
