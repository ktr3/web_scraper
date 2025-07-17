import React, { useState } from 'react';
import { Plus, Globe, Code, Settings } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader } from './ui/Card';
import { api } from '../utils/api';
import { CreateTaskRequest } from '../types';

interface TaskFormProps {
  onTaskCreated: () => void;
  onCancel?: () => void;
}

export function TaskForm({ onTaskCreated, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    url: '',
    selectors: {
      title: '',
      content: '',
    },
    pagination: {
      enabled: false,
      next_button_selector: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.createTask(formData);
      onTaskCreated();
      setFormData({
        url: '',
        selectors: { title: '', content: '' },
        pagination: { enabled: false, next_button_selector: '' },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Plus size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Create New Scraping Task</h2>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Globe size={16} />
              Target Website
            </div>
            <Input
              label="URL"
              type="url"
              value={formData.url}
              onChange={(value) => setFormData(prev => ({ ...prev, url: value }))}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Code size={16} />
              CSS Selectors
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Title Selector"
                value={formData.selectors.title}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  selectors: { ...prev.selectors, title: value }
                }))}
                placeholder="h1, .title, #title"
                required
              />
              <Input
                label="Content Selector"
                value={formData.selectors.content}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  selectors: { ...prev.selectors, content: value }
                }))}
                placeholder="p, .content, .description"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Settings size={16} />
              Pagination Settings
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="pagination-enabled"
                  checked={formData.pagination.enabled}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pagination: { ...prev.pagination, enabled: e.target.checked }
                  }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="pagination-enabled" className="text-sm text-gray-700">
                  Enable pagination support
                </label>
              </div>
              {formData.pagination.enabled && (
                <Input
                  label="Next Button Selector"
                  value={formData.pagination.next_button_selector || ''}
                  onChange={(value) => setFormData(prev => ({
                    ...prev,
                    pagination: { ...prev.pagination, next_button_selector: value }
                  }))}
                  placeholder=".next, [aria-label='Next'], .pagination-next"
                  className="ml-7"
                />
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={loading} icon={Plus} className="flex-1">
              Create Task
            </Button>
            {onCancel && (
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}