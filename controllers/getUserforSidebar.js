import User from "../models/userSchema.js";

export const getUserForSidebar = async (req, res) => {
  try {

    console.log("req.existingUser._id", req.existingUser._id)
    const loggedUserId = req.existingUser._id;

    const filteredUser = await User.find({ _id : { $ne: loggedUserId } }).select(
      "-password"
    );

    console.log("{ _id : { $ne: loggedUserId }", { _id : { $ne: loggedUserId }})

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
