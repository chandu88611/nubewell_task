import Document from '../models/documentSchema.js';

 
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find({}, 'fileName lastModified content'); // Select specific fields
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
};

 
export const searchDocuments = async (req, res) => {
  const query = req.query.q; 

  if (!query) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  try {
    const documents = await Document.find(
      { $text: { $search: query } },  
      { score: { $meta: 'textScore' } }  
    ).sort({ score: { $meta: 'textScore' } });  

    if (documents.length === 0) {
      return res.status(404).json({ message: 'No documents found' });
    }

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error searching documents', error });
  }
};

 
export const uploadDocuments = async (req, res) => {
    try {
  
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files provided' });
      }
      req.files.map((file)=>(

          console.log(file)
      ))
      // Process and save each file
      const documents = req.files.map((file) => ({
        fileName: file.originalname,
        content: file.buffer.toString('utf-8'),  
        lastModified: new Date(),
      }));
  
      const insertedFiles = await Document.insertMany(documents); // Save documents to MongoDB
      res.status(201).json({ message: 'Files uploaded successfully', files: insertedFiles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error uploading files', error });
    }
  };