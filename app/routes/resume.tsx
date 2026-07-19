import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Navbar from "~/components/Navbar";
import ScoreCircle from "~/components/ScoreCircle";
import { usePuterStore } from "~/lib/puter";
import type { Resume } from "../../types";

export default function ResumeDetails() {
    const { id } = useParams();
    const { kv, fs } = usePuterStore();
    const [resumeData, setResumeData] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        async function loadResume() {
            try {
                if (!id) return;
                const value = await kv.get(`resume:${id}`);
                if (value) {
                    const data = JSON.parse(value) as Resume;
                    setResumeData(data);
                    if (data.imagePath) {
                        try {
                            const blob = await fs.read(data.imagePath);
                            if (blob) {
                                setImageUrl(URL.createObjectURL(blob));
                            }
                        } catch (err) {
                            console.error("Failed to load image blob from Puter:", err);
                        }
                    }
                }
            } catch (err) {
                console.error("Error loading resume details:", err);
            } finally {
                setLoading(false);
            }
        }
        loadResume();
    }, [id, kv, fs]);

    if (loading) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <section className="main-section flex flex-col items-center justify-center py-20">
                    <h2 className="animate-pulse">Loading resume analysis...</h2>
                </section>
            </main>
        );
    }

    if (!resumeData) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <section className="main-section text-center py-20">
                    <h1>Not Found</h1>
                    <h2>The requested resume analysis could not be found.</h2>
                    <Link to="/" className="primary-button mt-8 inline-block">
                        Back to Home
                    </Link>
                </section>
            </main>
        );
    }

    const { companyName, jobTitle, jobDescription, feedback } = resumeData;

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="max-w-[1240px] mx-auto px-6 py-10 flex flex-col gap-8">
                {/* Back Link & Info Header */}
                <div className="flex flex-row items-center justify-between border-b border-slate-100 pb-6 animate-in">
                    <Link to="/" className="back-button">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Dashboard</span>
                    </Link>
                    <div className="text-right flex flex-col items-end">
                        <h1 className="!text-3xl text-right font-extrabold text-slate-800 !m-0 !p-0 tracking-tight">{companyName}</h1>
                        <p className="text-slate-400 font-semibold text-sm mt-1">{jobTitle}</p>
                    </div>
                </div>
 
                {/* Score Summary Banner */}
                <div className="flex flex-col lg:flex-row gap-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_12px_45px_rgba(0,0,0,0.015)] items-center justify-between animate-in duration-500">
                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                        <div className="hover:scale-105 transition-transform duration-300">
                            <ScoreCircle score={feedback.overallScore} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 text-left">Overall Match Score</h2>
                            <p className="text-slate-400 text-sm mt-1 max-w-[400px] leading-relaxed">
                                Calculated based on keywords matching, project relevance, readability sections, layout formatting, and certifications.
                            </p>
                        </div>
                    </div>
 
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
                        {[
                            { label: "ATS SCORE", score: feedback.ATS?.score },
                            { label: "TONE & STYLE", score: feedback.toneAndStyle?.score },
                            { label: "CONTENT", score: feedback.content?.score },
                            { label: "STRUCTURE", score: feedback.structure?.score },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(0,0,0,0.01)]">
                                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{item.label}</p>
                                <p className="text-2xl font-extrabold text-slate-800 mt-1">{item.score ?? 0}%</p>
                            </div>
                        ))}
                    </div>
                </div>
 
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Column: Image Preview */}
                    <div className="w-full lg:w-1/2 gradient-border lg:sticky lg:top-6 lg:max-h-[calc(100vh-48px)] lg:overflow-y-auto rounded-3xl p-3 bg-white border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.01)]">
                        <div className="bg-slate-50/50 p-2 rounded-2xl border border-slate-100/50">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Resume Preview"
                                    className="w-full h-auto rounded-xl object-contain max-h-[800px] shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                                />
                            ) : (
                                <div className="h-[500px] flex items-center justify-center bg-slate-50 rounded-xl">
                                    <p className="text-slate-400 font-medium animate-pulse">Loading Resume Preview...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Feedback Details */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6 animate-in">
                        {/* Job Description */}
                        {jobDescription && (
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col gap-2">
                                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Target Job Description</h3>
                                <p className="text-sm text-slate-600 line-clamp-3 hover:line-clamp-none transition-all duration-300 cursor-pointer leading-relaxed">
                                    {jobDescription}
                                </p>
                            </div>
                        )}
 
                        {/* Extended ATS Score & Keyword Coverage Breakdown */}
                        {feedback.extendedATS && (
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_12_45px_rgba(0,0,0,0.015)] flex flex-col gap-6">
                                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-800">ATS Match Analysis</h3>
                                    <span className="bg-indigo-50 text-indigo-700 font-extrabold px-3.5 py-1.5 rounded-full text-xs border border-indigo-100/50">
                                        Overall ATS Match: {feedback.ATS.score}%
                                    </span>
                                </div>
 
                                {/* Weighted Progress Bars */}
                                <div className="flex flex-col gap-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scoring Breakdown</h4>
                                    {[
                                        { label: "Keyword Match (45%)", score: feedback.extendedATS.keywordMatchScore, color: "bg-indigo-600" },
                                        { label: "Project Relevance (25%)", score: feedback.extendedATS.projectRelevanceScore, color: "bg-violet-600" },
                                        { label: "Skills Match (10%)", score: feedback.extendedATS.skillsMatchScore, color: "bg-emerald-500" },
                                        { label: "Formatting & Readability (10%)", score: feedback.extendedATS.formattingScore, color: "bg-amber-500" },
                                        { label: "Education & Certs (10%)", score: feedback.extendedATS.educationScore, color: "bg-purple-600" },
                                    ].map((bar, i) => (
                                        <div key={i} className="flex flex-col gap-1.5">
                                            <div className="flex justify-between text-xs font-semibold text-slate-600">
                                                <span>{bar.label}</span>
                                                <span className="font-bold">{bar.score}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div className={`${bar.color} h-full rounded-full transition-all duration-500`} style={{ width: `${bar.score}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
 
                                {/* Keyword Coverage Lists */}
                                <div className="flex flex-col gap-4 pt-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Keyword Coverage</h4>
                                    
                                    {/* Matched Keywords (Green) */}
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Matched Keywords</span>
                                        <div className="flex flex-wrap gap-2">
                                            {feedback.extendedATS.matchedKeywords.map((kw, i) => (
                                                <span key={i} className="bg-badge-green text-badge-green-text border border-emerald-100/50 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                                                    ✓ {kw}
                                                </span>
                                            ))}
                                            {feedback.extendedATS.matchedKeywords.length === 0 && (
                                                <span className="text-xs text-slate-400 italic">No keywords matched yet.</span>
                                            )}
                                        </div>
                                    </div>
 
                                    {/* Missing Keywords (Red / Interactive) */}
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Missing Keywords (Click to view tip)</span>
                                        <div className="flex flex-wrap gap-2">
                                            {feedback.extendedATS.missingKeywords.map((kw, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        const explanation = feedback.extendedATS?.keywordExplanations?.[kw] || "This keyword is highly relevant to the role. Consider incorporating details of your experience with it.";
                                                        alert(`Why "${kw}" matters:\n\n${explanation}`);
                                                    }}
                                                    className="bg-badge-red hover:bg-rose-100/70 text-badge-red-text border border-rose-100/50 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer"
                                                >
                                                    + {kw}
                                                </button>
                                            ))}
                                            {feedback.extendedATS.missingKeywords.length === 0 && (
                                                <span className="text-xs text-emerald-600 font-medium">✓ No missing keywords! Great job!</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
 
                                {/* ATS Readability Checklist */}
                                <div className="flex flex-col gap-3 pt-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">ATS Readability Checklist</h4>
                                    <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                                        {[
                                            { label: "Contact Info", present: feedback.extendedATS.detectedSections.contactInfo },
                                            { label: "Summary / Profile", present: feedback.extendedATS.detectedSections.profileSummary },
                                            { label: "Skills", present: feedback.extendedATS.detectedSections.skills },
                                            { label: "Projects", present: feedback.extendedATS.detectedSections.projects },
                                            { label: "Experience", present: feedback.extendedATS.detectedSections.experience },
                                            { label: "Education", present: feedback.extendedATS.detectedSections.education },
                                            { label: "Certifications", present: feedback.extendedATS.detectedSections.certifications },
                                        ].map((sec, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <span className={sec.present ? "text-emerald-500 font-bold" : "text-slate-300"}>
                                                    {sec.present ? "✓" : "○"}
                                                </span>
                                                <span className={sec.present ? "text-slate-700" : "text-slate-400 font-normal"}>{sec.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
 
                                {/* Resume Strengths & Areas for Improvement */}
                                <div className="flex flex-col gap-6 border-t border-slate-100 pt-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Resume Strengths</h4>
                                        <ul className="list-disc pl-5 text-sm text-slate-600 flex flex-col gap-1.5 leading-relaxed">
                                            {feedback.extendedATS.strengths.map((str, i) => (
                                                <li key={i}>{str}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">Areas for Improvement</h4>
                                        <ul className="list-disc pl-5 text-sm text-slate-600 flex flex-col gap-1.5 leading-relaxed">
                                            {feedback.extendedATS.improvements.map((imp, i) => (
                                                <li key={i}>{imp}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
 
                        {/* Classic ATS Tips Section */}
                        {feedback.ATS && (!feedback.extendedATS || feedback.ATS.tips.length > 0) && (
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_12px_45px_rgba(0,0,0,0.015)] flex flex-col gap-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <h3 className="text-lg font-bold text-slate-800">ATS Suggestions</h3>
                                    <span className="bg-indigo-50 text-indigo-700 font-extrabold px-3.5 py-1.5 rounded-full text-xs border border-indigo-100/50">
                                        Score: {feedback.ATS.score}%
                                    </span>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {feedback.ATS.tips.map((t, idx) => (
                                        <div key={idx} className="flex gap-3 items-start border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                                            <img
                                                src={t.type === "good" ? "/icons/ats-good.svg" : "/icons/ats-bad.svg"}
                                                alt={t.type}
                                                className="w-5 h-5 mt-0.5 flex-shrink-0"
                                            />
                                            <p className="text-sm text-slate-600 leading-relaxed">{t.tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
 
                        {/* Other Feedback Categories */}
                        {[
                            { title: "Tone & Style", data: feedback.toneAndStyle },
                            { title: "Content Quality", data: feedback.content },
                            { title: "Structure & Layout", data: feedback.structure },
                            { title: "Skills Relevance", data: feedback.skills },
                        ].map((cat, catIdx) => {
                            if (!cat.data) return null;
                            return (
                                <div key={catIdx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_12px_45px_rgba(0,0,0,0.015)] flex flex-col gap-4 animate-in">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                        <h3 className="text-lg font-bold text-slate-800">{cat.title}</h3>
                                        <span className="bg-indigo-50 text-indigo-700 font-extrabold px-3.5 py-1.5 rounded-full text-xs border border-indigo-100/50">
                                            Score: {cat.data.score}%
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {cat.data.tips.map((t, idx) => (
                                            <div key={idx} className="flex gap-3 items-start border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                                                <img
                                                    src={t.type === "good" ? "/icons/ats-good.svg" : "/icons/ats-bad.svg"}
                                                    alt={t.type}
                                                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                                                />
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-800">{t.tip}</h4>
                                                    {"explanation" in t && (
                                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{(t as any).explanation}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}
