import { TaskStatus, TaskCategory } from '../enums';

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  priority: number;
  userId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

