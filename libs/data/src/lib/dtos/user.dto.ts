import { RoleType } from '../enums';

export class CreateUserDto {
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  roleType!: RoleType;
  organizationId!: string;
}

