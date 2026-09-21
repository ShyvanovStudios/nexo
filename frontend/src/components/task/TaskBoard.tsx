import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';
import { BlockTaskModal } from './BlockTaskModal';
import { TaskStatus } from '../../types';
import type { Task, BlockTaskPayload } from '../../types';

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskMove: (taskId: number, newStatus: string) => void;
  onTaskBlock: (taskId: number, payload: BlockTaskPayload) => void;
}

const COLUMNS: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.BLOCKED,
  TaskStatus.DONE,
];

export function TaskBoard({ tasks, onTaskClick, onTaskMove, onTaskBlock }: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [blockModal, setBlockModal] = useState<{ open: boolean; taskId: number | null }>({
    open: false,
    taskId: null,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const tasksByStatus = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const status of COLUMNS) {
      map[status] = tasks
        .filter((t) => t.status === status)
        .sort((a, b) => {
          // Overdue first, then by effective_priority_score desc, then by position
          const aOverdue = a.effective_priority_score >= 99 ? 1 : 0;
          const bOverdue = b.effective_priority_score >= 99 ? 1 : 0;
          if (bOverdue !== aOverdue) return bOverdue - aOverdue;
          if (b.effective_priority_score !== a.effective_priority_score)
            return b.effective_priority_score - a.effective_priority_score;
          return a.position - b.position;
        });
    }
    return map;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as number;
    const targetStatus = over.id as string;

    // If dropped on a column
    if (COLUMNS.includes(targetStatus as TaskStatus)) {
      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.status === targetStatus) return;

      if (targetStatus === TaskStatus.BLOCKED) {
        setBlockModal({ open: true, taskId });
      } else {
        onTaskMove(taskId, targetStatus);
      }
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {COLUMNS.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status] || []}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
        </DragOverlay>
      </DndContext>

      <BlockTaskModal
        open={blockModal.open}
        onConfirm={(payload) => {
          if (blockModal.taskId) {
            onTaskBlock(blockModal.taskId, payload);
          }
          setBlockModal({ open: false, taskId: null });
        }}
        onCancel={() => setBlockModal({ open: false, taskId: null })}
      />
    </>
  );
}
