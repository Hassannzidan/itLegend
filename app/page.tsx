import { redirect } from "next/navigation";
import { DEFAULT_COURSE } from "@/constants/course";

/** The home route sends visitors straight to the demo course details page. */
export default function Home() {
  redirect(`/courses/${DEFAULT_COURSE.slug}`);
}
