import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import CourseDetails from "@/components/course/CourseDetails";
import { getQueryClient } from "@/lib/getQueryClient";
import { getCourse } from "@/services/courseService";
import { queryKeys } from "@/constants/queryKeys";

interface CoursePageProps {
  // In Next.js 16 route params are async and must be awaited.
  params: Promise<{ courseId: string }>;
}

/**
 * Per-course metadata, resolved on the server before the page renders so the
 * tags land in the initial HTML. `getCourse` is request-memoized, so this call
 * and the prefetch below share a single fetch.
 */
export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { courseId } = await params;
  const course = await getCourse(courseId);

  const title = course.title;
  const description = `Learn ${course.title} with ${course.instructor.name}. Explore the curriculum, course materials and student reviews.`;
  // Canonical points at the course's real slug, so a fallback/alias id (which
  // resolves to the same course) is de-duplicated to one indexable URL.
  const canonicalPath = `/courses/${course.slug}`;
  const images = course.imageUrl
    ? [{ url: course.imageUrl, width: 1200, height: 630, alt: course.title }]
    : [];

  return {
    title,
    description,
    // Relative paths below are resolved against `metadataBase` (root layout)
    // into absolute URLs.
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalPath,
      siteName: "IT Legend",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((image) => image.url),
    },
  };
}

/**
 * Server Component: the data-fetching boundary. It prefetches the course into a
 * per-request QueryClient, dehydrates that cache, and hands it to the client
 * tree via <HydrationBoundary>. The interactive UI (CourseDetails and its
 * player/dialogs/forms) stays on the client and reads the hydrated cache
 * instead of issuing its own request.
 */
export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn: () => getCourse(courseId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CourseDetails courseId={courseId} />
    </HydrationBoundary>
  );
}
