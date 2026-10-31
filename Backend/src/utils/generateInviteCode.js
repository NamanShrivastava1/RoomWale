import { randomBytes } from "node:crypto";

const generateInviteCode = () => {
  return randomBytes(5).toString("hex").toUpperCase();
};

export default generateInviteCode;
