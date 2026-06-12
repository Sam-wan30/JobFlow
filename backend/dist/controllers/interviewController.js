"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterviews = exports.deleteInterview = exports.updateInterview = exports.scheduleInterview = void 0;
const db_1 = require("../db");
const scheduleInterview = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { jobApplicationId, interviewDate, interviewTime, interviewerName, meetingLink, interviewNotes } = req.body;
        if (!jobApplicationId || !interviewDate) {
            return res.status(400).json({ message: 'Job application ID and interview date are required' });
        }
        const job = await db_1.prisma.jobApplication.findUnique({
            where: { id: jobApplicationId },
        });
        if (!job || job.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized access to job application' });
        }
        const interview = await db_1.prisma.interview.create({
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
    }
    catch (error) {
        console.error('Schedule interview error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.scheduleInterview = scheduleInterview;
const updateInterview = async (req, res) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const interview = await db_1.prisma.interview.findUnique({
            where: { id },
            include: { jobApplication: true },
        });
        if (!interview || interview.jobApplication.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized access to interview' });
        }
        const { interviewDate, interviewTime, interviewerName, meetingLink, interviewNotes } = req.body;
        const updatedInterview = await db_1.prisma.interview.update({
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
    }
    catch (error) {
        console.error('Update interview error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateInterview = updateInterview;
const deleteInterview = async (req, res) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const interview = await db_1.prisma.interview.findUnique({
            where: { id },
            include: { jobApplication: true },
        });
        if (!interview || interview.jobApplication.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized access to interview' });
        }
        await db_1.prisma.interview.delete({
            where: { id },
        });
        return res.status(200).json({ message: 'Interview deleted successfully' });
    }
    catch (error) {
        console.error('Delete interview error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteInterview = deleteInterview;
const getInterviews = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const interviews = await db_1.prisma.interview.findMany({
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
    }
    catch (error) {
        console.error('Get interviews error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getInterviews = getInterviews;
