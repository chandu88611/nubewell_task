import express from 'express';
import {
  getAllDocuments,
  searchDocuments,
  uploadDocuments,
} from '../controllers/documentController.js';
import multer from 'multer';

// Configure Multer
const storage = multer.memoryStorage(); // Store files in memory for processing
const upload = multer({ storage });
 

const router = express.Router();

// Route to fetch all documents
router.get('/files', getAllDocuments);

// Route to search documents by query
router.get('/search', searchDocuments);

// Route to upload new documents
router.post('/files',upload.array('files'), uploadDocuments);

export default router;
