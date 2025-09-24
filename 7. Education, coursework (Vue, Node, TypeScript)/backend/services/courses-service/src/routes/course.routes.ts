import { Router } from "express";
import {
    getMyCourses,
    getCourses,
    getCourseById,
    createCourse,
    updateCourseById,
    deleteCourseById,
    getCategories
} from "../controllers/course.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get('/my', authenticateJWT, getMyCourses as any);
router.get('/categories', getCategories);

router.post('/', authenticateJWT, upload.single('image'), createCourse);
router.get('/', getCourses);

router.get(
    '/:id([0-9a-fA-F]{24})',
    authenticateJWT,
    getCourseById
);
router.put(
    '/:id([0-9a-fA-F]{24})',
    authenticateJWT,
    upload.single('image'),
    updateCourseById
);
router.delete(
    '/:id([0-9a-fA-F]{24})',
    authenticateJWT,
    deleteCourseById
);

export default router;
