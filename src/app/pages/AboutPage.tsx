import { useNavigate } from 'react-router';
import { ArrowLeft, Trophy, TrendingUp, Calendar, User, Activity, MapPin, Info } from 'lucide-react';

export function AboutPage() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Info,
      title: 'About App',
      description: 'This app is built for people who are passionate about water sports and competitions.\n\nIt brings tournaments, personal activity, and essential tools together in one place — so you can focus on training, competing, and improving your results.'
    },
    {
      icon: Trophy,
      title: 'Tournaments',
      description: 'Discover water sports events around the world.\n\nBrowse upcoming competitions, filter by sport, location, and date, and find events that match your level and interests.\n\nJoin tournaments, add them to your season, and keep everything organized in one place.'
    },
    {
      icon: TrendingUp,
      title: 'Results & Progress',
      description: 'After each competition, view results and rankings.\n\nTrack your performance over time, see your progress, and stay motivated to improve with every event.'
    },
    {
      icon: Calendar,
      title: 'Your Season',
      description: 'Build your personal season by adding tournaments you plan to participate in.\n\nEasily see upcoming and completed events, and keep a clear overview of your activity throughout the year.'
    },
    {
      icon: User,
      title: 'Profile & Equipment',
      description: 'Customize your profile based on your sports.\n\nAdd your equipment — boat, jet ski, surfboard, kayak, or fishing gear — and manage everything in one place.\n\nKeep track of maintenance, care, and important reminders so your equipment is always ready.'
    },
    {
      icon: Activity,
      title: 'Activity Log',
      description: 'Log your sessions — training, trips, rides, or fishing.\n\nTrack duration, distance, and notes to better understand your performance and habits.'
    },
    {
      icon: MapPin,
      title: 'Map & Weather',
      description: 'Use built-in tools to plan your activity.\n\nCheck weather conditions, wind, waves, and visibility.\nExplore locations on the map and prepare for your next session or competition.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center justify-between px-4 py-4 pt-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="size-6 text-slate-300" />
          </button>
          <h1 className="text-xl font-semibold text-white">About</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl">
                  <Icon className="size-5 text-cyan-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              </div>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {section.description}
              </p>
            </div>
          );
        })}

        {/* Who it's for */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20 mt-8">
          <h2 className="text-lg font-semibold text-white mb-3">Who it's for</h2>
          <p className="text-slate-300 leading-relaxed">
            Whether you're just getting started or already competing, this app helps you stay organized, track your progress, and get more out of every session on the water.
          </p>
        </div>

        {/* App Version */}
        <div className="text-center pt-4 pb-2">
          <p className="text-slate-500 text-sm">Version 1.0.0</p>
          <p className="text-slate-600 text-xs mt-1">Made with ❤️ for water sports athletes</p>
        </div>
      </div>
    </div>
  );
}