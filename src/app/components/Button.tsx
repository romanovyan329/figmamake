interface ButtonProps {
  children: React.ReactNode;
  variant?: 'accent1' | 'accent2';
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export function Button({ children, variant = 'accent1', onClick, className = '', fullWidth = false }: ButtonProps) {
  const baseStyles = 'relative rounded-[6px] px-[50px] py-3 font-[\'Inter\',sans-serif] font-black text-[18px] uppercase text-white transition-all active:scale-95 flex items-center justify-center';
  
  const variantStyles = {
    accent1: 'bg-[#F0A720] shadow-[inset_0px_2px_1.6px_0px_rgba(255,255,255,0.5)]',
    accent2: 'bg-[#3F6692] shadow-[inset_0px_2px_1.6px_0px_rgba(255,255,255,0.2)]'
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
    >
      {children}
    </button>
  );
}