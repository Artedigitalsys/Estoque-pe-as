import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, action, className = '' }) => {
  return (
    <div className={`px-4 py-5 sm:px-6 flex justify-between items-center ${className}`}>
      {title && (typeof title === 'string' ? (
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      ) : (
        title
      ))}
      {action && <div>{action}</div>}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`px-4 py-5 sm:p-6 ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-4 sm:px-6 bg-gray-50 ${className}`}>{children}</div>
  );
};

export default Card;