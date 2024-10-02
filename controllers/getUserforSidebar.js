import User from "../models/userSchema.js";

export const getUserForSidebar = async (req, res) => {
  try {

  
    const loggedUserId = req.existingUser._id;

    const filteredUser = await User.find({ _id : { $ne: loggedUserId } }).select(
      "-password"
    );

  
    res.status(200).json({
      success: true,
      message: " all user retrived successfully !",
      filteredUser,
    });
  } catch (error) {
    console.log("error from getAll users controller", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
