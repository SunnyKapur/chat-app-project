import MessageModel from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    let { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({
        message: "Receiver and content are required",
      });
    }

    const message = await MessageModel.create({
      sender: req.user._id,
      receiver,
      content,
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
