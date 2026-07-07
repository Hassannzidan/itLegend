import type { SocialLink, SocialPlatform } from "@/types/course";

/**
 * Inline SVG glyphs. This build of lucide-react ships without brand icons, so
 * the four social marks are defined locally to keep the row self-contained.
 */
const SOCIAL_PATHS: Record<SocialPlatform, { label: string; path: string }> = {
  facebook: {
    label: "Facebook",
    path: "M13 10h3l.5-3H13V5.5c0-.9.3-1.5 1.6-1.5H16V1.3C15.5 1.2 14.6 1 13.6 1 11.4 1 10 2.3 10 4.7V7H7v3h3v9h3z",
  },
  twitter: {
    label: "Twitter",
    path: "M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.6.8-2.5 1a4 4 0 0 0-6.9 3.6A11.3 11.3 0 0 1 3.9 4.5a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.8-.5a4 4 0 0 0 3.2 4 4 4 0 0 1-1.8 0 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 17.5a11.3 11.3 0 0 0 6.1 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2-2.1z",
  },
  linkedin: {
    label: "LinkedIn",
    path: "M6.9 8.5H4V19h2.9zM5.4 3.5A1.7 1.7 0 1 0 5.4 7a1.7 1.7 0 0 0 0-3.4zM20 19v-6c0-3-1.6-4.4-3.7-4.4-1.7 0-2.5.9-2.9 1.6V8.5H10.5V19h2.9v-5.6c0-1.3.5-2.1 1.6-2.1s1.6.8 1.6 2.1V19z",
  },
  youtube: {
    label: "YouTube",
    path: "M22 8.2a2.8 2.8 0 0 0-2-2C18.3 5.8 12 5.8 12 5.8s-6.3 0-8 .4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.8 12a29 29 0 0 0 .2 3.8 2.8 2.8 0 0 0 2 2c1.7.4 8 .4 8 .4s6.3 0 8-.4a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .2-3.8 29 29 0 0 0-.2-3.8zM10 15V9l5.2 3z",
  },
};

interface SocialLinksProps {
  links: SocialLink[];
}

/** Row of circular social buttons shown beneath the hero image. */
export default function SocialLinks({ links }: SocialLinksProps) {
  return (
    <nav aria-label="Course social links" className="mt-6 flex items-center gap-3">
      {links.map(({ platform, url }) => {
        const { label, path } = SOCIAL_PATHS[platform];
        return (
          <a
            key={platform}
            href={url}
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-body transition-colors hover:border-primary hover:bg-primary hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d={path} />
            </svg>
          </a>
        );
      })}
    </nav>
  );
}
