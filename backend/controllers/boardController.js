const Board = require('../models/Board');
const Pin = require('../models/Pin');

const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ isPrivate: false })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('userId', 'username avatar');

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBoard = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;

    const board = await Board.create({
      name,
      description,
      isPrivate: isPrivate || false,
      userId: req.user._id
    });

    const populatedBoard = await Board.findById(board._id)
      .populate('userId', 'username avatar');

    res.status(201).json(populatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'username avatar');

    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Pin.deleteMany({ boardId: board._id });
    await board.deleteOne();

    res.json({ message: 'Board and all pins removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard
};
