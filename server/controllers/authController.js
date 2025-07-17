const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
exports.signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashedPassword });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (error) {
    next(error); 
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body; 

    const user = await User.findOne({ username }); // 👈 find by username
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { username: user.username, id: user._id } });
  } catch (error) {
    next(error);
  }
};



/* try{
let user = await User.findOne({ username });
if (!user) user = await User.create({ username });
res.json(user);
); catch (error) {
    res.status(500).json({ error: error.message})
} */