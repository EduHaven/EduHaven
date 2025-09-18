import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return the first error message in the format expected by frontend
    const firstError = errors.array()[0];
    return res.status(422).json({
      error: firstError.msg,
      field: firstError.param
    });
  }
  next();
};
