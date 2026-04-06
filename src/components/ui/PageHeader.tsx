import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-6 mb-10 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
          <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">
            <Home size={14} />
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <ChevronRight size={14} className="opacity-40" />
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-[var(--color-primary)] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[var(--color-text-secondary)]">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-[var(--color-text-primary)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[var(--color-text-secondary)] font-medium max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
