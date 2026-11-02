import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-lg shadow-card ${
        interactive ? 'hover:shadow-card-hover hover:border-slate-300 transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-5 sm:p-6 border-b border-[#E5E7EB] ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-5 sm:p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-5 sm:p-6 border-t border-[#E5E7EB] bg-slate-50/50 rounded-b-lg ${className}`} {...props}>
    {children}
  </div>
);

