export interface DashboardStats {
  userStats: UserStats;
  events: EventStats;
  financial: FinancialStats;
  system: SystemHealth;
  security: SecurityStats;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  userGrowth: number;
  activeUserGrowth: number;
}

export interface EventStats {
  activeEvents: number;
  totalRegistrations: number;
  eventGrowth: number;
  registrationGrowth: number;
}

export interface FinancialStats {
  monthlyRevenue: number;
  totalRevenue: number;
  revenueGrowth: number;
}

export interface SystemHealth {
  uptime: string;
  avgResponseTime: string;
  cpuUsage: string;
  memoryUsage: string;
  diskUsage?: string;
}

export interface SecurityStats {
  totalLogins: number;
  failedAttempts: number;
  blockedIPs: number;
  suspiciousActivity: number;
}

export interface SecurityLog {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  event: string;
  ip: string;
  userAgent: string;
  userId?: string;
  details: Record<string, any>;
  createdAt: Date;
}

export interface UserManagement {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}