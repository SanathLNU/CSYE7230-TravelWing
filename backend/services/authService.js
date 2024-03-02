const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');
const User = require('../models/userModel');

const createUser = async (email, password, fname, lname) => {
  const userResponse = await admin.auth().createUser({
    email,
    password,
    emailVerified: false,
    disabled: false,
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
    fname,
    lname,
  });

  await newUser.save();
  return { userResponse, newUser};
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid password');
  }

  return user;
};

module.exports = {
  createUser, loginUser,
};
