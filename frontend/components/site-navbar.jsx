import Link from "next/link";

export default function SiteNavbar() {
  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          UniPlacement
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/roadmap">Roadmap</Link>
          <Link href="/auth/login">Login</Link>
          <Link href="/auth/register">Register</Link>
        </div>
      </div>
    </nav>
  );
}