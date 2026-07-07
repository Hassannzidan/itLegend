import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CourseReview } from "@/types/course";
import { getInitials } from "@/utils/getInitials";

interface CommentItemProps {
  review: CourseReview;
}

/** A single review: avatar, author, date and body text. */
export default function CommentItem({ review }: CommentItemProps) {
  return (
    <article className="flex items-start gap-6 border-b border-border py-card first:pt-0 last:border-none sm:gap-card">
      <Avatar className="h-16 w-16 shrink-0 sm:h-20 sm:w-20">
        <AvatarImage src={review.avatarUrl} alt={review.author} />
        <AvatarFallback>{getInitials(review.author)}</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="text-lg font-semibold text-heading">
          Student Name: <span className="font-normal">{review.author}</span>
        </h4>
        <span className="mt-2.5 block text-meta font-medium text-muted-foreground">
          {review.date}
        </span>
        <p className="mt-5 max-w-[90%] text-base leading-[1.4] text-muted-foreground">{review.text}</p>
      </div>
    </article>
  );
}
