import { Router, Request, Response } from 'express';
import { TaskModel } from '../models/taskModel';
import { taskQueue } from '../services/taskQueue';
import { validateCreateTask, validateTaskId } from '../middleware/validation';
import { CreateTaskRequest } from '../types';

const router = Router();

// Create a new task
router.post('/', validateCreateTask, async (req: Request, res: Response) => {
  try {
    const taskData: CreateTaskRequest = req.body;
    const task = await TaskModel.create(taskData);
    
    // Add task to processing queue
    taskQueue.addTask(task);
    
    res.status(201).json({
      taskId: task.id,
      status: task.status
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      error: 'Failed to create task'
    });
  }
});

// Get all tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.findAll();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      error: 'Failed to fetch tasks'
    });
  }
});

// Get a specific task
router.get('/:id', validateTaskId, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findById(id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      error: 'Failed to fetch task'
    });
  }
});

// Delete a task
router.delete('/:id', validateTaskId, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await TaskModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      error: 'Failed to delete task'
    });
  }
});

// Export task results
router.get('/:id/export', validateTaskId, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { format } = req.query;
    
    const task = await TaskModel.findById(id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }
    
    if (!task.result || task.result.length === 0) {
      return res.status(400).json({
        error: 'No results available for export'
      });
    }
    
    if (format === 'csv') {
      const csvContent = convertToCSV(task.result);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="task-${id}.csv"`);
      res.send(csvContent);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="task-${id}.json"`);
      res.json(task.result);
    }
  } catch (error) {
    console.error('Error exporting task results:', error);
    res.status(500).json({
      error: 'Failed to export results'
    });
  }
});

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header] || '';
        return `"${value.toString().replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
}

export default router;