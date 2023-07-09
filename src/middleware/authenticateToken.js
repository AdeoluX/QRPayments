const httpStatus = require("http-status");
const { abortIf } = require("../utils/responder");
const { verifyToken } = require("../utils/tokenManagement");

const verify = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  abortIf(!token || token == "", httpStatus.FORBIDDEN, "You shall not pass");
  const data = verifyToken(token);
  abortIf(!data, httpStatus.FORBIDDEN, "You shall not pass");
  req.auth = data;
  next();
};

const verifyAdmin = (req, res, next) => {
  abortIf(
    !req.headers["authorization"],
    httpStatus.FORBIDDEN,
    "token expired please login"
  );
  const token = req.headers["authorization"]?.split(" ")[1];
  abortIf(
    !token || token == "",
    httpStatus.FORBIDDEN,
    "token expired please login"
  );
  const data = verifyToken(token);
  abortIf(
    !data || data.role !== "admin",
    httpStatus.FORBIDDEN,
    "you are unauthorized"
  );
  req.auth = data;
  next();
};

const verifyProvider = (req, res, next) => {
  abortIf(
    !req.headers["authorization"],
    httpStatus.FORBIDDEN,
    "token expired please login"
  );
  const token = req.headers["authorization"]?.split(" ")[1];
  abortIf(
    !token || token == "",
    httpStatus.FORBIDDEN,
    "token expired please login"
  );
  const data = verifyToken(token);
  abortIf(
    !data || !data["provider_id"],
    httpStatus.FORBIDDEN,
    "token expired please login"
  );
  req.auth = data;
  next();
};

module.exports = {
  verify,
  verifyProvider,
  verifyAdmin,
};
