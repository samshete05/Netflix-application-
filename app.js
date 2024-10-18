const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const NetFlix_Users = require("./model/SignupModel")
const connectDB = require('./db/db');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { createToken,verifyToken } = require('./jwt')


const router = express();
const JWT_SECRET = "your_jwt_secret_key";


// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from headers
  
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
  
      req.user = user; // Set the user from token payload
      next();
    });
  };

// Connect to the database
connectDB();

router.use(cors());
router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/signup',async (req, res) => {
     let signupdata = await NetFlix_Users.find()
     if(signupdata.length>0){
        res.send(signupdata)
     }else{
        res.send("No users available.")
     }
});

// Signup
router.post('/signup', async (req, res) => {
    const { emailaddress, password, useraddress, usercity, userpincode, userstate } = req.body;
    console.log(req.body);

    try {
        const existingUser = await NetFlix_Users.findOne({ emailaddress });
        if (existingUser) {
            return res.json({ status: 'error', error: 'Email is already taken.' });
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        const newUser = new NetFlix_Users({
            emailaddress,
            password: hash,
            useraddress,
            usercity,
            userpincode,
            userstate
        });

        await newUser.save();
        const token = createToken(newUser.id);
        res.json(token)
        console.log(token)
      }catch (err) {
        console.error("Error saving user:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { emailaddress, password } = req.body;
    console.log(req.body);
    try {
        const user = await NetFlix_Users.findOne({ emailaddress });
        console.log(user)
        if (!user) {
            console.log("User not found")
            return res.status(404).json({ message: "User not found" });
            return;
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log("Unmatched")
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        console.log("Login",token)
        res.json({ message: "Login successfully", token });
    } catch (err) {
        console.error("Error in login route:", err);
        res.status(500).json({ status: "error", error: "Internal Server Error" });
    }
});

router.delete('/delete-user', authenticateToken, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'An error occurred while deleting the user' });
  }
});


router.listen(5000, () => {
    console.log("Server is running on port 5000");
});
