import { Authorities } from '@/contexts/AuthContext';

export const isGrantedPermission = (
  permission: Authorities | null,
  resource: string,
  scope: string
) => {
  return true;
  // if (!permission) return false;
  // else {
  //   if (permission.isRoot) return true;
  //   const permissionKey = `${resource}:${scope}`;
  //   return permission.grantedPermissions.includes(permissionKey);
  // }
};

export enum RESOURCES {
  UNIT = 'unit',
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
  TIMEOFF = 'timeoff',
  NEWS = 'news',
  ATTENDANCE = 'attendance',
  SESSION = 'session'
}

export enum SCOPES {
  VIEW = 'view',
  UPDATE = 'update',
  DELETE = 'delete',
  CREATE = 'create'
}
