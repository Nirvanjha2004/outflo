import { Router } from 'express';
import {
  scrapeLinkedInProfiles,
  getLinkedInProfiles,
  getLinkedInProfileById,
  deleteLinkedInProfileById
} from '../controllers/linkedin.controller';

const router = Router();

router.post('/scrape', scrapeLinkedInProfiles);
router.get('/', getLinkedInProfiles);
router.get('/:id', getLinkedInProfileById);
router.delete('/:id', deleteLinkedInProfileById);

export default router;
