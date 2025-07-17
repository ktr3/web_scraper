import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, ExternalLink, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Task, ScrapingResult } from '../types';
import { api } from '../utils/api';
import { formatDate } from '../utils/dateUtils';

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const taskData = await api.getTask(id);
        setTask(taskData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
    
    // Poll for updates if task is not completed
    const interval = setInterval(() => {
      if (task && (task.status === 'pending' || task.status === 'in_progress')) {
        fetchTask();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [id, task?.status]);

  const handleExport = async (format: 'csv' | 'json') => {
    if (!task) return;
    
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <RefreshCw size={20} className="animate-spin" />
          Loading task details...
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Task not found'}</p>
            <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/')}
            className="mb-4"
          >
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
              <p className="mt-1 text-gray-600">Created {formatDate(task.created_at)}</p>
            </div>
            <div className="flex gap-3">
              {task.status === 'completed' && task.result && task.result.length > 0 && (
                <>
                  <Button variant="secondary" onClick={() => handleExport('json')}>
                    Export JSON
                  </Button>
                  <Button variant="secondary" onClick={() => handleExport('csv')}>
                    Export CSV
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Task Configuration</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <StatusBadge status={task.status} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target URL</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 truncate flex-1">{task.url}</span>
                    <a
                      href={task.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CSS Selectors</label>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Title:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">{task.selectors.title}</code>
                        <button
                          onClick={() => copyToClipboard(task.selectors.title)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Content:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">{task.selectors.content}</code>
                        <button
                          onClick={() => copyToClipboard(task.selectors.content)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pagination</label>
                  <p className="text-sm text-gray-600">
                    {task.pagination.enabled ? (
                      <>
                        Enabled
                        {task.pagination.next_button_selector && (
                          <span className="block text-xs text-gray-500 mt-1">
                            Next: {task.pagination.next_button_selector}
                          </span>
                        )}
                      </>
                    ) : (
                      'Disabled'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Scraped Results</h2>
                  {task.result && task.result.length > 0 && (
                    <span className="text-sm text-gray-600">
                      {task.result.length} items found
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {task.status === 'pending' || task.status === 'in_progress' ? (
                  <div className="text-center py-12">
                    <RefreshCw size={48} className="mx-auto text-blue-600 animate-spin mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {task.status === 'pending' ? 'Task Pending' : 'Scraping in Progress'}
                    </h3>
                    <p className="text-gray-600">
                      {task.status === 'pending' 
                        ? 'Your task is queued and will start soon'
                        : 'Please wait while we scrape the website'
                      }
                    </p>
                  </div>
                ) : task.status === 'failed' ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Task Failed</h3>
                    <p className="text-gray-600">
                      The scraping task encountered an error and could not be completed.
                    </p>
                  </div>
                ) : !task.result || task.result.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                    <p className="text-gray-600">
                      The scraping completed but no data was found matching your selectors.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {task.result.map((item: ScrapingResult, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{item.title || 'No title'}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.content || 'No content'}
                        </p>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-2"
                          >
                            <ExternalLink size={14} />
                            View Source
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}