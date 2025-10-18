import { RoleType } from '../enums';

export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleType: RoleType;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

