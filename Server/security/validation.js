import { body } from "express-validator";

// -----------------------------------Auth----------------------

export const signupValidationRules = () => [
  body("FirstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be 2-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name must contain only letters"),

  body("LastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be 2-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name must contain only letters"),

  body("Email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail()
    .custom(async (value) => {
      // Check if email already exists
      const User = (await import('../Model/UserModel.js')).default;
      const existingUser = await User.findOne({ Email: value });
      if (existingUser) {
        throw new Error('Email is already registered');
      }
      return true;
    }),

  body("Password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/^(?=.*[A-Z])/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/^(?=.*\d)/)
    .withMessage("Password must contain at least one number")
    .matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage("Password must contain at least one special character")
    .custom((value) => {
      // Check for common weak passwords
      const commonPasswords = [
        'password', '12345678', 'qwerty', 'abc123', 'password123',
        'admin', 'letmein', 'welcome', 'monkey', '123456789'
      ];
      if (commonPasswords.includes(value.toLowerCase())) {
        throw new Error('Password is too common. Please choose a stronger password');
      }
      return true;
    })
    .custom((value) => {
      // Check for sequential characters (e.g., 123, abc, qwe)
      const sequentialPatterns = [
        /012|123|234|345|456|567|678|789|890/,
        /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/,
        /qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|zxc|xcv|cvb|vbn|bnm/
      ];
      for (const pattern of sequentialPatterns) {
        if (pattern.test(value.toLowerCase())) {
          throw new Error('Password cannot contain sequential characters');
        }
      }
      return true;
    })
    .custom((value) => {
      // Check for repeated characters (e.g., aaaa, 1111)
      if (/(.)\1{3,}/.test(value)) {
        throw new Error('Password cannot contain repeated characters (4 or more in a row)');
      }
      return true;
    }),
];

export const loginValidationRules = () => [
  body("Email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),

  body("Password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ max: 128 })
    .withMessage("Password is too long"),
];

export const forgotPasswordValidationRules = () => [
  body("Email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail()
    .custom(async (value) => {
      // Check if email exists in the system
      const User = (await import('../Model/UserModel.js')).default;
      const existingUser = await User.findOne({ Email: value });
      if (!existingUser) {
        throw new Error('No account found with this email address');
      }
      return true;
    }),
];

export const resetPasswordValidationRules = () => [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/^(?=.*[A-Z])/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/^(?=.*\d)/)
    .withMessage("Password must contain at least one number")
    .matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage("Password must contain at least one special character")
    .custom((value) => {
      // Check for common weak passwords
      const commonPasswords = [
        'password', '12345678', 'qwerty', 'abc123', 'password123',
        'admin', 'letmein', 'welcome', 'monkey', '123456789'
      ];
      if (commonPasswords.includes(value.toLowerCase())) {
        throw new Error('Password is too common. Please choose a stronger password');
      }
      return true;
    }),
];

// -------------------------------Event--------------------
export const createEventValidationRules = () => [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be valid"),
  body("time")
    .notEmpty()
    .withMessage("Time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Time must be in HH:mm format"),
];

export const updateEventValidationRules = () => [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("date").optional().isISO8601().withMessage("Date must be valid"),
  body("time")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Time must be in HH:mm format"),
];

//-------------------------------Note---------------------------

export const createNoteValidationRules = () => [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("content").trim().notEmpty().withMessage("Content is required"),
];

export const updateNoteValidationRules = () => [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("content").optional().trim(),
];

// --------------------------StudySession----------------------

export const createStudySessionValidationRules = () => [
  body("startTime").isISO8601().withMessage("Invalid start time"),
  body("endTime").isISO8601().withMessage("Invalid end time"),
  body("duration")
    .isNumeric()
    .withMessage("Duration must be a number")
    .custom((val) => val > 0)
    .withMessage("Duration must be greater than 0"),
];

// ------------------------------ToDoValiadtion----------------------

export const createTodoValidationRules = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 100 })
      .withMessage("Title can't exceed 100 characters"),
    body("dueDate")
      .notEmpty()
      .withMessage("Due date is required")
      .isISO8601()
      .toDate()
      .withMessage("Due date must be a valid date"),
    body("deadline")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Deadline must be a valid date"),
    body("repeatEnabled")
      .optional()
      .isBoolean()
      .withMessage("repeatEnabled must be boolean"),
    body("repeatType")
      .optional()
      .isIn(["daily", "weekly", "monthly"])
      .withMessage("repeatType must be daily, weekly, or monthly"),
    body("reminderTime")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("reminderTime must be a valid date/time"),
    body("timePreference")
      .optional()
      .isIn(["morning", "afternoon", "evening", "night"])
      .withMessage("timePreference is invalid"),
  ];
};

export const updateTodoValidationRules = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title can't be empty")
      .isLength({ max: 100 })
      .withMessage("Title can't exceed 100 characters"),
    body("dueDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Due date must be a valid date"),
    body("deadline")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Deadline must be a valid date"),
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("completed must be boolean"),
    body("status")
      .optional()
      .isIn(["open", "closed"])
      .withMessage("Status must be open or closed"),
    body("repeatEnabled")
      .optional()
      .isBoolean()
      .withMessage("repeatEnabled must be boolean"),
    body("repeatType")
      .optional()
      .isIn(["daily", "weekly", "monthly"])
      .withMessage("repeatType must be daily, weekly, or monthly"),
    body("reminderTime")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("reminderTime must be a valid date/time"),
    body("timePreference")
      .optional()
      .isIn(["morning", "afternoon", "evening", "night"])
      .withMessage("timePreference is invalid"),
  ];
};

// ------------------------------User's Valiadtion ====================

export const updateProfileValidationRules = () => [
  body("FirstName")
    .optional()
    .isString()
    .withMessage("FirstName must be a string")
    .trim()
    .isLength({ max: 50 })
    .withMessage("FirstName cannot exceed 50 characters"),

  body("LastName")
    .optional()
    .isString()
    .withMessage("LastName must be a string")
    .trim()
    .isLength({ max: 50 })
    .withMessage("LastName cannot exceed 50 characters"),

  body("GraduationYear")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 10 })
    .withMessage("Graduation year is invalid"),

  body("Bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("OtherDetails")
    .optional()
    .custom((value) => {
      if (typeof value !== "object") {
        throw new Error("OtherDetails must be an object");
      }
      const MAX_LENGTH = 1000;
      for (const [key, val] of Object.entries(value)) {
        if (typeof val === "string" && val.length > MAX_LENGTH) {
          throw new Error(
            `${key} in OtherDetails cannot exceed ${MAX_LENGTH} characters`
          );
        }
      }
      return true;
    }),
];
