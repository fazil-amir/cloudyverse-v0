import { Router } from 'express';
import { testModel } from '@/models/test.model.js';
import { validatePagination, validateTestData } from '@/middleware/validation.middleware.js';
import { generateRandomStringWithTimestamp } from '@/utils/random-string.util.js';

const router = Router();

router.get('/', validatePagination, (req, res) => {
  try {
    const records = testModel.getAll();
    const total = testModel.getCount();
    res.json({ 
      success: true, 
      data: records, 
      pagination: { 
        total, 
        page: 1, 
        limit: records.length 
      } 
    });
  } catch (error) {
    console.error('\n[Test Route Error]\n', error, '\n');
    res.status(500).json({ error: 'Failed to fetch test data' });
  }
});

router.post('/', validateTestData, (req, res) => {
  try {
    const result = testModel.create();
    res.status(201).json({ 
      success: true, 
      message: 'Test data inserted successfully', 
      id: result.lastInsertRowid 
    });
  } catch (error) {
    console.error('\n[Test Route Error]\n', error, '\n');
    res.status(500).json({ error: 'Failed to insert test data' });
  }
});

router.post('/random', (req, res) => {
  try {
    const randomString = generateRandomStringWithTimestamp();
    const result = testModel.create();
    res.status(201).json({ 
      success: true, 
      message: 'Random test data inserted successfully', 
      data: { 
        id: result.lastInsertRowid, 
        random_string: randomString 
      } 
    });
  } catch (error) {
    console.error('\n[Test Route Error]\n', error, '\n');
    res.status(500).json({ error: 'Failed to insert random test data' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID parameter' });
    const result = testModel.deleteById(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('\n[Test Route Error]\n', error, '\n');
    res.status(500).json({ error: 'Failed to delete test data' });
  }
});

export default router; 