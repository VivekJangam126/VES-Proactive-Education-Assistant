import { Users, BookOpen, AlertCircle, UserCheck, Activity } from 'lucide-react';

export const OverviewCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      icon: UserCheck,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Classes',
      value: stats.totalClasses,
      icon: BookOpen,
      color: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'High Risk Students',
      value: stats.highRiskStudents,
      icon: AlertCircle,
      color: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Active Interventions',
      value: stats.activeInterventions,
      icon: Activity,
      color: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  {card.title}
                </p>
                <p className="text-3xl font-semibold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <IconComponent className={`${card.textColor} w-6 h-6`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
