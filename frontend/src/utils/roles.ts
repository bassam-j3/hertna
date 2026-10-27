export type UserRole = 'super_admin' | 'committee' | 'user';

export const ROLES = {
  SUPER_ADMIN: 'super_admin' as const,
  COMMITTEE: 'committee' as const,
  USER: 'user' as const,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'مدير النظام',
  committee: 'عضو لجنة / مشرف حي',
  user: 'مستخدم عادي',
};

export function isSuperAdmin(userType?: string): boolean {
  return userType === ROLES.SUPER_ADMIN;
}

export function isCommittee(userType?: string): boolean {
  return userType === ROLES.COMMITTEE || userType === ROLES.SUPER_ADMIN;
}

export function isUser(userType?: string): boolean {
  return !userType || userType === ROLES.USER;
}
