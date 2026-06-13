import { Response, Request } from 'express';
import { prisma } from '../db';

export const createActivity = async (jobApplicationId: string, type: string, description?: string) => {
  try {
    const activity = await prisma.activity.create({
      data: {
        jobApplicationId,
        type,
        description,
      },
    });
    return activity;
  } catch (error) {
    console.error('Create activity error:', error);
    throw error;
  }
};

export const getActivitiesByJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const jobApplicationId = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify job belongs to user
    const job = await prisma.jobApplication.findUnique({
      where: { id: jobApplicationId },
    });

    if (!job) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    if (job.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const activities = await prisma.activity.findMany({
      where: { jobApplicationId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
