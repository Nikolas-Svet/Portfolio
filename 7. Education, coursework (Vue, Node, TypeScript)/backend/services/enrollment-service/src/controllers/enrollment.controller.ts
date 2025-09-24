import { Request, Response } from 'express';
import { EnrollmentService } from '../services/enrollment.service';
import { ErrorMessages } from '../utils/consts';
import {AuthRequest} from "../types/auth";
import {publishToQueue} from "../utils/rabbitmq";

export async function createEnrollment(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId as string;
        const { courseId } = req.body;
        const enrollment = await EnrollmentService.enroll(userId, courseId) as any;
        await publishToQueue('enroll_queue', {
            enrollmentId: enrollment._id.toString(),
            userId,
            courseId
        });
        res.status(201).json(enrollment);
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json({ message: ErrorMessages.EnrollmentAlreadyEnrolled });
        }
        console.error(err);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
}

export async function getEnrollmentStatus(req: Request, res: Response) {
    const e = await EnrollmentService.getById(req.params.id) as any;
    if (!e) return res.status(404).json({ message: ErrorMessages.NotFound });
    res.json({ enrollmentId: req.params.id, status: e.status });
}

export async function getEnrollments(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        console.log(req.user)
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const list = await EnrollmentService.listByUser(userId);
        return res.json(list);
    } catch (err) {
        console.error('Error in getEnrollments:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export async function getEnrollmentById(req: Request, res: Response) {
    const enrollment = await EnrollmentService.getById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: ErrorMessages.NotFound });
    res.json(enrollment);
}

export async function completeLesson(req: Request, res: Response) {
    const { id, lessonId } = req.params;
    const updated = await EnrollmentService.completeLesson(id, lessonId);
    if (!updated) return res.status(404).json({ message: ErrorMessages.NotFound });
    res.json(updated);
}

export async function cancelLesson(req: Request, res: Response) {
    const { id, lessonId } = req.params;
    const updated = await EnrollmentService.cancelLesson(id, lessonId);
    if (!updated) return res.status(404).json({ message: ErrorMessages.NotFound });
    res.json(updated);
}

export async function deleteEnrollment(req: Request, res: Response) {
    const ok = await EnrollmentService.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: ErrorMessages.NotFound });
    res.json({ message: ErrorMessages.EnrollmentUnenrolledSuccessfully });
}

export async function countStudents(req: Request, res: Response) {
    const count = await EnrollmentService.countStudents(req.params.courseId);
    res.json({ count });
}