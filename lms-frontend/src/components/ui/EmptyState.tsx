import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className = '',
}) => {
  return (
    <div className={`p-8 sm:p-12 text-center rounded-lg border border-dashed border-[#E5E7EB] bg-white flex flex-col items-center justify-center ${className}`}>
      {icon && (
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[#20252B] mb-1.5">{title}</h3>
      <p className="text-sm text-[#697386] max-w-md mx-auto leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && (
        actionHref ? (
          <a
            href={actionHref}
            className="inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2 bg-[#172B4D] text-white hover:bg-[#0F1E36] transition-colors shadow-sm"
          >
            {actionLabel}
          </a>
        ) : (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
};
