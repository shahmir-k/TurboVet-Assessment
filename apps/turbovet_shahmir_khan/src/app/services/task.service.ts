import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CreateTaskDto, UpdateTaskDto, ITask } from '@org/data';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/tasks';

  // Signal for reactive task list
  tasks = signal<ITask[]>([]);
  loading = signal(false);

  getAllTasks(): Observable<ITask[]> {
    this.loading.set(true);
    return this.http.get<ITask[]>(this.apiUrl).pipe(
      tap((tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      })
    );
  }

  getTask(id: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.apiUrl}/${id}`);
  }

  createTask(taskDto: CreateTaskDto): Observable<ITask> {
    return this.http.post<ITask>(this.apiUrl, taskDto).pipe(
      tap((newTask) => {
        // Add to local state
        this.tasks.update((tasks) => [newTask, ...tasks]);
      })
    );
  }

  updateTask(id: string, taskDto: UpdateTaskDto): Observable<ITask> {
    return this.http.patch<ITask>(`${this.apiUrl}/${id}`, taskDto).pipe(
      tap((updatedTask) => {
        // Update local state
        this.tasks.update((tasks) =>
          tasks.map((task) => (task.id === id ? updatedTask : task))
        );
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Remove from local state
        this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
      })
    );
  }
}

