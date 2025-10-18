import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, User, Organization } from '../database/entities';
import { CreateTaskDto, UpdateTaskDto, RoleType, PermissionAction } from '@org/data';
import { RBACUtils } from '@org/auth';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private auditService: AuditService
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    if (!RBACUtils.canModify(user.roleType)) {
      throw new ForbiddenException('You do not have permission to create tasks');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      userId: user.id,
      organizationId: user.organizationId,
    });

    const savedTask = await this.taskRepository.save(task);

    // Log the action
    await this.auditService.log(
      user.id,
      PermissionAction.CREATE,
      'task',
      savedTask.id,
      `Created task: ${savedTask.title}`
    );

    return savedTask;
  }

  async findAll(user: User): Promise<Task[]> {
    const organization = await this.organizationRepository.findOne({
      where: { id: user.organizationId },
      relations: ['parent', 'children'],
    });

    if (!organization) {
      return [];
    }

    // Owners and Admins can see tasks from their org and child orgs
    if (user.roleType === RoleType.OWNER || user.roleType === RoleType.ADMIN) {
      const orgIds = [organization.id];
      
      // Add child organization IDs
      if (organization.children) {
        orgIds.push(...organization.children.map((child) => child.id));
      }

      const tasks = await this.taskRepository
        .createQueryBuilder('task')
        .where('task.organizationId IN (:...orgIds)', { orgIds })
        .leftJoinAndSelect('task.user', 'user')
        .orderBy('task.createdAt', 'DESC')
        .getMany();

      // Log the action
      await this.auditService.log(
        user.id,
        PermissionAction.READ,
        'task',
        'all',
        `Viewed ${tasks.length} tasks`
      );

      return tasks;
    }

    // Viewers can only see tasks from their organization
    const tasks = await this.taskRepository.find({
      where: { organizationId: user.organizationId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    // Log the action
    await this.auditService.log(
      user.id,
      PermissionAction.READ,
      'task',
      'all',
      `Viewed ${tasks.length} tasks`
    );

    return tasks;
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user', 'organization'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Check if user can access this task's organization
    const organization = await this.organizationRepository.findOne({
      where: { id: user.organizationId },
      relations: ['parent'],
    });

    const canAccess = RBACUtils.canAccessOrganization(
      user.organizationId,
      organization?.parentId || null,
      task.organizationId,
      user.roleType
    );

    if (!canAccess) {
      throw new ForbiddenException('You do not have permission to access this task');
    }

    // Log the action
    await this.auditService.log(
      user.id,
      PermissionAction.READ,
      'task',
      task.id,
      `Viewed task: ${task.title}`
    );

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    if (!RBACUtils.canModify(user.roleType)) {
      throw new ForbiddenException('You do not have permission to update tasks');
    }

    const task = await this.findOne(id, user);

    Object.assign(task, updateTaskDto);
    const updatedTask = await this.taskRepository.save(task);

    // Log the action
    await this.auditService.log(
      user.id,
      PermissionAction.UPDATE,
      'task',
      updatedTask.id,
      `Updated task: ${updatedTask.title}`
    );

    return updatedTask;
  }

  async remove(id: string, user: User): Promise<void> {
    if (!RBACUtils.canDelete(user.roleType)) {
      throw new ForbiddenException('You do not have permission to delete tasks');
    }

    const task = await this.findOne(id, user);

    await this.taskRepository.remove(task);

    // Log the action
    await this.auditService.log(
      user.id,
      PermissionAction.DELETE,
      'task',
      id,
      `Deleted task: ${task.title}`
    );
  }
}

