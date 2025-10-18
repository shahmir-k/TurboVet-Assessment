import { RoleType } from '../enums';

export class JwtPayloadDto {
  sub!: string; // user id
  email!: string;
  roleType!: RoleType;
  organizationId!: string;
  iat?: number;
  exp?: number;
}

