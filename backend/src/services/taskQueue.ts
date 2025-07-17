import { Task } from '../types';
import { scraperService } from './scraperService';

class TaskQueue {
  private queue: Task[] = [];
  private processing = false;

  async addTask(task: Task) {
    this.queue.push(task);
    this.processQueue();
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        try {
          await scraperService.executeTask(task);
        } catch (error) {
          console.error('Error processing task:', error);
        }
      }
    }

    this.processing = false;
  }

  getQueueLength() {
    return this.queue.length;
  }

  isProcessing() {
    return this.processing;
  }
}

export const taskQueue = new TaskQueue();