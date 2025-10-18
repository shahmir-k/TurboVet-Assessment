import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateTaskDto, TaskStatus, TaskCategory, ITask } from '@org/data';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styles: [],
})
export class TaskFormComponent implements OnInit {
  @Input() task: ITask | null = null;
  @Output() save = new EventEmitter<CreateTaskDto>();
  @Output() cancel = new EventEmitter<void>();

  formData = {
    title: '',
    description: '',
    status: TaskStatus.TODO,
    category: TaskCategory.OTHER,
    priority: 5,
  };

  ngOnInit() {
    if (this.task) {
      this.formData = {
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        category: this.task.category,
        priority: this.task.priority,
      };
    }
  }

  isFormValid(): boolean {
    return this.formData.title.trim().length > 0 && 
           this.formData.description.trim().length > 0;
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.save.emit(this.formData);
    }
  }
}

