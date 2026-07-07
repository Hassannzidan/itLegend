import { Clock, User, DollarSign, BookOpen, Users, Globe, Award, type LucideIcon } from "lucide-react";
import type { CourseMaterial, CourseMaterialIcon } from "@/types/course";

/** Resolves the serialisable icon key from the data layer to a lucide icon. */
const ICON_BY_KEY: Record<CourseMaterialIcon, LucideIcon> = {
  duration: Clock,
  instructor: User,
  price: DollarSign,
  lessons: BookOpen,
  enrolled: Users,
  language: Globe,
  certificate: Award,
};

interface CourseMaterialItemProps {
  material: CourseMaterial;
}

/** A single "Course Materials" row: leading icon + label, trailing value. */
export default function CourseMaterialItem({ material }: CourseMaterialItemProps) {
  const Icon = ICON_BY_KEY[material.icon];

  return (
    <div className="flex items-center justify-between border-b border-border py-row">
      <span className="flex items-center gap-2 text-lg text-body">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        {material.label}:
      </span>
      <span className="font-medium text-black">{material.value}</span>
    </div>
  );
}
