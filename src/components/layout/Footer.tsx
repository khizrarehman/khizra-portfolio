import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";
import { NAV_LINKS } from "@/components/layout/navLinks";
import { ChapterLink } from "@/components/layout/ChapterLink";
import { Tag } from "@/components/ui/Tag";
import { EasterEggSlot } from "@/components/ui/EasterEggSlot";


export function Footer() {
  return (
    <footer className="pt-20 pb-[max(2.5rem,calc(env(safe-area-inset-bottom)+1.5rem))] sm:pt-28">
      <Container>
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-lg font-semibold text-ink">{profile.name}</span>
            <EasterEggSlot />
          </div>

          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.chapter}>
                <ChapterLink
                  chapter={link.chapter}
                  className="-my-2 inline-block py-2 font-sans text-sm text-ink-muted transition-colors hover:text-pink"
                >
                  {link.label}
                </ChapterLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <Tag>© {new Date().getFullYear()} {profile.name}</Tag>
        </div>
      </Container>
    </footer>
  );
}
