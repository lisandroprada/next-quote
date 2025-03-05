import React from 'react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

interface BreadcrumbPath {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface AppBreadcrumbProps {
  paths: BreadcrumbPath[];
}

export const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({ paths }) => {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {paths.map((path, index) => (
          <React.Fragment key={path.label}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {path.isCurrentPage || !path.href ? (
                <BreadcrumbPage>{path.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={path.href}>{path.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
