import CourseMaterialItem from "@/components/course/CourseMaterialItem";
import type { CourseMaterial } from "@/types/course";

interface CourseMaterialsProps {
  materials: CourseMaterial[];
}

/**
 * "Course Materials" panel. On desktop the rows flow into two columns (85%
 * wide, even rows nudged right) inside a softly shadowed card; on mobile they
 * stack full-width, matching the reference layout.
 */
export default function CourseMaterials({ materials }: CourseMaterialsProps) {
  return (
    <section className="mt-14 md:mt-16">
      <h3 className="mb-5 text-heading-lg font-semibold text-heading">Course Materials</h3>
      <div
        className={[
          "shadow-soft rounded-sm px-6 py-4 md:px-9",
          "grid grid-cols-1 md:grid-cols-2",
          // Two-column offset trick from the reference.
          "md:[&>*]:w-[85%] md:[&>*:nth-child(even)]:ml-[15%]",
          // Last row loses its divider.
          "[&>*:nth-last-child(-n+1)]:border-b-0 md:[&>*:nth-child(7)]:border-b-0 md:[&>*:nth-child(8)]:border-b-0",
        ].join(" ")}
      >
        {materials.map((material) => (
          <CourseMaterialItem key={material.id} material={material} />
        ))}
      </div>
    </section>
  );
}
