import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const signupUser = async (req, res) => {
  try {

    const {  fullname, username, password, confirmPassword, gender } = req.body;

    // Validate required fields
    if (!fullname || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }


    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Check if the username already exists
    const user = await User.findOne({ username });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "username already exists!",
      });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Set profile picture based on gender
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // Create a new user
    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: "User created successfully!",
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};



// login the user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if all credentials are provided
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all credentials!",
      });
    }

  
    // Find user by userName
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
       return res.status(404).json({
          success: false,
          message: "User not found, please sign up first!",
      });
    }

    // Check if password is valid
    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Password doesn't match!",
      });
    }

    // Token generation
    const token = jwt.sign(
      { _id: existingUser._id, username: existingUser.username }, // Payload
      process.env.JWT_SECRET_KEY, // Secret key
      { expiresIn: "24h" } // Token expiration time
    );



    // Set the token in a secure HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the token
      secure: true,  // Ensure this is true for production (HTTPS)
      sameSite: "None",
      maxAge: 3 * 24 * 60 * 60 * 1000, // Cookie expiration time (3 days in milliseconds)
    });

    console.log("res.cookie", res.cookie())

    // Respond with a success message (no need to return the token if stored in cookie)
    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      _id : existingUser._id,
      fullname:existingUser.fullname,
      username: existingUser.username,
      profilePic:existingUser.profilePic,
      token
    });
  } catch (error) {
    console.error("Error from login controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error:error.message
    });
  }
};



// logout 
export const logoutUser = (req, res) => {
  try {
    // Clear the token cookie by setting an empty cookie with immediate expiration
    res.clearCookie("token", {
      httpOnly: true, // Same as the login cookie setup
      secure: process.env.NODE_ENV === "production", // Same as the login cookie setup
      sameSite: "Strict", // Optional: sameSite setting for CSRF protection
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully!",
    });
  } catch (error) {
    console.error("Error from logout controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};


