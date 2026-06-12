import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const createNote = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { jobApplicationId, type, content } = req.body;

    if (!jobApplicationId || !type || !content) {
      return res.status(400).json({ message: 'Job application ID, type, and content are required' });
    }

    const job = await prisma.jobApplication.findUnique({
      where: { id: jobApplicationId },
    });

    if (!job || job.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to job application' });
    }

    const note = await prisma.note.create({
      data: {
        jobApplicationId,
        type, // personal, research, preparation
        content,
      },
    });

    return res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const note = await prisma.note.findUnique({
      where: { id },
      include: { jobApplication: true },
    });

    if (!note || note.jobApplication.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to note' });
    }

    const { type, content } = req.body;

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        type,
        content,
      },
    });

    return res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Update note error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const note = await prisma.note.findUnique({
      where: { id },
      include: { jobApplication: true },
    });

    if (!note || note.jobApplication.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to note' });
    }

    await prisma.note.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
