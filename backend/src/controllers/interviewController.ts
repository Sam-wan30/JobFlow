import { Response, Request } from 'express';
import { prisma } from '../db';

export const scheduleInterview = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { jobApplicationId, interviewDate, interviewTime, interviewerName, meetingLink, interviewNotes } = req.body as any;

    if (!jobApplicationId || !interviewDate) {
      return res.status(400).json({ message: 'Job application ID and interview date are required' });
    }

    const job = await prisma.jobApplication.findUnique({
      where: { id: jobApplicationId },
    });

    if (!job || job.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to job application' });
    }

    const interview = await prisma.interview.create({
      data: {
        jobApplicationId,
        interviewDate: new Date(interviewDate),
        interviewTime,
        interviewerName,
        meetingLink,
        interviewNotes,
      },
    });

    return res.status(201).json(interview);
  } catch (error) {
    console.error('Schedule interview error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateInterview = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const interview = await prisma.interview.findUnique({
      where: { id },
      include: { jobApplication: true },
    });

    if (!interview || interview.jobApplication.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to interview' });
    }

    const { interviewDate, interviewTime, interviewerName, meetingLink, interviewNotes } = req.body as any;

    const updatedInterview = await prisma.interview.update({
      where: { id },
      data: {
        interviewDate: interviewDate ? new Date(interviewDate) : undefined,
        interviewTime,
        interviewerName,
        meetingLink,
        interviewNotes,
      },
    });

    return res.status(200).json(updatedInterview);
  } catch (error) {
    console.error('Update interview error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteInterview = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const interview = await prisma.interview.findUnique({
      where: { id },
      include: { jobApplication: true },
    });

    if (!interview || interview.jobApplication.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to interview' });
    }

    await prisma.interview.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete interview error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getInterviews = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const interviews = await prisma.interview.findMany({
      where: {
        jobApplication: {
          userId,
        },
      },
      include: {
        jobApplication: {
          select: {
            companyName: true,
            role: true,
            status: true,
          },
        },
      },
      orderBy: {
        interviewDate: 'asc',
      },
    });

    return res.status(200).json(interviews);
  } catch (error) {
    console.error('Get interviews error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
