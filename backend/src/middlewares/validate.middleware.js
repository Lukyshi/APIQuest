'use strict';

/**
 * Validates req.body against a Zod schema.
 * Throws a ZodError which is caught by the error middleware.
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(result.error); // ZodError — caught by errorMiddleware
  }
  req.body = result.data; // replace with parsed/coerced data
  next();
};

module.exports = validate;
