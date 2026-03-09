import { TrendingUp, TrendingDown, Award, Target } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: 'award' | 'target' | 'trophy';
}

export function StatCard({ title, value, subtitle, trend, trendValue, icon }: StatCardProps) {
  const IconComponent = icon === 'award' ? Award : icon === 'target' ? Target : Award;

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-start mb-2">
        <span className="font-['Inter',sans-serif] text-sm text-gray-600">{title}</span>
        {icon && <IconComponent className="w-5 h-5 text-[#207DF0]" />}
      </div>
      
      <div className="font-['Inter',sans-serif] font-bold text-2xl text-gray-900 mb-1">
        {value}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2">
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-xs font-['Inter',sans-serif] font-semibold ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {trend === 'up' && <TrendingUp className="w-4 h-4" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4" />}
              <span>{trendValue}</span>
            </div>
          )}
          {subtitle && (
            <span className="font-['Inter',sans-serif] text-xs text-gray-500">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}