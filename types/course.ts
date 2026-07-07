/**
 * Domain models for the Course Details feature.
 *
 * These interfaces describe the shape of the data regardless of where it comes
 * from (mock, REST, GraphQL...). Components depend on these types, not on the
 * data source, which keeps the UI layer decoupled from the transport layer.
 */

/** Icons rendered by the "Course Materials" rows. Kept as a serialisable key
 * so the data layer never imports icon components. */
export type CourseMaterialIcon =
  | "duration"
  | "instructor"
  | "price"
  | "lessons"
  | "enrolled"
  | "language"
  | "certificate";

/** Social networks shown under the hero. */
export type SocialPlatform = "facebook" | "twitter" | "linkedin" | "youtube";

export interface Instructor {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface CourseMaterial {
  id: string;
  icon: CourseMaterialIcon;
  label: string;
  value: string;
}

/** Optional quiz metadata rendered as the "N QUESTION" / "N MINUTES" badges. */
export interface LessonQuiz {
  questions: number;
  minutes: number;
}

export interface Lesson {
  id: string;
  title: string;
  quiz?: LessonQuiz;
  /** When true the lesson opens the timed exam dialog instead of a PDF preview. */
  exam?: boolean;
}

export interface CourseWeek {
  id: string;
  /** e.g. "Week 1-4". */
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface CourseReview {
  id: string;
  author: string;
  avatarUrl?: string;
  /** Pre-formatted, human readable date (e.g. "Oct 10, 2021"). */
  date: string;
  text: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  instructor: Instructor;
  /** Poster image shown in the hero (also used as the video poster frame). */
  imageUrl?: string;
  /** Local course/lesson video played by the custom hero player. */
  videoUrl?: string;
  /** Completion percentage (0–100) shown in the sidebar progress bar. */
  progress: number;
  /** Label rendered at the progress marker (e.g. "You"). */
  progressLabel: string;
  socials: SocialLink[];
  materials: CourseMaterial[];
  curriculum: CourseWeek[];
  reviews: CourseReview[];
}

/** Values captured by the review form. */
export interface ReviewFormValues {
  comment: string;
}
