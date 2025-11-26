import express from 'express';
import ChatMessage from '../models/ChatMessage.js';
import Conversation from '../models/Conversation.js';
import { protect } from '../middleware/auth.js';
import { validateMessage, validateMongoId } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/chats/conversations
// @desc    Create a new conversation
// @access  Private
router.post('/conversations', async (req, res) => {
  try {
    const { participantId, type, title } = req.body;

    const participants = [req.user.id];
    if (participantId) {
      participants.push(participantId);
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants },
      type: type || 'ai'
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        message: 'Conversation already exists',
        data: existingConversation
      });
    }

    const conversation = await Conversation.create({
      participants,
      type: type || 'ai',
      title: title || 'New Conversation'
    });

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating conversation',
      error: error.message
    });
  }
});

// @route   GET /api/chats/conversations
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations', async (req, res) => {
  try {
    const { type } = req.query;

    const query = {
      participants: req.user.id,
      isActive: true
    };

    if (type) {
      query.type = type;
    }

    const conversations = await Conversation.find(query)
      .populate('participants', 'name avatar')
      .sort('-lastMessageAt');

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
});

// @route   GET /api/chats/conversations/:id
// @desc    Get single conversation
// @access  Private
router.get('/conversations/:id', validateMongoId, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user.id
    }).populate('participants', 'name avatar email');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
});

// @route   DELETE /api/chats/conversations/:id
// @desc    Delete conversation
// @access  Private
router.delete('/conversations/:id', validateMongoId, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Soft delete - mark as inactive
    conversation.isActive = false;
    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting conversation',
      error: error.message
    });
  }
});

// @route   POST /api/chats/:conversationId/messages
// @desc    Send a message in a conversation
// @access  Private
router.post('/:conversationId/messages', validateMessage, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message, type, isAI, receiverId } = req.body;

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const chatMessage = await ChatMessage.create({
      conversationId,
      senderId: req.user.id,
      receiverId,
      message,
      type: type || 'text',
      isAI: isAI || false
    });

    // Update conversation
    conversation.lastMessage = message.substring(0, 100);
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await ChatMessage.findById(chatMessage._id)
      .populate('senderId', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
});

// @route   GET /api/chats/:conversationId/messages
// @desc    Get all messages in a conversation
// @access  Private
router.get('/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await ChatMessage.find({ conversationId })
      .populate('senderId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await ChatMessage.countDocuments({ conversationId });

    // Mark messages as read
    await ChatMessage.updateMany(
      {
        conversationId,
        receiverId: req.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: messages.reverse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
});

// @route   GET /api/chats/messages/unread
// @desc    Get unread message count
// @access  Private
router.get('/messages/unread', async (req, res) => {
  try {
    const count = await ChatMessage.countDocuments({
      receiverId: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
});

// @route   PATCH /api/chats/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.patch('/messages/:id/read', validateMongoId, async (req, res) => {
  try {
    const message = await ChatMessage.findOne({
      _id: req.params.id,
      receiverId: req.user.id
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking message as read',
      error: error.message
    });
  }
});

// @route   DELETE /api/chats/messages/:id
// @desc    Delete message
// @access  Private
router.delete('/messages/:id', validateMongoId, async (req, res) => {
  try {
    const message = await ChatMessage.findOne({
      _id: req.params.id,
      senderId: req.user.id
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or unauthorized'
      });
    }

    await ChatMessage.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
});

export default router;
