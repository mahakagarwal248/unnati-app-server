import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import providerSchema from "../models/provider.js";
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
    serviceProviding,
    securityQues,
    securityAns,
    experience,
    availability,
  } = req.body;
  try {
    const existingProvider = await providerSchema.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedAns = await bcrypt.hash(securityAns, 12);
    const newUser = await providerSchema.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      category,
      serviceProviding: serviceProviding.toLowerCase(),
      securityQues,
      securityAns: hashedAns,
      experience,
      availabilityTime: availability,
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
    const existingUser = await providerSchema.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User don't exist!" });
    }

    if (existingUser.category != "provider") {
      return res
        .status(404)
        .json({ message: "User is not registered as a provider!" });
    }
    const isPasswordCrt = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Incorrect Password!" });
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
    const existingUser = await providerSchema.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }
    const user = await providerSchema.findOne({ email: email });
    const ques = user.securityQues;
    return res.status(200).json({ response: ques });
  } catch (error) {
    return res.send(400).json(error);
  }
};

const matchSecurityAns = async (req, res) => {
  const { email, answer } = req.query;

  try {
    const existingUser = await providerSchema.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    const isAnsCrt = await bcrypt.compare(answer, existingUser.securityAns);
    if (!isAnsCrt) {
      return res.status(400).json({ message: "Answer doesn't match!" });
    }
    return res.status(200).json({ message: "Answer matched" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const changePassword = async (req, res) => {
  const { email, newPassword } = req.query;
  try {
    const existingUser = await providerSchema.find({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const user = await providerSchema.findOne({ email: email });
    const _id = user._id;

    await providerSchema.findByIdAndUpdate(_id, {
      password: hashedPassword,
    });
    return res.status(200).json({ message: "Password Changed Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(405).json({ message: error.message });
  }
};

const getProviders = async (req, res) => {
  try {
    const { service } = req.params;
    const serviceProviders = await providerSchema.find({
      serviceProviding: service,
    });
    if (!serviceProviders) {
      return res
        .send(404)
        .json({ message: `No service provider found for ${category} service` });
    }
    return res.status(200).json(serviceProviders);
  } catch (error) {
    return res.send(error);
  }
};

const getRequirements = async (req, res) => {
  const { service } = req.query;
  try {
    const requirementsList = await requirementsSchema.find({
      service: service,
      isActive: true,
      sentBy: "provider",
    });
    return res.status(200).json(requirementsList);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getConnectionRequests = async (req, res) => {
  const { providerId } = req.query;
  try {
    const connectionRequestList = await connectionRequestsSchema
      .find({
        providerId: providerId,
      })
      .populate(["userId", "providerId", "requirementId"]);
    return res.status(200).json(connectionRequestList);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const isRequestSent = async (req, res) => {
  const { requirementId, providerId } = req.query;
  try {
    const existingRequest = await connectionRequestsSchema.findOne({
      requirementId: requirementId,
      providerId: providerId,
    });
    if (!existingRequest) {
      return res.status(200).json(false);
    } else {
      return res.status(200).json(true);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export default {
  register,
  login,
  fetchSecurityQues,
  matchSecurityAns,
  changePassword,
  getProviders,
  getRequirements,
  getConnectionRequests,
  isRequestSent,
};
