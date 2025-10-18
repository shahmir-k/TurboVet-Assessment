import { RoleType } from '@org/data';

export class RBACUtils {
  /**
   * Check if a role has higher or equal privilege than another role
   */
  static hasRolePrivilege(userRole: RoleType, requiredRole: RoleType): boolean {
    const roleHierarchy = {
      [RoleType.OWNER]: 3,
      [RoleType.ADMIN]: 2,
      [RoleType.VIEWER]: 1,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  /**
   * Check if user can access resource based on organization hierarchy
   */
  static canAccessOrganization(
    userOrgId: string,
    userParentOrgId: string | null,
    resourceOrgId: string,
    userRole: RoleType
  ): boolean {
    // Owners and Admins can access their organization and child organizations
    if (userRole === RoleType.OWNER || userRole === RoleType.ADMIN) {
      return (
        userOrgId === resourceOrgId || userParentOrgId === resourceOrgId
      );
    }

    // Viewers can only access their own organization
    return userOrgId === resourceOrgId;
  }

  /**
   * Check if user can modify resource based on role
   */
  static canModify(userRole: RoleType): boolean {
    return userRole === RoleType.OWNER || userRole === RoleType.ADMIN;
  }

  /**
   * Check if user can delete resource based on role
   */
  static canDelete(userRole: RoleType): boolean {
    return userRole === RoleType.OWNER || userRole === RoleType.ADMIN;
  }

  /**
   * Check if user can view audit logs
   */
  static canViewAuditLogs(userRole: RoleType): boolean {
    return userRole === RoleType.OWNER || userRole === RoleType.ADMIN;
  }
}

