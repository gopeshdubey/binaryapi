"use strict";
const path = require("path");
const express = require("express");
const { body } = require("express-validator");
const gameController = require("../controllers/game");
const isAuth = require("../../middleware/jwt-auth");
const router = express.Router();

/**
 * Post api for adding game details
 */
router.post(
  "/add-game",
  [
    body("game_name")
      .isString()
      .isLength({
        min: 2,
      })
      .trim(),
    body("money_stacked_for_game").isFloat(),
    body("time")
      .isLength({
        min: 1,
        max: 20,
      })
      .trim(),
  ],
  isAuth,
  gameController.AddGame
);

/**
 * returns all games.
 */
router.get("/get-all-games", isAuth, gameController.getAllGames);

/**
 * Get Games by id.
 */
// router.get("/getGameById/:gameId", isAuth, gameController.getGameById);

module.exports = router;
