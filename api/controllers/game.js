const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Game = require("../models/game");
const User = require("../models/user");
const math = require("mathjs");
const fs = require("fs");
const path = require("path");

/**
 * Post mapping to add games.
 */
exports.AddGame = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    error = new Error("Entered Input Is Inappropriate Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {
    let body = {
      ...req.body,
    };

    // let gameAlreadyExists = await Game.findOne({
    //   game_name: body.game_name,
    // });
    // if (gameAlreadyExists) {
    //   const error = new Error("Game already Exists");
    //   error.statusCode = 409;
    //   throw error;
    // } else {
    let win_or_loss;
    if (
      body.win_or_loss &&
      body.win_or_loss != undefined &&
      body.win_or_loss != ""
    ) {
      win_or_loss = body.win_or_loss;
    }
    let Cryptocurrency_coin_name;
    if (
      body.Cryptocurrency_coin_name &&
      body.Cryptocurrency_coin_name != undefined &&
      body.Cryptocurrency_coin_name != ""
    ) {
      Cryptocurrency_coin_name = body.Cryptocurrency_coin_name;
    }

    const game = new Game({
      game_name: body.game_name,
      money_stacked_for_game: body.money_stacked_for_game,
      win_or_loss: win_or_loss,
      Cryptocurrency_coin_name: Cryptocurrency_coin_name,
      time: body.time,
      status: "CREATED",
      created_at: Date.now(),
      created_by: "ADMIN",
      updated_at: Date.now(),
      updated_by: "ADMIN",
      creator: req.userId,
    });
    const user = await User.findById(req.userId);
    if (user) {
      await game.save();
      user.games.push(game);
      await user.save();
      res.status(201).json({
        success: true,
        message: "Game Created Successfully!",
        creator: {
          _id: user._id,
          name: user.user_name,
        },
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Game is not created bcz you are not Authorized user",
        data: {},
      });
    }
    // }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};

/**
 * Get mapping to fetch All games.
 */

exports.getAllGames = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  try {
    const game = await Game.find({
      status: "CREATED",
    });
    if (!game) {
      const error = new Error("Game Not Found");
      error.statusCode = 404;
      throw error;
    }
    res.status(201).json({
      message: "Games Found",
      success: true,
      product: game,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};
