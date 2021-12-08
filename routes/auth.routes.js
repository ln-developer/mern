const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken"); // формирует токен
const bcrypt = require("bcrypt"); // хеширует строки
const User = require("../models/User");
const config = require("config");

// /api/auth/registration
router.post(
  "/registration",
  // массив middlewares проверка данных пользователя на валидность
  [
    check("email", "Invalid email adress").isEmail(),
    check("password", "Minimum password length 9 characters").isLength({
      min: 9,
    }),
  ],
  async (req, res) => {
    try {
      // получаем ошибки при невалидных данных
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect user data",
        });
      }

      // получаем данные пользователя с фронта
      const { email, password } = req.body;
      // проверяем существует ли уже пользователь с таким email
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: "User already exists" });
      }

      // хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 12);
      // передаем данные пользователя
      const user = new User({ email, password: hashedPassword });

      // сохраняем пользователя
      await user.save();

      res.status(201).json({ message: "User created" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong! Try again" });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [
    check("email", "Invalid email adress").normalizeEmail().isEmail(),
    check("password", "Incorrect password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect user data",
        });
      }

      const { email, password } = req.body;

      // проверяем, есть ли такой пользователь
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // проверяем совпадают ли строки пароля
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect user password" });
      }

      // получаем токен
      const token = jwt.sign({ userID: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });

      // отправлям данные пользователя
      res.json({ token, userID: user.id });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong! Try again" });
    }
  }
);

module.exports = router;
