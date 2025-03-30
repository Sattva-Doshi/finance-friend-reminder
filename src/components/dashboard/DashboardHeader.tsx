
import React from 'react';

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  description 
}) => {
  return (
    <div className="page-header">
      <h1 className="page-title">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
};
