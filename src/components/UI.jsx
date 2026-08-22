import React from 'react';
import { ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

// --- BUTTON COMPONENT ---
export const Button = ({
  children,
  variant = 'primary', // 'primary' (black), 'secondary' (white/border), 'ghost', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-charcoal-900 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";
  
  const variants = {
    primary: "bg-charcoal-950 text-white hover:bg-charcoal-800 border border-transparent shadow-subtle",
    secondary: "bg-white text-charcoal-900 border border-charcoal-200 hover:bg-charcoal-50 shadow-subtle",
    ghost: "bg-transparent text-charcoal-700 hover:bg-charcoal-100 border border-transparent",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent shadow-subtle"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <RefreshCw className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className={size === 'sm' ? "w-4 h-4" : "w-5 h-5"} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

// --- INPUT COMPONENT ---
export const Input = React.forwardRef(({
  label,
  error,
  icon: Icon,
  rightElement,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-charcoal-700 font-sans tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-charcoal-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full bg-white text-charcoal-900 text-sm border border-charcoal-200 rounded-lg py-2.5 px-3.5 transition-all focus:outline-none focus:border-charcoal-900 focus:ring-1 focus:ring-charcoal-900 placeholder:text-charcoal-400 font-sans ${Icon ? 'pl-10' : ''} ${rightElement ? 'pr-11' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 font-medium mt-0.5 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// --- SELECT COMPONENT ---
export const Select = React.forwardRef(({
  label,
  error,
  options = [],
  className = '',
  placeholder,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-charcoal-700 font-sans tracking-wide">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full bg-white text-charcoal-900 text-sm border border-charcoal-200 rounded-lg py-2.5 px-3.5 transition-all focus:outline-none focus:border-charcoal-900 focus:ring-1 focus:ring-charcoal-900 font-sans ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 font-medium mt-0.5 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// --- CARD COMPONENT ---
export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div 
      className={`bg-white border border-charcoal-100 rounded-xl p-5 shadow-subtle ${hoverable ? 'hover:shadow-card hover:-translate-y-[2px] transition-all duration-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// --- STAT CARD COMPONENT ---
export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend, // e.g. { value: "+12%", isPositive: true }
  supportingText,
  isLoading = false,
  className = ""
}) => {
  if (isLoading) {
    return <Skeleton className="h-[120px] w-full rounded-xl" />;
  }

  return (
    <Card className={`relative overflow-hidden flex flex-col justify-between ${className}`} hoverable>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold font-sans text-charcoal-950 mt-2 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className="p-2.5 bg-charcoal-50 rounded-lg text-charcoal-900 border border-charcoal-100 shadow-subtle">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {(trend || supportingText) && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-charcoal-50 text-xs">
          {trend && (
            <span className={`font-semibold px-2 py-0.5 rounded-full ${trend.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {trend.value}
            </span>
          )}
          {supportingText && <span className="text-charcoal-400">{supportingText}</span>}
        </div>
      )}
    </Card>
  );
};

// --- BADGE COMPONENT ---
export const Badge = ({ children, variant = 'gray', className = '' }) => {
  const styles = {
    // strict monochrome-aligned status colors
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    black: "bg-charcoal-950 text-white border-transparent",
    gray: "bg-charcoal-50 text-charcoal-700 border-charcoal-200"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- AVATAR COMPONENT ---
export const Avatar = ({ src, name = 'User', size = 'md', className = '' }) => {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg"
  };

  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden bg-charcoal-100 text-charcoal-800 font-semibold border border-charcoal-200 select-none shrink-0 ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.src = ''; }} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

// --- BREADCRUMB COMPONENT ---
export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center text-xs text-charcoal-400 font-medium overflow-x-auto whitespace-nowrap py-1">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <ChevronRight className="w-3.5 h-3.5 mx-1.5 shrink-0 text-charcoal-300" />}
          {item.active ? (
            <span className="text-charcoal-900 font-semibold">{item.label}</span>
          ) : (
            <a href={item.href || '#'} className="hover:text-charcoal-900 transition-colors">
              {item.label}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// --- SKELETON COMPONENT ---
export const Skeleton = ({ className = '' }) => {
  return <div className={`shimmer bg-charcoal-200 rounded ${className}`} />;
};

// --- EMPTY STATE ---
export const EmptyState = ({
  title = "No records found",
  description = "There are no entries corresponding to your filters.",
  icon: Icon,
  action,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-white border border-charcoal-100 rounded-xl shadow-subtle ${className}`}>
      {Icon ? (
        <div className="p-3.5 bg-charcoal-50 rounded-full border border-charcoal-100 text-charcoal-400 mb-4">
          <Icon className="w-6 h-6" />
        </div>
      ) : null}
      <h4 className="text-sm font-bold text-charcoal-900 font-sans">{title}</h4>
      <p className="text-xs text-charcoal-400 mt-1 max-w-[280px] leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

// --- ERROR STATE ---
export const ErrorState = ({
  message = "Unable to load data. Please try again.",
  onRetry,
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm ${className}`}>
      <AlertCircle className="w-5 h-5 shrink-0" />
      <div className="flex-1">
        <p className="font-semibold text-red-800">Connection Error</p>
        <p className="text-xs text-red-600 mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" className="bg-white text-red-700 border-red-200 hover:bg-red-50" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
};

// --- PAGE HEADER ---
export const PageHeader = ({
  title,
  subtitle,
  actions,
  breadcrumbs
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
        <h1 className="text-2xl font-bold font-sans tracking-tight text-charcoal-950">{title}</h1>
        {subtitle && <p className="text-xs text-charcoal-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 self-start md:self-auto">{actions}</div>}
    </div>
  );
};

// --- CHART CARD ---
export const ChartCard = ({ title, children, extra, className = '' }) => {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-charcoal-50">
        <h4 className="text-sm font-bold text-charcoal-900 font-sans tracking-tight">{title}</h4>
        {extra && <div>{extra}</div>}
      </div>
      <div className="flex-1 w-full h-[240px]">
        {children}
      </div>
    </Card>
  );
};
