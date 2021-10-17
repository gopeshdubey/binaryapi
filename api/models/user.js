const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_name: {
    type: String,
    required: true,
  },
  Cryptocurrency_coin_name: {
    type: String,
    enum: ["btc", "eth"],
    default: "btc",
    // required: true,
  },
  first_name: {
    type: String,
    // required: true,
  },
  last_name: {
    type: String,
    // required: true,
  },
  date_of_birth: {
    type: String,
    // required: true,
  },
  phone_no: {
    type: String,
    // required: true,
  },
  address: {
    type: String,
    //  required: true
  },
  email_address: {
    type: String,
    // required: true,
  },
  country: {
    type: String,
    // required: true,
  },
  city: {
    type: String,
    // required: true
  },
  state: {
    type: String,
    //  required: true
  },
  pin_code: {
    type: String,
    // required: true
  },
  password: {
    type: String,
    // required: true,
  },
  confirm_password: {
    type: String,
    // required: true,
  },
  status: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  sended_otp: {
    type: String,
    // required: true,
  },
  games: [
    {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
  ],
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
});

module.exports = mongoose.model("User", userSchema);
