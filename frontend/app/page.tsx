'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  BrainCircuit, Zap, BarChart3, Shield, ChevronRight,
  Users, Building2, FileText, Target, ArrowRight, Sparkles,
  CheckCircle2, TrendingUp
} from 'lucide-react';

const FEATURES = [
  { icon: BrainCircuit, title: 'AI Resume Intelligence', desc: 'Upload your resume and get instant skill gap analysis, fit scores, and personalized improvement suggestions powered by GPT-4.' },
  { icon: Zap,          title: 'Interview Prep Engine', desc: 'Auto-generate role-specific technical, HR, and aptitude questions with a 2-week personalized preparation roadmap.' },
  { icon: BarChart3,    title: 'Real-time Analytics',   desc: 'Live dashboards for admins tracking placement rates, department participation, and fit score distributions.' },
  { icon: Shield,       title: 'Smart Eligibility',     desc: 'Automated server-side eligibility checks ensure only qualified students can apply to roles they meet criteria for.' },
  { icon: Target,       title: 'Fit Score Matching',    desc: 'Intelligent skill matching computes a compatibility percentage between student profiles and job requirements.' },
  { icon: Users,        title: 'Role-Based Access',     desc: 'Distinct Admin and Student portals with JWT-secured routes and full lifecycle management capabilities.' },
];

<<<<<<< HEAD
const STATS = [
  { value: '500+', label: 'Students Placed' },
  { value: '50+',  label: 'Partner Companies' },
  { value: '94%',  label: 'Placement Rate' },
  { value: '4.9★', label: 'Student Rating' },
];
=======

>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6

const HOW_IT_WORKS = [
  { step: '01', title: 'Build Your Profile',    desc: 'Register, add your skills, CGPA, department, and upload your resume PDF.' },
  { step: '02', title: 'Browse & Apply',         desc: 'Explore eligible companies, view JDs, check fit scores, and apply in one click.' },
  { step: '03', title: 'AI Analyzes You',        desc: 'Our AI parses your resume, scores your compatibility, and highlights skill gaps.' },
  { step: '04', title: 'Ace the Interview',      desc: 'Get AI-generated prep questions, a 2-week roadmap, and practice via mock chatbot.' },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden">
     
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-dark-800/60 backdrop-blur-xl bg-dark-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-dark-950" />
            </div>
            <span className="font-display font-bold text-lg text-white">UniPlacement<span className="text-brand-400"> AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-dark-400">
            <a href="#features" className="hover:text-dark-100 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-dark-100 transition-colors">How it works</a>
<<<<<<< HEAD
            <a href="#stats" className="hover:text-dark-100 transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm">Sign In</Link>
=======
            <a href="#stats" className="hover:text-dark-100 transition-colors">Impact!</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm">Login</Link>
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
            <Link href="/auth/register" className="btn-primary text-sm">Get Started <ChevronRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </nav>

    
      <section className="relative min-h-screen flex items-center bg-grid pt-16">
        {/* Background glow */}
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            AI-Powered Campus Recruitment Platform
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8 animate-slide-up">
            AI-Driven<br />
            <span className="text-brand-400">Placement</span><br />
            Intelligence
          </h1>

          <p className="max-w-2xl mx-auto text-dark-400 text-lg md:text-xl leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Digitize your entire campus placement lifecycle. AI matches students to roles,
<<<<<<< HEAD
            analyzes resumes, and prepares candidates for technical interviews — all in one platform.
=======
            analyzes resumes, and prepares candidates for technical interviews all in one platform.
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/auth/register" className="btn-primary text-base px-8 py-3.5 glow-brand">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
<<<<<<< HEAD
            <Link href="/auth/login?demo=admin" className="btn-secondary text-base px-8 py-3.5">
              View Admin Demo
            </Link>
          </div>

       
          <div className="mt-20 flex flex-wrap justify-center gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="bg-dark-800/80 border border-dark-600 rounded-2xl px-6 py-4 backdrop-blur-sm">
                <div className="font-display text-2xl font-bold text-brand-400">{s.value}</div>
                <div className="text-xs text-dark-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
=======
            {/* <Link href="/auth/login?demo=admin" className="btn-secondary text-base px-8 py-3.5">
              View Admin Demo
            </Link> */}
          </div>

       
    
        </div>
      </section>

  
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
      <section id="features" className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="badge bg-brand-500/10 text-brand-400 border-brand-500/20 mb-4">Platform Features</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Everything your placement cell needs
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
<<<<<<< HEAD
            From company onboarding to student readiness — one intelligent platform handles it all.
=======
            From company onboarding to student readiness, one intelligent platform handles it all.
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card-hover p-6 group" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                <f.icon className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

<<<<<<< HEAD
      {/* ── How It Works ───────────────────────────────────── */}
=======
      {/*  How It Works  */}
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
      <section id="how-it-works" className="py-32 bg-dark-900/50 border-y border-dark-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="badge bg-dark-700 text-dark-300 border-dark-600 mb-4">Process</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">How it works</h2>
            <p className="text-dark-400 text-lg max-w-lg mx-auto">Four simple steps from profile to placement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-dark-600 to-transparent z-10" />
                )}
                <div className="card p-6">
                  <div className="font-mono text-4xl font-bold text-dark-700 mb-4">{step.step}</div>
                  <h3 className="font-display font-bold text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* ── CTA ────────────────────────────────────────────── */}
=======
      {/*  CTA  */}
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
      <section className="py-32 max-w-4xl mx-auto px-6 text-center">
        <div className="card p-16 glow-brand-lg border-brand-500/20 bg-gradient-to-b from-dark-800 to-dark-900">
          <TrendingUp className="w-12 h-12 text-brand-400 mx-auto mb-6 animate-float" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
<<<<<<< HEAD
            Ready to transform placements?
          </h2>
          <p className="text-dark-400 text-lg mb-10 max-w-xl mx-auto">
            Join hundreds of students and placement coordinators already using UniPlacement AI.
          </p>
=======
            Escape the generic placement workflow!
          </h2>
          {/* <p className="text-dark-400 text-lg mb-10 max-w-xl mx-auto">
            Join hundreds of students and placement coordinators already using UniPlacement AI.
          </p> */}
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary text-base px-8 py-3.5">
              Register as Student <ArrowRight className="w-5 h-5" />
            </Link>
<<<<<<< HEAD
            <Link href="/auth/login" className="btn-secondary text-base px-8 py-3.5">
              Admin Portal
            </Link>
=======
            {/* <Link href="/auth/login" className="btn-secondary text-base px-8 py-3.5">
              Admin Portal
            </Link> */}
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-dark-400">
            {['No setup cost', 'Instant AI analysis', 'Role-based dashboards'].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand-500" />{t}</span>
            ))}
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* ── Footer ─────────────────────────────────────────── */}
=======
      {/*  Footer  */}
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
      <footer className="border-t border-dark-800 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-dark-950" />
            </div>
            <span className="font-display font-bold text-white">UniPlacement <span className="text-brand-400">AI</span></span>
          </div>
<<<<<<< HEAD
          <p className="text-dark-500 text-sm">© 2025 UniPlacement AI. Built for campus excellence.</p>
=======
          <p className="text-dark-500 text-sm">2026 UniPlacement by SHRUTI PHAD. <br></br> Built for campus excellence.</p>
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
        </div>
      </footer>
    </div>
  );
}