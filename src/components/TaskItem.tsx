import React from 'react';
import { ExternalLink, Download, Trash2, Eye } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { StatusBadge } from './ui/StatusBadge';
import { Task } from '../types';
import { formatDate, getRelativeTime } from '../utils/dateUtils';
import { api } from '../utils/api';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function TaskItem({ task, onDelete, onView }: TaskItemProps) {
  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const blob = await api.exportResults(task.id, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `task-${task.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Card hover className="transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={task.status} />
              <span className="text-sm text-gray-500" title={formatDate(task.created_at)}>
                {getRelativeTime(task.created_at)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-medium text-gray-900 truncate" title={task.url}>
                {new URL(task.url).hostname}
              </h3>
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div>
                <span className="font-medium">Title:</span> {task.selectors.title}
              </div>
              <div>
                <span className="font-medium">Content:</span> {task.selectors.content}
              </div>
            </div>

            {task.pagination.enabled && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Pagination:</span> Enabled
                {task.pagination.next_button_selector && (
                  <span className="ml-2">({task.pagination.next_button_selector})</span>
                )}
              </div>
            )}

            {task.result && task.result.length > 0 && (
              <div className="mt-3 text-sm text-green-600">
                ✓ {task.result.length} items scraped
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="ghost"
              icon={Eye}
              onClick={() => onView(task.id)}
            >
              View
            </Button>
            
            {task.status === 'completed' && task.result && task.result.length > 0 && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleExport('json')}
                  title="Export as JSON"
                >
                  JSON
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleExport('csv')}
                  title="Export as CSV"
                >
                  CSV
                </Button>
              </div>
            )}
            
            <Button
              size="sm"
              variant="danger"
              icon={Trash2}
              onClick={() => onDelete(task.id)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}