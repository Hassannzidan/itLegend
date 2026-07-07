import type { Course } from "@/types/course";

/**
 * Mock data source. In a real app this module would be replaced by a REST/GraphQL
 * client; the service layer (see `services/courseService.ts`) is the only place
 * that reads from here, so swapping the source later touches a single file.
 */

const WEEK_DESCRIPTION =
  "Advanced story telling techniques for writers: Personas, Characters & Plots";

const REVIEW_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const startingSeoCourse: Course = {
  id: "starting-seo",
  slug: "starting-seo",
  title: "Starting SEO as your Home",
  instructor: {
    id: "edward-norton",
    name: "Edward Norton",
    role: "SEO Specialist",
  },
  imageUrl:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  videoUrl: "/videos/sample-lesson.mp4",
  progress: 68,
  progressLabel: "You",
  socials: [
    { platform: "facebook", url: "#" },
    { platform: "twitter", url: "#" },
    { platform: "linkedin", url: "#" },
    { platform: "youtube", url: "#" },
  ],
  materials: [
    { id: "duration", icon: "duration", label: "Duration", value: "3 weeks" },
    { id: "lessons", icon: "lessons", label: "Lessons", value: "8" },
    { id: "enrolled", icon: "enrolled", label: "Enrolled", value: "65 students" },
    { id: "language", icon: "language", label: "Language", value: "English" },
  ],
  curriculum: [
    {
      id: "week-1-4",
      title: "Week 1-4",
      description: WEEK_DESCRIPTION,
      lessons: [
        { id: "l1", title: "Introduction" },
        { id: "l2", title: "Course Overview" },
        { id: "l3", title: "Course Overview", quiz: { questions: 0, minutes: 10 } },
        { id: "l4", title: "Course Exercise / Reference Files" },
        { id: "l5", title: "Code Editor Installation (Optional if you have one)" },
        { id: "l6", title: "Embedding PHP in HTML", exam: true },
      ],
    },
    {
      id: "week-5-8",
      title: "Week 5-8",
      description: WEEK_DESCRIPTION,
      lessons: [
        { id: "l7", title: "Defining Functions" },
        { id: "l8", title: "Function Parameters" },
        { id: "l9", title: "Return Values From Functions", quiz: { questions: 2, minutes: 15 } },
        { id: "l10", title: "Global Variable and Scope" },
        { id: "l11", title: "Newer Way of creating a Constant" },
        { id: "l12", title: "Constants" },
      ],
    },
  ],
  reviews: [
    { id: "r1", author: "Hassan Mohamed", avatarUrl: "https://i.pravatar.cc/160?img=12", date: "Oct 10, 2021", text: REVIEW_TEXT },
    { id: "r2", author: "Hassan Mohamed", avatarUrl: "https://i.pravatar.cc/160?img=45", date: "Oct 10, 2021", text: REVIEW_TEXT },
    { id: "r3", author: "Hassan Mohamed", avatarUrl: "https://i.pravatar.cc/160?img=32", date: "Oct 10, 2021", text: REVIEW_TEXT },
  ],
};

/** Breadcrumb trail for the Course Details route. Shared by the page, its
 *  loading fallback and its error boundary so the shell never shifts. */
export const COURSE_BREADCRUMBS: { label: string; href?: string }[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Course Details" },
];

/** All available courses, keyed by their route id (`/courses/[courseId]`). */
export const MOCK_COURSES: Readonly<Record<string, Course>> = {
  [startingSeoCourse.id]: startingSeoCourse,
};

/** Fallback used when the requested id is unknown, so any URL renders the demo. */
export const DEFAULT_COURSE: Course = startingSeoCourse;
