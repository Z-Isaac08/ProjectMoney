import React from 'react';
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  Calendar,
  BarChart3,
  Shield
} from 'lucide-react';
import Loading from '../ui/Loading';

const StatsOverview = ({ data, loading }) => {
  if (loading && !data) {
    return <Loading size="lg" text="Chargement des statistiques..." />;
  }

  const stats = [
    {
      name: 'Utilisateurs Total',
      value: data?.userStats?.totalUsers || 0,
      change: data?.userStats?.userGrowth || 0,
      changeType: data?.userStats?.userGrowth >= 0 ? 'increase' : 'decrease',
      icon: Users,
      color: 'blue'
    },
    {
      name: 'Utilisateurs Actifs (30j)',
      value: data?.userStats?.activeUsers || 0,
      change: data?.userStats?.activeUserGrowth || 0,
      changeType: data?.userStats?.activeUserGrowth >= 0 ? 'increase' : 'decrease',
      icon: Users,
      color: 'green'
    },
    {
      name: 'Revenus Mensuels',
      value: `${data?.financial?.monthlyRevenue || 0}€`,
      change: data?.financial?.revenueGrowth || 0,
      changeType: data?.financial?.revenueGrowth >= 0 ? 'increase' : 'decrease',
      icon: DollarSign,
      color: 'emerald'
    },
    // LIBRARY STATS COMMENTED OUT FOR MVP
    // {
    //   name: 'Livres Vendus',
    //   value: data?.library?.booksSold || 0,
    //   change: data?.library?.salesGrowth || 0,
    //   changeType: data?.library?.salesGrowth >= 0 ? 'increase' : 'decrease',
    //   icon: BookOpen,
    //   color: 'purple'
    // },
    {
      name: 'Événements Actifs',
      value: data?.events?.activeEvents || 0,
      change: data?.events?.eventGrowth || 0,
      changeType: data?.events?.eventGrowth >= 0 ? 'increase' : 'decrease',
      icon: Calendar,
      color: 'indigo'
    },
    {
      name: 'Taux de Conversion',
      value: `${data?.analytics?.conversionRate || 0}%`,
      change: data?.analytics?.conversionGrowth || 0,
      changeType: data?.analytics?.conversionGrowth >= 0 ? 'increase' : 'decrease',
      icon: BarChart3,
      color: 'orange'
    }
  ];

  const securityStats = {
    totalLogins: data?.security?.totalLogins || 0,
    failedAttempts: data?.security?.failedAttempts || 0,
    blockedIPs: data?.security?.blockedIPs || 0,
    suspiciousActivity: data?.security?.suspiciousActivity || 0
  };

  const systemMetrics = {
    uptime: data?.system?.uptime || '99.9%',
    responseTime: data?.system?.avgResponseTime || '120ms',
    cpuUsage: data?.system?.cpuUsage || '45%',
    memoryUsage: data?.system?.memoryUsage || '62%'
  };

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Statistiques Principales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.name} stat={stat} />
          ))}
        </div>
      </div>

      {/* Métriques de sécurité */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Sécurité & Authentification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SecurityMetric
            label="Connexions Totales"
            value={securityStats.totalLogins}
            icon="🔑"
            color="green"
          />
          <SecurityMetric
            label="Tentatives Échouées"
            value={securityStats.failedAttempts}
            icon="❌"
            color="red"
          />
          <SecurityMetric
            label="IPs Bloquées"
            value={securityStats.blockedIPs}
            icon="🚫"
            color="orange"
          />
          <SecurityMetric
            label="Activité Suspecte"
            value={securityStats.suspiciousActivity}
            icon="⚠️"
            color="yellow"
          />
        </div>
      </div>

      {/* Métriques système */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Performance Système
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SystemMetric
            label="Temps de Fonctionnement"
            value={systemMetrics.uptime}
            icon="⏱️"
            description="Disponibilité du service"
          />
          <SystemMetric
            label="Temps de Réponse"
            value={systemMetrics.responseTime}
            icon="⚡"
            description="Moyenne API"
          />
          <SystemMetric
            label="Utilisation CPU"
            value={systemMetrics.cpuUsage}
            icon="🖥️"
            description="Charge processeur"
          />
          <SystemMetric
            label="Utilisation Mémoire"
            value={systemMetrics.memoryUsage}
            icon="💾"
            description="RAM utilisée"
          />
        </div>
      </div>

      {/* Activité récente */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Activité Récente
        </h3>
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium">Dernières 24 heures</h4>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {data?.recent?.newUsers || 0}
                </div>
                <div className="text-sm text-gray-500">Nouveaux utilisateurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {data?.recent?.completedTransactions || 0}
                </div>
                <div className="text-sm text-gray-500">Transactions complétées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {data?.recent?.eventRegistrations || 0}
                </div>
                <div className="text-sm text-gray-500">Inscriptions événements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md ${colorClasses[stat.color]}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'increase' ? (
                    <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="sr-only">
                    {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                  </span>
                  {Math.abs(stat.change)}%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecurityMetric = ({ label, value, icon, color }) => {
  const colorClasses = {
    green: 'border-green-200 bg-green-50',
    red: 'border-red-200 bg-red-50',
    orange: 'border-orange-200 bg-orange-50',
    yellow: 'border-yellow-200 bg-yellow-50'
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
};

const SystemMetric = ({ label, value, icon, description }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl">{icon}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default StatsOverview;