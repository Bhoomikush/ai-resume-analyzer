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
                <div className="flex flex-row items-center justify-between border-b border-gray-100 pb-6">
                    <Link to="/" className="back-button">
                        <img src="/icons/back.svg" alt="back" className="w-5 h-5" />
                        <span className="font-semibold text-gray-700">Back to Dashboard</span>
                    </Link>
                    <div className="text-right flex flex-col items-end">
                        <h1 className="!text-3xl text-right font-bold !m-0 !p-0">{companyName}</h1>
                        <p className="text-gray-500 font-medium">{jobTitle}</p>
                    </div>
                </div>

                {/* Score Summary Banner */}
                <div className="flex flex-col lg:flex-row gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm items-center justify-between">
                    <div className="flex items-center gap-6">
                        <ScoreCircle score={feedback.overallScore} />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Overall Score</h2>
                            <p className="text-gray-500 max-w-[400px]">
                                Your resume score is based on formatting, content relevance, ATS readability, and tone analysis.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
                        <div className="bg-gray-50 p-4 rounded-xl text-center">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">ATS Score</p>
                            <p className="text-xl font-bold text-gray-900">{feedback.ATS?.score ?? 0}%</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Tone & Style</p>
                            <p className="text-xl font-bold text-gray-900">{feedback.toneAndStyle?.score ?? 0}%</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Content</p>
                            <p className="text-xl font-bold text-gray-900">{feedback.content?.score ?? 0}%</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Structure</p>
                            <p className="text-xl font-bold text-gray-900">{feedback.structure?.score ?? 0}%</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Column: Image Preview */}
                    <div className="w-full lg:w-1/2 gradient-border lg:sticky lg:top-6 lg:max-h-[calc(100vh-48px)] lg:overflow-y-auto">
                        <div className="bg-white p-2 rounded-xl shadow-inner">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Resume Preview"
                                    className="w-full h-auto rounded-lg object-contain max-h-[800px]"
                                />
                            ) : (
                                <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
                                    <p className="text-gray-400">Loading Resume Preview...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Feedback Details */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6">
                        {/* Job Description */}
                        {jobDescription && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
                                <h3 className="text-lg font-bold text-gray-900">Target Job Description</h3>
                                <p className="text-sm text-gray-600 line-clamp-3 hover:line-clamp-none transition-all duration-300 cursor-pointer">
                                    {jobDescription}
                                </p>
                            </div>
                        )}

                        {/* Extended ATS Score & Keyword Coverage Breakdown */}
                        {feedback.extendedATS && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
                                <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-900">ATS Match Engine Analysis</h3>
                                    <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
                                        Overall ATS Match: {feedback.ATS.score}%
                                    </span>
                                </div>

                                {/* Weighted Progress Bars */}
                                <div className="flex flex-col gap-4">
                                    <h4 className="text-sm font-bold text-gray-700">Scoring Breakdown</h4>
                                    {[
                                        { label: "Keyword Match (45%)", score: feedback.extendedATS.keywordMatchScore, color: "bg-blue-600" },
                                        { label: "Project Relevance (25%)", score: feedback.extendedATS.projectRelevanceScore, color: "bg-indigo-600" },
                                        { label: "Skills Match (10%)", score: feedback.extendedATS.skillsMatchScore, color: "bg-emerald-600" },
                                        { label: "Formatting & Readability (10%)", score: feedback.extendedATS.formattingScore, color: "bg-amber-500" },
                                        { label: "Education & Certs (10%)", score: feedback.extendedATS.educationScore, color: "bg-purple-600" },
                                    ].map((bar, i) => (
                                        <div key={i} className="flex flex-col gap-1">
                                            <div className="flex justify-between text-xs font-semibold text-gray-600">
                                                <span>{bar.label}</span>
                                                <span>{bar.score}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div className={`${bar.color} h-full rounded-full transition-all duration-500`} style={{ width: `${bar.score}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Keyword Coverage Lists */}
                                <div className="flex flex-col gap-4">
                                    <h4 className="text-sm font-bold text-gray-700">Keyword Coverage</h4>
                                    
                                    {/* Matched Keywords (Green) */}
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Matched Keywords</span>
                                        <div className="flex flex-wrap gap-2">
                                            {feedback.extendedATS.matchedKeywords.map((kw, i) => (
                                                <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-medium">
                                                    ✓ {kw}
                                                </span>
                                            ))}
                                            {feedback.extendedATS.matchedKeywords.length === 0 && (
                                                <span className="text-xs text-gray-400">No keywords matched yet.</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Missing Keywords (Red / Interactive) */}
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Missing Keywords (Click to view tip)</span>
                                        <div className="flex flex-wrap gap-2">
                                            {feedback.extendedATS.missingKeywords.map((kw, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        const explanation = feedback.extendedATS?.keywordExplanations?.[kw] || "This keyword is highly relevant to the role. Consider incorporating details of your experience with it.";
                                                        alert(`Why "${kw}" matters:\n\n${explanation}`);
                                                    }}
                                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer"
                                                >
                                                    + {kw}
                                                </button>
                                            ))}
                                            {feedback.extendedATS.missingKeywords.length === 0 && (
                                                <span className="text-xs text-gray-400">No missing keywords! Great job!</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ATS Readability Checklist */}
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-sm font-bold text-gray-700">ATS Readability Checklist</h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
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
                                                <span className={sec.present ? "text-emerald-500 font-bold" : "text-gray-300"}>
                                                    {sec.present ? "✓" : "○"}
                                                </span>
                                                <span className={sec.present ? "text-gray-700" : "text-gray-400 font-normal"}>{sec.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Resume Strengths & Areas for Improvement */}
                                <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Resume Strengths</h4>
                                        <ul className="list-disc pl-5 text-sm text-gray-700 flex flex-col gap-1">
                                            {feedback.extendedATS.strengths.map((str, i) => (
                                                <li key={i}>{str}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">Areas for Improvement</h4>
                                        <ul className="list-disc pl-5 text-sm text-gray-700 flex flex-col gap-1">
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
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <h3 className="text-lg font-bold text-gray-900">ATS Suggestions</h3>
                                    <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full text-sm">
                                        Score: {feedback.ATS.score}%
                                    </span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {feedback.ATS.tips.map((t, idx) => (
                                        <div key={idx} className="flex gap-3 items-start">
                                            <img
                                                src={t.type === "good" ? "/icons/ats-good.svg" : "/icons/ats-bad.svg"}
                                                alt={t.type}
                                                className="w-5 h-5 mt-0.5 flex-shrink-0"
                                            />
                                            <p className="text-sm text-gray-700">{t.tip}</p>
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
                                <div key={catIdx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <h3 className="text-lg font-bold text-gray-900">{cat.title}</h3>
                                        <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full text-sm">
                                            Score: {cat.data.score}%
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {cat.data.tips.map((t, idx) => (
                                            <div key={idx} className="flex gap-3 items-start">
                                                <img
                                                    src={t.type === "good" ? "/icons/ats-good.svg" : "/icons/ats-bad.svg"}
                                                    alt={t.type}
                                                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                                                />
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900">{t.tip}</h4>
                                                    {"explanation" in t && (
                                                        <p className="text-xs text-gray-500 mt-1">{(t as any).explanation}</p>
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
