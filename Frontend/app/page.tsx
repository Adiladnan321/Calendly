import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 selection:bg-blue-100">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 sm:px-12">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          CalendlyClone
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="hover:text-blue-600 transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="hidden sm:inline-flex bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center sm:px-12">
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-7xl mb-6">
          Easy scheduling <span className="text-blue-600">ahead</span>
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl leading-relaxed text-zinc-600 mb-10">
          CalendlyClone is your scheduling automation platform for eliminating the back-and-forth emails to find the perfect time — and so much more.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <div className="flex w-full items-center bg-white border-2 border-zinc-200 rounded-lg p-1 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
            <span className="pl-4 pr-1 text-zinc-500 font-medium">calendly.com/</span>
            <input 
              type="text" 
              placeholder="yourlink"
              className="flex-1 bg-transparent py-3 pr-4 outline-none placeholder:text-zinc-400 font-medium text-zinc-900"
            />
          </div>
          <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
            Sign Up
          </button>
        </div>
        <p className="mt-4 text-sm text-zinc-500">Create your free account. No credit card required.</p>
      </main>

      <footer className="py-8 px-6 sm:px-12 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-sm">
        <p>© 2026 CalendlyClone. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="#" className="hover:text-zinc-900 transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-zinc-900 transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
