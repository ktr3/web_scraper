import React, { useState } from 'react';
import { Plus, BarChart3, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useTasks } from '../hooks/useTasks';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { tasks, loading, error, refetch, deleteTask } = useTasks();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  const handleTaskCreated = () => {
    setShowCreateModal(false);
    refetch();
  };

  const handleViewTask = (id: string) => {
    navigate(`/task/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Web Scraper Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Manage and monitor your web scraping tasks
              </p>
            </div>
            <Button
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
              size="lg"
              className="shadow-sm"
            >
              New Task
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <TaskList
          tasks={tasks}
          loading={loading}
          onDeleteTask={deleteTask}
          onViewTask={handleViewTask}
        />

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Scraping Task"
          size="lg"
        >
          <TaskForm
            onTaskCreated={handleTaskCreated}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      </div>
    </div>
  );
}