import express from 'express';
import { scrapedata } from '../controllers/scraper.js';

const router = express.Router();
router.post('/scrape', scrapedata);

export default router;