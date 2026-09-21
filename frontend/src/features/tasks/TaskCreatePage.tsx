import { useNavigate } from 'react-router-dom';
import { TaskForm } from '../../components/task/TaskForm';
import { useCreateTask } from '../../hooks/useTasks';
import { useScopes } from '../../hooks/useScopes';
import { useTags } from '../../hooks/useTags';

export function TaskCreatePage() {
  const navigate = useNavigate();
  const createTask = useCreateTask();
  const { data: scopes = [] } = useScopes();
  const { data: tags = [] } = useTags();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Nueva tarea</h1>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <TaskForm
          scopes={scopes}
          tags={tags}
          isLoading={createTask.isPending}
          onSubmit={(data) => {
            createTask.mutate(data, {
              onSuccess: () => navigate('/tareas'),
            });
          }}
          onCancel={() => navigate('/tareas')}
        />
      </div>
    </div>
  );
}
