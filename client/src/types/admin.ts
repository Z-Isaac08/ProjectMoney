export interface DashboardData {
  userStats?: UserStats;
  events?: EventStats;
  financial?: FinancialStats;
  systemHealth?: SystemHealth;
  analytics?: Analytics;
  security?: SecurityStats;
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

export interface Analytics {
  conversionRate: number;
  conversionGrowth: number;
  [key: string]: any;
}

export interface UserManagement {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AdminState {
  dashboardData: DashboardData | null;
  users: UserManagement[];
  loading: boolean;
  error: string | null;
}