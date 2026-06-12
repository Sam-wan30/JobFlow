"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivitiesByJob = exports.createActivity = void 0;
const db_1 = require("../db");
const createActivity = async (jobApplicationId, type, description) => {
    try {
        const activity = await db_1.prisma.activity.create({
            data: {
                jobApplicationId,
                type,
                description,
            },
        });
        return activity;
    }
    catch (error) {
        console.error('Create activity error:', error);
        throw error;
    }
};
exports.createActivity = createActivity;
const getActivitiesByJob = async (req, res) => {
    try {
        const userId = req.user?.id;
        const jobApplicationId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Verify job belongs to user
        const job = await db_1.prisma.jobApplication.findUnique({
            where: { id: jobApplicationId },
        });
        if (!job) {
            return res.status(404).json({ message: 'Job application not found' });
        }
        if (job.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const activities = await db_1.prisma.activity.findMany({
            where: { jobApplicationId },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return res.status(200).json(activities);
    }
    catch (error) {
        console.error('Get activities error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getActivitiesByJob = getActivitiesByJob;
