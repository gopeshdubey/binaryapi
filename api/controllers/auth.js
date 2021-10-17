const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const emailUtil = require("../util/email.util");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CONFIG = require("../../config/app_config");
const client = require("twilio")(
  CONFIG.Twilio_ACCOUNT_SID,
  CONFIG.Twilio_AUTH_TOKEN
);

/**
 * Post mapping to create a user by given object inside request body.
 */
exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      throw error;
    }
    let body = {
      ...req.body,
    };
    const hashedPassword = await bcrypt.hash(body.password, 12);
    let Cryptocurrency_coin_name;
    if (
      body.Cryptocurrency_coin_name &&
      body.Cryptocurrency_coin_name != undefined &&
      body.Cryptocurrency_coin_name != ""
    ) {
      Cryptocurrency_coin_name = body.Cryptocurrency_coin_name;
    }
    var seq = (Math.floor(Math.random() * 10000) + 10000)
      .toString()
      .substring(1);
    console.log("OTP", seq);

    const user = new User({
      user_name: body.user_name,
      Cryptocurrency_coin_name: Cryptocurrency_coin_name,
      first_name: body.first_name,
      last_name: body.last_name,
      date_of_birth: body.date_of_birth,
      phone_no: body.phone_no,
      address: body.address,
      email_address: body.email_address,
      country: body.country,
      city: body.city,
      state: body.state,
      pin_code: body.pin_code,
      password: hashedPassword,
      confirm_password: hashedPassword,
      created_at: Date.now(),
      created_by: "ADMIN",
      updated_at: Date.now(),
      updated_by: body.updated_by,
      provider: "Local",
      status: "CREATED",
      otp: "NOT VERIFIED",
      sended_otp: seq,
    });

    emailUtil.sendMail(
      body.email_address,
      `Welcome in Binary-Game ,Please Enter this otp  ${seq} for verifying Before Login `,
      `OTP : ${seq}`,
      "Thanks you !!",
      1
    );
    // const otp = await client.verify
    //   .services(CONFIG.Twilio_SERVICE_ID)
    //   .verifications.create({
    //     to: `+${body.mobile_Number}`,
    //     channel: "sms",
    //   });
    let result = await user.save();
    res.status(201).json({
      success: true,
      message: "User created, otp sended to email",
      // otp:otp,
      userId: result._id,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      msg: error.message,
    });
  }
};

/**
 * Post mapping to Login a user by given object inside request body.
 */
exports.login = async (req, res, next) => {
  const email_address = req.body.email_address;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({
      email_address: email_address,
    });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
    if (user.otp !== "VERIFIED") {
      const error = new Error("Please verify your account before Login");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("UserName or Password is not Valid");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email_address,
        userId: loadedUser._id.toString(),
      },
      "somesupersecretsecret",
      {
        expiresIn: "2days",
      }
    );
    res.status(200).json({
      message: "Welcome " + user.user_name,
      token: token,
      userId: loadedUser._id.toString(),
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};

exports.findByName = async (req, res, next) => {
  try {
    const displayName = req.body.name;

    const name = await User.find({
      displayName: displayName,
    });
    if (!name) {
      res.status(200).json({
        success: false,
        message: "Name does not exist",
      });
    }

    if (name) {
      res.status(201).json({
        success: true,
        data: name,
      });
    }
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.messsage,
    });
  }
};

exports.phone_verification = async (req, res, next) => {
  try {
    const mobile_Number = req.body.mobile_Number;
    const channel = req.body.channel;

    const check = await User.findOne({
      mobile_Number: mobile_Number,
    });
    if (!check) {
      const error = new Error("Mobile Number Not found");
      error.statusCode = 409;
      throw error;
    }

    const otp = await client.verify
      .services(CONFIG.Twilio_SERVICE_ID)
      .verifications.create({
        to: `+${mobile_Number}`,
        channel: channel,
      });
    res.status(201).json({
      success: true,
      data: otp,
      message: "OTP Send",
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};

exports.verify = async (req, res, next) => {
  try {
    const mobile_Number = req.body.mobile_Number;
    const code = req.body.code;

    const user = await User.findOne({
      mobile_Number: mobile_Number,
    });
    console.log(user);
    if (!user) {
      const error = new Error("Mobile Number Not found");
      error.statusCode = 409;
      throw error;
    } else {
      // const verifyOTP = await client.verify
      //   .services(CONFIG.Twilio_SERVICE_ID)
      //   .verificationChecks.create({
      //     to: `+${mobile_Number}`,
      //     code: code,
      //   });

      // if (verifyOTP.status === "approved") {
      //   user.otp = "VERIFIED";
      //   await user.save();
      // }
      if (user.sended_otp === code) {
        user.otp = "VERIFIED";
        await user.save();
        res.status(201).json({
          success: true,
          message: "OTP Verified",
          data: code,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Please enter a correct OTP",
          // data: verifyOTP,
        });
      }
    }
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
 * Get mapping to fetch User Status.
 */
exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found..");
      error.statusCode = 401;
      throw error;
    }
    res.status(200).json({
      status: user.status,
      otp: user.otp,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};

/**
 * Post mapping to Update a user Status by given object ID inside request body.
 */
exports.updateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 401;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.json({
      message: "Status updated",
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};

/**
 * Delete mapping to delete a user by its id.
 */
exports.deleteById = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (user) {
      user.status = "DELETED";
      user.updated_at = Date.now();
      // crewMember.updated_by = "ADMIN_1";
      await user.save();
      res.status(201).json({
        success: true,
        message: "user Deleted Successfully",
        data: {},
      });
    } else {
      const error = new Error("user Not exist");
      error.statusCode = 409;
      throw error;
    }
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
 * Get mapping to fetch User By id.
 */
exports.getById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("user Not found");
      error.statusCode = 404;
      throw error;
    }
    if (user.status === "DELETED") {
      const error = new Error("can not found user");
      error.statusCode = 404;
      throw error;
    }
    res.status(201).json({
      message: "User found",
      success: true,
      user: user,
    });
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
 * Get Mapping to fetch user by name
 */
exports.getUserByName = async (req, res, next) => {
  try {
    const checkUser = await User.find({
      user_name: {
        $regex: req.params.user_name,
        $options: "$i",
      },
    });
    if (checkUser.length === 0) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    } else {
      res.status(201).json({
        message: "User Found On The Basis Of User_Name",
        success: true,
        user: checkUser,
      });
    }
  } catch (error) {
    res.status(200).json({
      message: error.message,
      success: false,
      data: {},
    });
  }
};

/**
 * Get mapping to fetch All User.
 */
exports.getAll = async (req, res, next) => {
  try {
    const user = await User.find({
      status: "CREATED",
    });

    if (!user) {
      const error = new Error("user Not Found");
      error.statusCode = 404;
      throw error;
    }
    res.status(201).json({
      message: "user found Successfully",
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};
