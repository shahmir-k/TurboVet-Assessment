import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { TaskStatus, TaskCategory } from '../enums';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO;

  @IsEnum(TaskCategory)
  @IsOptional()
  category?: TaskCategory = TaskCategory.OTHER;

  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  priority?: number = 0;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskCategory)
  @IsOptional()
  category?: TaskCategory;

  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  priority?: number;
}

