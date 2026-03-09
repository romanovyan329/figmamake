interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientBackground({ children, className = '' }: GradientBackgroundProps) {
  return (
    <div 
      className={`min-h-screen ${className}`}
      style={{ 
        background: 'radial-gradient(124.03% 121.31% at 50.13% 0%, #207DF0 0%, #B0CBFF 100%)'
      }}
    >
      {children}
    </div>
  );
}
