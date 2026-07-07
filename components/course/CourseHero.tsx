interface CourseHeroProps {
  title: string;
  imageUrl?: string;
}

/**
 * Hero media: the full-width course poster. A gradient placeholder covers the
 * case where the remote image is unavailable.
 */
export default function CourseHero({ title, imageUrl }: CourseHeroProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-sm">
      <div
        className="aspect-[16/9] w-full bg-cover bg-center"
        style={{
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : "linear-gradient(135deg, var(--hero-placeholder-from) 0%, var(--hero-placeholder-to) 100%)",
        }}
        role="img"
        aria-label={title}
      />
    </div>
  );
}
