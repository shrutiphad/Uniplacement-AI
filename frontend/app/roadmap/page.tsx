import SiteNavbar from "../../components/site-navbar";

const phases = [
  {
    title: "Phase 1 · Auth and RBAC",
    points: [
      "Admin login and student registration",
      "JWT access + refresh token flow",
      "Protected routes and role middleware",
    ],
  },
  {
    title: "Phase 2 · Placement Core",
    points: [
      "Company and role CRUD module",
      "Eligibility engine and application flow",
      "Department and semester filters",
    ],
  },
  {
    title: "Phase 3 · AI Resume Intelligence",
    points: [
      "PDF resume parser and structured extraction",
      "Fit score, missing skills, suggestions",
      "Role-wise compatibility summary",
    ],
  },
  {
    title: "Phase 4 · AI Interview Engine",
    points: [
      "JD-based topic prediction and difficulty analysis",
      "Technical + HR + aptitude question generation",
      "14-day preparation roadmap and mentor chat",
    ],
  },
  {
    title: "Phase 5 · Analytics and Deployment",
    points: [
      "Admin and student insights dashboards",
      "Vercel + Render/Railway + Atlas deployment",
      "Monitoring, logs, and production hardening",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-token-bg text-token-text">
      <SiteNavbar />
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="card-surface p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-token-silver">Implementation Roadmap</p>
          <h1 className="mt-3 text-4xl font-semibold">Build Plan</h1>
          <p className="mt-3 max-w-3xl text-token-muted">
            Use this execution map to turn the product vision into a production deployment with clean,
            modular architecture and strict role-based security.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-6 pb-12 md:grid-cols-2">
        {phases.map((phase) => (
          <article key={phase.title} className="card-surface p-6">
            <h2 className="text-xl font-semibold text-token-gold">{phase.title}</h2>
            <ul className="mt-4 space-y-2 text-sm text-token-muted">
              {phase.points.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
