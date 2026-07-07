import CourseBreadcrumbs from "@/components/course/CourseBreadcrumbs";

interface Crumb {
  label: string;
  href?: string;
}

interface CoursePageHeaderProps {
  title?: string;
  breadcrumbs: Crumb[];
}

/**
 * Full-width page header band (surface-muted) that holds the breadcrumb trail
 * and the course title.
 */
export default function CoursePageHeader({ title, breadcrumbs }: CoursePageHeaderProps) {
  return (
    <div className="bg-surface-muted">
      <div className="mx-auto max-w-page px-4 xl:px-0">
        <div className="pt-4">
          <CourseBreadcrumbs items={breadcrumbs} />
        </div>

        <div className="py-row">
          <h1 className="text-display-sm font-bold text-heading md:text-display">{title}</h1>
        </div>
      </div>
    </div>
  );
}
