import MessageModel from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    let { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({
        message: "Receiver and content are required",
      });
    }

    if (receiver === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot send messages to yourself",
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

export const getMessage = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await MessageModel.find({
      $or: [
        {
          sender: req.user._id,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.user._id,
        },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
