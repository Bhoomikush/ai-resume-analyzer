import type { Route } from "./+types/home";
import { useEffect } from "react";
import { useNavigate } from "react-router";


import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { resumes } from "../../constants";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Resumind" },
        {
            name: "description",
            content: "Smart feedback for your dream job!",
        },
    ];
}

export default function Home() {
    const { auth } = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate("/auth?next=/");
        }
    }, [auth.isAuthenticated, navigate]);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Track your Applications & Resume Ratings</h1>
                    <h2>Review your submissions and check AI-powered feedback</h2>
                </div>

                {resumes.length > 0 ? (
                    <div className="resumes-section">
                        {resumes.map((resume) => (
                            <ResumeCard key={resume.id} resume={resume} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.01)] max-w-md w-full mx-auto animate-in mt-4">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No resumes analyzed yet</h3>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            Upload your resume against a job description to get score feedback and ATS suggestions.
                        </p>
                        <Link to="/upload" className="primary-button">
                            Upload Resume
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}