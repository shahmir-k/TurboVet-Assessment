import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { ThemeService } from '../../services/theme.service';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskChartComponent } from '../../components/task-chart/task-chart.component';
import { CreateTaskDto, TaskStatus, TaskCategory } from '@org/data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskListComponent, TaskFormComponent, TaskChartComponent],
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  taskService = inject(TaskService);
  themeService = inject(ThemeService);

  showTaskForm = signal(false);
  editingTask = signal<any>(null);
  filterStatus = '';
  filterCategory = '';

  // Computed values
  filteredTasks = computed(() => {
    let tasks = this.taskService.tasks();
    
    if (this.filterStatus) {
      tasks = tasks.filter(t => t.status === this.filterStatus);
    }
    
    if (this.filterCategory) {
      tasks = tasks.filter(t => t.category === this.filterCategory);
    }
    
    return tasks;
  });

  tasksInProgress = computed(() => 
    this.taskService.tasks().filter(t => t.status === TaskStatus.IN_PROGRESS).length
  );

  tasksCompleted = computed(() => 
    this.taskService.tasks().filter(t => t.status === TaskStatus.DONE).length
  );

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe();
  }

  onEditTask(task: any) {
    this.editingTask.set(task);
    this.showTaskForm.set(true);
  }

  onDeleteTask(taskId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe();
    }
  }

  onSaveTask(taskData: CreateTaskDto) {
    if (this.editingTask()) {
      // Update existing task
      this.taskService.updateTask(this.editingTask().id, taskData).subscribe({
        next: () => {
          this.onCancelForm();
        },
      });
    } else {
      // Create new task
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.onCancelForm();
        },
      });
    }
  }

  onCancelForm() {
    this.showTaskForm.set(false);
    this.editingTask.set(null);
  }

  onUpdateStatus(event: { taskId: string; status: TaskStatus }) {
    this.taskService.updateTask(event.taskId, { status: event.status }).subscribe();
  }
}
