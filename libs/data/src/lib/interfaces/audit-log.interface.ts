import { PermissionAction } from '../enums';

export interface IAuditLog {
  id: string;
  userId: string;
  action: PermissionAction;
  resource: string;
  resourceId: string;
  details: string;
  createdAt: Date;
}

