"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  game_name: {
    type: String,
    required: true,
  },
  money_stacked_for_game: {
    type: Number,
    required: true,
  },
  win_or_loss: {
    type: String,
    enum: ["win", "loss", "pending"],
    default: "pending",
  },
  Cryptocurrency_coin_name: {
    type: String,
    enum: ["btc", "eth"],
    default: "btc",
    // required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "CREATED",
  },
  created_at: {
    type: Date,
  },
  created_by: {
    type: String,
  },
  updated_at: {
    type: Date,
  },
  updated_by: {
    type: String,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Game", gameSchema);
