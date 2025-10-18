import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ITask, TaskStatus } from '@org/data';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './task-list.component.html',
  styles: [],
})
export class TaskListComponent {
  @Input() set tasks(value: ITask[]) {
    this._tasks = value;
    this.updateTaskLists();
  }
  get tasks(): ITask[] {
    return this._tasks;
  }
  
  private _tasks: ITask[] = [];
  
  @Input() canEdit = false;
  @Output() editTask = new EventEmitter<ITask>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() updateStatus = new EventEmitter<{ taskId: string; status: TaskStatus }>();

  todoTasks: ITask[] = [];
  inProgressTasks: ITask[] = [];
  doneTasks: ITask[] = [];

  private updateTaskLists() {
    this.todoTasks = this._tasks.filter(t => t.status === TaskStatus.TODO);
    this.inProgressTasks = this._tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
    this.doneTasks = this._tasks.filter(t => t.status === TaskStatus.DONE);
  }

  drop(event: CdkDragDrop<ITask[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      // Same column - just reorder (no backend update needed)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Different column - transfer item and update backend
      const task = event.previousContainer.data[event.previousIndex];
      
      // Visually move the item between lists
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Update the backend with new status
      this.updateStatus.emit({
        taskId: task.id,
        status: newStatus as TaskStatus,
      });
    }
  }

  getCategoryClass(category: string): string {
    const classes = {
      work: 'bg-blue-100 text-blue-800',
      personal: 'bg-purple-100 text-purple-800',
      urgent: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return classes[category as keyof typeof classes] || classes.other;
  }
}
