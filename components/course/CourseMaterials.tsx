import CourseMaterialItem from "@/components/course/CourseMaterialItem";
import type { CourseMaterial } from "@/types/course";

interface CourseMaterialsProps {
  materials: CourseMaterial[];
}

/**
 * "Course Materials" panel: a bordered, softly shadowed card. On desktop the
 * rows are shown in two mirrored columns (matching the reference); on mobile a
 * single column. The last row in each column drops its divider.
 */
export default function CourseMaterials({ materials }: CourseMaterialsProps) {
  const rows = materials.map((material) => (
    <CourseMaterialItem key={material.id} material={material} />
  ));

  return (
    <section className="mt-14 md:mt-16">
      <h3 className="mb-5 text-heading-lg font-semibold text-heading">Course Materials</h3>
      <div className="shadow-soft grid grid-cols-1 gap-x-16 rounded-xl border border-border px-6 py-4 md:grid-cols-2 md:px-9">
        <div className="[&>*:last-child]:border-b-0">{rows}</div>
        <div className="hidden [&>*:last-child]:border-b-0 md:block">{rows}</div>
      </div>
    </section>
  );
}
