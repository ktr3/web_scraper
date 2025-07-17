import { pool } from '../utils/database';
import { Task, CreateTaskRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class TaskModel {
  static async create(taskData: CreateTaskRequest): Promise<Task> {
    const id = uuidv4();
    const query = `
      INSERT INTO tasks (id, url, selectors, pagination, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      id,
      taskData.url,
      JSON.stringify(taskData.selectors),
      JSON.stringify(taskData.pagination),
      'pending',
      new Date(),
      new Date()
    ];

    const result = await pool.query(query, values);
    return this.mapDbRowToTask(result.rows[0]);
  }

  static async findAll(): Promise<Task[]> {
    const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows.map(this.mapDbRowToTask);
  }

  static async findById(id: string): Promise<Task | null> {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapDbRowToTask(result.rows[0]);
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM tasks WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  static async updateStatus(
    id: string, 
    status: Task['status'], 
    result?: any[], 
    errorMessage?: string
  ): Promise<void> {
    const updateFields: string[] = ['status = $2', 'updated_at = $3'];
    const values: any[] = [id, status, new Date()];
    let paramCount = 3;

    if (result) {
      updateFields.push(`result = $${++paramCount}`);
      values.push(JSON.stringify(result));
    }

    if (errorMessage) {
      updateFields.push(`error_message = $${++paramCount}`);
      values.push(errorMessage);
    }

    const query = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = $1`;
    await pool.query(query, values);
  }

  private static mapDbRowToTask(row: any): Task {
    return {
      id: row.id,
      url: row.url,
      selectors: typeof row.selectors === 'string' ? JSON.parse(row.selectors) : row.selectors,
      pagination: typeof row.pagination === 'string' ? JSON.parse(row.pagination) : row.pagination,
      status: row.status,
      result: row.result ? (typeof row.result === 'string' ? JSON.parse(row.result) : row.result) : undefined,
      error_message: row.error_message,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}