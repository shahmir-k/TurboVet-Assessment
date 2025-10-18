import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../database/entities';
import { PermissionAction } from '@org/data';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>
  ) {}

  async log(
    userId: string,
    action: PermissionAction,
    resource: string,
    resourceId: string,
    details: string
  ): Promise<void> {
    const auditLog = this.auditLogRepository.create({
      userId,
      action,
      resource,
      resourceId,
      details,
    });

    await this.auditLogRepository.save(auditLog);

    // Also log to console
    console.log(
      `[AUDIT] User: ${userId} | Action: ${action} | Resource: ${resource}:${resourceId} | Details: ${details}`
    );
  }

  async findAll(userId: string, userRole: string): Promise<AuditLog[]> {
    // Only owners and admins can view audit logs
    return this.auditLogRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 100, // Limit to last 100 logs
    });
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}

