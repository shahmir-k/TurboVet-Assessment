import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITask, TaskStatus } from '@org/data';

@Component({
  selector: 'app-task-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-chart.component.html',
  styles: [],
})
export class TaskChartComponent {
  @Input() tasks: ITask[] = [];

  get totalTasks(): number {
    return this.tasks.length;
  }

  get todoCount(): number {
    return this.tasks.filter(t => t.status === TaskStatus.TODO).length;
  }

  get inProgressCount(): number {
    return this.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  }

  get doneCount(): number {
    return this.tasks.filter(t => t.status === TaskStatus.DONE).length;
  }

  get todoPercentage(): number {
    return this.totalTasks > 0 ? Math.round((this.todoCount / this.totalTasks) * 100) : 0;
  }

  get inProgressPercentage(): number {
    return this.totalTasks > 0 ? Math.round((this.inProgressCount / this.totalTasks) * 100) : 0;
  }

  get donePercentage(): number {
    return this.totalTasks > 0 ? Math.round((this.doneCount / this.totalTasks) * 100) : 0;
  }
}

