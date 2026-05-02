import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Layout, Shield, Users, Layers, Zap, Star, MousePointer2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <Layout size={22} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Task<span className="text-indigo-600">Flow</span>
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            {isAuthenticated ? (
              <Link to="/dashboard" className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition">
                  Login
                </Link>
                <Link to="/signup" className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition shadow-lg hover:scale-105 active:scale-95">
                  Get Started
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32 sm:pt-32">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 [background:radial-gradient(50%_50%_at_50%_50%,rgba(99,102,241,0.1)_0%,rgba(255,255,255,0)_100%)]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-600 ring-1 ring-inset ring-indigo-600/20 mb-8">
              <Star size={14} fill="currentColor" /> New: AI Task Automation
            </span>
            <h1 className="mx-auto max-w-4xl text-6xl font-black tracking-tight text-slate-900 sm:text-7xl leading-[1.1]">
              Management made <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">effortlessly simple.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-xl text-slate-600 leading-relaxed font-medium">
              TaskFlow brings your team together. Plan, track, and collaborate on any project from start to finish. Beautifully designed for modern teams.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup" className="flex items-center gap-2 rounded-full bg-indigo-600 px-10 py-4 text-lg font-bold text-white hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/30 group">
                  Start Your Project <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Floating Interactive Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-24"
        >
          <div className="relative group">
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-indigo-500 to-violet-500 opacity-20 blur-2xl transition duration-1000 group-hover:opacity-40 group-hover:duration-200" />
            <div className="relative rounded-[2rem] border border-slate-200 bg-white/50 p-3 shadow-2xl backdrop-blur-sm">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white shadow-inner overflow-hidden aspect-[16/10] flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 2, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Layout size={80} className="mx-auto text-indigo-100 mb-6" />
                  </motion.div>
                  <p className="text-2xl font-bold text-slate-400">Interactive Dashboard Interface</p>
                  <p className="text-slate-400 mt-2">Coming soon to your workflow</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="py-32 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-600 mb-4">Core Engine</h2>
            <p className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Everything you need to ship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Layers, title: "Kanban Precision", desc: "Intuitive drag-and-drop mechanics that feel like butter.", color: "bg-indigo-100 text-indigo-600" },
              { icon: Users, title: "Team Sync", desc: "Real-time updates across all members, instantly.", color: "bg-emerald-100 text-emerald-600" },
              { icon: Zap, title: "Lightning Fast", desc: "Zero lag interface optimized for high-performance teams.", color: "bg-amber-100 text-amber-600" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group relative p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-sm`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 sm:text-5xl">Scale your way</h2>
          </div>
          
          <div className="mx-auto grid max-w-lg gap-8 lg:max-w-none lg:grid-cols-3">
            {[
              { name: "Starter", price: "$0", features: ["3 Projects", "Unlimited Tasks", "Basic Stats"], btn: "Get Started" },
              { name: "Pro", price: "$19", features: ["Unlimited Projects", "Priority Support", "Advanced Analytics"], btn: "Go Pro", popular: true },
              { name: "Team", price: "$49", features: ["Everything in Pro", "SSO & Security", "Audit Logs"], btn: "Try Team" }
            ].map((plan, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.03 }}
                className={`relative flex flex-col rounded-[2.5rem] border p-10 bg-white transition-shadow hover:shadow-2xl ${plan.popular ? "border-indigo-600 ring-4 ring-indigo-100" : "border-slate-200"}`}
              >
                {plan.popular && (
                  <span className="absolute top-0 -translate-y-1/2 left-10 rounded-full bg-indigo-600 px-4 py-1 text-xs font-black uppercase text-white shadow-lg">Most Popular</span>
                )}
                <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 font-bold">/mo</span>
                </div>
                <ul className="mt-10 space-y-5 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-base font-bold text-slate-600">
                      <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                        <CheckCircle2 size={12} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`mt-10 block rounded-2xl py-4 text-center text-base font-black transition-all ${plan.popular ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/20" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}>
                  {plan.btn}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-4 sm:mx-8 mb-8">
        <div className="premium-gradient rounded-[3rem] py-24 px-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-5xl font-black text-white sm:text-6xl mb-8">Ship your best work today.</h2>
            <p className="mx-auto mt-6 max-w-xl text-xl text-indigo-100 font-medium">
              Join the future of team collaboration. No credit card, no setup fees, just pure productivity.
            </p>
            <div className="mt-12">
              <Link to="/signup" className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-black text-indigo-600 hover:bg-indigo-50 transition shadow-2xl hover:scale-105 active:scale-95">
                Get Started Free <MousePointer2 size={24} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Layout size={18} />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">TaskFlow</span>
            </div>
            <div className="flex gap-12 text-sm font-bold text-slate-500">
              <a href="#" className="hover:text-indigo-600">Product</a>
              <a href="#" className="hover:text-indigo-600">Features</a>
              <a href="#" className="hover:text-indigo-600">Pricing</a>
              <a href="#" className="hover:text-indigo-600">About</a>
            </div>
            <p className="text-sm font-bold text-slate-400">
              © {new Date().getFullYear()} TaskFlow Inc. Built for winners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
