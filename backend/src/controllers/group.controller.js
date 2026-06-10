import GroupModel from "../models/group.model.js";

// Jab frontend se user "Create Group" button click karega, tab backend ko:
// Group ka naam lena hai
// Group ke members lena hai
// Jo group bana raha hai usko admin banana hai
// Group ko database me save karna hai
// Response bhejna hai ki group successfully create ho gaya

// create groups
export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    // Admin ko bhi members mein dalo
    const allMembers = [...new Set([...members, req.user._id.toString()])];

    const group = await GroupModel.create({
      name,
      members: allMembers,
      admin: req.user._id,
    });

    return res.status(201).json({
      message: "Group created",
      group,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// My all groups
export const getMyGroups = async (req, res) => {
  try {
    const groups = await GroupModel.find({ members: req.user._id })
      .populate("members", "username")
      .populate("admin", "username");

    return res.status(200).json({
      groups,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Jab group chat me koi user message bhejega:
// Sunny → "Hello Guys"
// To hume:
// Group dhoondhna hai
// Message group ke messages array me add karna hai
// Naya message frontend ko wapas bhejna hai
// Ye pura kaam sendGroupMessage controller kar raha hai.

// User sends message
//         ↓
// Group find karo
//         ↓
// Message messages array me push karo
//         ↓
// Updated group lao
//         ↓
// Last message nikalo
//         ↓
// Frontend ko bhej do

// Group message bejo
export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;

    const group = await GroupModel.findByIdAndUpdate(
      groupId,
      {
        $push: { messages: { sender: req.user._id, content } },
      },
      { returnDocument: "after" },
    ).populate("messages.sender", "username");

    const lastMsg = group.messages[group.messages.length - 1];

    return res.status(201).json({
      message: "Message sent",
      data: lastMsg,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Jab user kisi group par click karega:
// MERN Group
// To frontend ko us group ke purane saare messages chahiye honge.
// Jaise WhatsApp me chat open karte hi purani chat load ho jaati hai.
// Usi kaam ke liye ye controller hai.
// "Kisi specific group ke saare messages database se laane ke liye."

// Group message lao
export const getGroupMessages = async (req, res) => {
  try {
    const group = await GroupModel.findById(req.params.groupId).populate(
      "messages.sender",
      "username",
    );

    return res.status(200).json({ messages: group.messages });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// createGroup
// Naya group create karta hai aur creator ko admin/member banata hai.
// sendGroupMessage
// Group ke messages array me naya message add karta hai.
// getGroupMessages
// Group ke saare messages fetch karke frontend ko bhejta hai.
