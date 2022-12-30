import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import userSchema from "../models/user.js";

const register = async (req, res) => {
  const {
    name,
    email,
    password,
    mobile,
    address,
    category,
    securityQues,
    securityAns,
  } = req.body;
  try {
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      alert("User already exist");
      return res.status(404).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedAns = await bcrypt.hash(securityAns, 12);
    const newUser = await userSchema.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      category,
      securityQues,
      securityAns: hashedAns,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ result: newUser, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong..." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // const data = req.body;
  // const encodedText = JSON.stringify(data);
  // const decodedText = buffer.Buffer.from(encodedText, "base64").toString(
  //   "ascii"
  // );
  // const actual = JSON.parse(decodedText);
  // const { email, password } = actual;

  try {
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User don't exist" });
    }

    const isPasswordCrt = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ result: existingUser, token });
  } catch (error) {
    return res.status(500).json("Something went wrong...");
  }
};

const fetchSecurityQues = async (req, res) => {
  const { email: email } = req.query;
  try {
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const user = await userSchema.findOne({ email: email });
    const ques = user.securityQues;
    return res.status(200).json({ response: ques });
  } catch (error) {
    return res.send(400).json(error);
  }
};

const matchSecurityAns = async (req, res) => {
  const { email, answer } = req.body;

  try {
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isAnsCrt = await bcrypt.compare(answer, existingUser.securityAns);
    if (!isAnsCrt) {
      return res.status(400).json({ message: "Answer doesn't match" });
    }
    return res.status(200).json({ message: "answer matched" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const existingUser = await userSchema.find({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const user = await userSchema.findOne({ email: email });
    const _id = user._id;

    await userSchema.findByIdAndUpdate(_id, { $set: { password: hashedPassword } });
    return res.status(200).json({ message: "Password Changed Successfully" });
  } catch (error) {
    return res.status(405).json({ message: error.message });
  }
};

export default { register, login, fetchSecurityQues, matchSecurityAns, changePassword };
