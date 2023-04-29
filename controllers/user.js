import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import userSchema from "../models/user.js";
import requirementsSchema from "../models/requirements.js";
import connectionRequestsSchema from "../models/connectionRequests.js";

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
      return res.status(400).json({ message: "User already exist" });
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
      return res.status(404).json({ message: "User doesn't exist" });
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

const getUserData = async (req, res) => {
  const { email } = req.query;
  try {
    const userData = await userSchema.findOne({ email: email });
    return res.status(200).json(userData);
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

    await userSchema.findByIdAndUpdate(_id, {
      $set: { password: hashedPassword },
    });
    return res.status(200).json({ message: "Password Changed Successfully" });
  } catch (error) {
    return res.status(405).json({ message: error.message });
  }
};

const saveRequirements = async (req, res) => {
  const data = req.body;
  try {
    const existingUser = await userSchema.findOne({ email: data?.email });
    if (existingUser.category !== "customer") {
      return res
        .status(404)
        .json({ message: "User is not registered as a customer" });
    }
    const savedRequirement = await requirementsSchema.create(data);
    savedRequirement.save();
    return res.status(200).json({ message: "Requirement Saved successfully." });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getRequirements = async (req, res) => {
  const { email } = req.query;
  try {
    const requirementsList = await requirementsSchema.find({ email: email });
    return res.status(200).json(requirementsList);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const data = req.body;
  try {
    const updatedAddress = await userSchema.findOneAndUpdate(
      { email: data?.email },
      { $set: data },
      { new: true }
    );
    return res.status(200).json(updatedAddress);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getConnectionRequests = async (req, res) => {
  const { userId } = req.query;
  try {
    const connectionRequestList = await connectionRequestsSchema
      .find({
        userId: userId,
      })
      .populate(["userId", "providerId", "requirementId"]);
    return res.status(200).json(connectionRequestList);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const updateConnectionRequest = async (req, res) => {
  const { id, status } = req.query;
  try {
    const updatedConnectionRequest =
      await connectionRequestsSchema.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      );
    return res.status(200).json(updatedConnectionRequest);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export default {
  register,
  login,
  getUserData,
  fetchSecurityQues,
  matchSecurityAns,
  changePassword,
  saveRequirements,
  getRequirements,
  updateUser,
  getConnectionRequests,
  updateConnectionRequest,
};
