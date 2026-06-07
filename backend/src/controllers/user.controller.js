import UserModel from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    // _id: {$ne: req.user._id}
    // _id != sunny (jo login account hai wo account ko chor ke sara users isme show kare matlb login jis account se kare gen wo thodi na all users account chat mai show kare ga (mera chor ke baki sub ka aajaye) )

    let users = await UserModel.find({
      _id: { $ne: req.user._id },
    }).select("-password");

    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
