import { Fragment } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Crumb {
  label: string;
  href?: string;
}

interface CourseBreadcrumbsProps {
  items: Crumb[];
}

/** Accessible breadcrumb trail; the last item renders as the current page. */
export default function CourseBreadcrumbs({ items }: CourseBreadcrumbsProps) {
  return (
    <Breadcrumb className="text-body-soft">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={item.label}>
              <BreadcrumbItem className="capitalize">
                {isLast || !item.href ? (
                  <BreadcrumbPage className="text-ink">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="text-ink-soft">
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="text-muted-soft" />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
