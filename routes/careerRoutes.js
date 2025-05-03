import express from 'express';
import {
  createJobOpening,
  deleteJobOpening,
  getAllJobOpenings,
  getJobBySlug,
  updateJobOpening,
} from '../controllers/careerController.js';

const router = express.Router();

router.post('/create', createJobOpening);
router.get('/get', getAllJobOpenings);
router.get('/:slug', getJobBySlug);
router.put('/update/:slug', updateJobOpening);
router.delete('/delete/:slug', deleteJobOpening);


export default router;
