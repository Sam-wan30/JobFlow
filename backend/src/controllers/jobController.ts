import { Response, Request } from 'express';
import { prisma } from '../db';
import { createActivity } from './activityController';

export const createJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { companyName, role, location, salary, jobUrl, applicationDate, status } = req.body as any;

    if (!companyName || !role || !status) {
      return res.status(400).json({ message: 'Company name, role, and status are required' });
    }

    const job = await prisma.jobApplication.create({
      data: {
        companyName,
        role,
        location,
        salary,
        jobUrl,
        applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
        status,
        userId,
      },
    });

    // Create initial activity
    await createActivity(job.id, 'Application_Created', `Applied to ${companyName} for ${role} position`);

    return res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getJobs = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { search, status, location } = req.query as any;

    const whereClause: any = { userId };

    if (status) {
      whereClause.status = status as string;
    }

    if (location) {
      whereClause.location = {
        contains: location as string,
        mode: 'insensitive',
      };
    }

    if (search) {
      whereClause.OR = [
        {
          companyName: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
        {
          role: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
      ];
    }

    const jobs = await prisma.jobApplication.findMany({
      where: whereClause,
      include: {
        interviews: true,
        notes: true,
      },
      orderBy: {
        applicationDate: 'desc',
      },
    });

    return res.status(200).json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const job = await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        interviews: {
          orderBy: {
            interviewDate: 'asc',
          },
        },
        notes: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    if (job.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.error('Get job by id error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existingJob = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    if (existingJob.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { companyName, role, location, salary, jobUrl, applicationDate, status } = req.body as any;

    const updatedJob = await prisma.jobApplication.update({
      where: { id },
      data: {
        companyName,
        role,
        location,
        salary,
        jobUrl,
        applicationDate: applicationDate ? new Date(applicationDate) : undefined,
        status,
      },
    });

    return res.status(200).json(updatedJob);
  } catch (error) {
    console.error('Update job error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existingJob = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    if (existingJob.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.jobApplication.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Job application deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Run aggregations
    const jobs = await prisma.jobApplication.findMany({
      where: { userId },
    });

    const totalApplications = jobs.length;
    const activeApplications = jobs.filter(
      (job) => job.status !== 'Offer Received' && job.status !== 'Rejected'
    ).length;
    const offersReceived = jobs.filter((job) => job.status === 'Offer Received').length;
    const rejections = jobs.filter((job) => job.status === 'Rejected').length;

    // Get applications this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const applicationsThisWeek = jobs.filter(
      (job) => new Date(job.applicationDate) >= oneWeekAgo
    ).length;

    // Get count of scheduled interviews
    const now = new Date();
    const interviewsCount = await prisma.interview.count({
      where: {
        jobApplication: {
          userId,
        },
        interviewDate: {
          gte: now,
        },
      },
    });

    // Get pending tasks (applications with upcoming interviews or OA scheduled)
    const pendingTasks = jobs.filter(
      (job) => job.status === 'OA Scheduled' || job.status === 'Interview Scheduled'
    ).length;

    return res.status(200).json({
      totalApplications,
      activeApplications,
      interviewsScheduled: interviewsCount,
      offersReceived,
      rejections,
      applicationsThisWeek,
      pendingTasks,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
