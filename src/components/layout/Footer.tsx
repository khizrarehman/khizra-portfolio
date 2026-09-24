import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { EasterEggSlot } from "@/components/ui/EasterEggSlot";

const links = [
  { href: "/research", label: "Research" },
  { href: "/journal", label: "Journal" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container>
        <div className="flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <span className="font-serif text-lg text-ink italic">
              Khizra Rehman
            </span>
            <div className="flex items-center gap-2.5">
              <Tag>Site index</Tag>
              <EasterEggSlot />
            </div>
          </div>

          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-sm text-ink-muted transition-colors hover:text-pink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-line py-6">
          <Tag>© {new Date().getFullYear()} Khizra Rehman</Tag>
        </div>
      </Container>
    </footer>
  );
}
