import type { Metadata } from "next";
import CourseDetails from "@/components/course/CourseDetails";

interface CoursePageProps {
  // In Next.js 16 route params are async and must be awaited.
  params: Promise<{ courseId: string }>;
}

export const metadata: Metadata = {
  title: "Course Details",
  description: "Course curriculum, materials and student reviews.",
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  return <CourseDetails courseId={courseId} />;
}
