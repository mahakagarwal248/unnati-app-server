import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const connectMail = path.join(__dirname, "../templates/connect.ejs");
const providerDataMail = path.join(__dirname, "../templates/providerData.ejs");

import sendEmail from "./sendEmail.js";
import connectionRequestsSchema from "../models/connectionRequests.js";

const sendEmailFunction = async (req, res) => {
  const data = req.body;
  console.log(data);
  const emailData = {
    userName: data?.userName,
    subject: data?.subject,
    service: data?.service,
    providerName: data?.providerName,
    providerAddress: data?.providerAddress,
    providerExperience: data?.providerExperience,
    providerEmail: data?.providerEmail,
    providerMobile: data?.providerMobile,
  };
  let template;
  if (data?.subject === "Connection Request") {
    template = connectMail;
  } else if (data?.subject === "Provider's Details") {
    template = providerDataMail;
  }
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      template,
      { data: emailData },
      async function (err, results) {
        if (!err) {
          sendEmail(data?.subject, data?.to, results, "new connection");
          if (data?.subject === "Connection Request") {
            const saveRequest = await connectionRequestsSchema.create({
              userId: data?.userId,
              providerId: data?.providerId,
              requirementId: data?.requirementId,
            });
            saveRequest.save();
          }
          resolve();
        } else {
          console.log("Error in rendering email template :", err);
          return resolve();
        }
      }
    );
  });
};

export default sendEmailFunction;
