import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
    { title: "Resumind | Auth" },
    { name: "description", content: "Log in to your account" },
];

const Auth = () => {
    const { isLoading, auth } = usePuterStore();

    const location = useLocation();
    const navigate = useNavigate();

    // Get the "next" query parameter
    const next =
        new URLSearchParams(location.search).get("next") || "/";

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next);
        }
    }, [auth.isAuthenticated, next, navigate]);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center p-6">
            <div className="gradient-border shadow-xl max-w-md w-full">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-8 md:p-10 items-center text-center">
                    {/* Decorative Logo / Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                        <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h1 className="!text-4xl font-bold tracking-tight !m-0 !p-0">Welcome to Resumind</h1>
                        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                            Analyze your resume against job descriptions and unlock professional AI-driven insights to boost your career.
                        </p>
                    </div>

                    <div className="w-full">
                        {isLoading ? (
                            <button className="auth-button animate-pulse cursor-wait" disabled>
                                <p>Signing you in...</p>
                            </button>
                        ) : auth.isAuthenticated ? (
                            <button className="auth-button" onClick={auth.signOut}>
                                <p>Log Out</p>
                            </button>
                        ) : (
                            <button className="auth-button" onClick={auth.signIn}>
                                <p>Log In to Continue</p>
                            </button>
                        )}
                    </div>

                    <p className="text-xs text-gray-400">
                        Securely powered by Puter Serverless
                    </p>
                </section>
            </div>
        </main>
    );
};

export default Auth;