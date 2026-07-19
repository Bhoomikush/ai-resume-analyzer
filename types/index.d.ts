export interface Job {
    title: string;
    description: string;
    location: string;
    requiredSkills: string[];
}

export interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    jobDescription?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}


export interface Feedback {
    overallScore: number;
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    extendedATS?: {
        keywordMatchScore: number;
        projectRelevanceScore: number;
        skillsMatchScore: number;
        formattingScore: number;
        educationScore: number;
        matchedKeywords: string[];
        missingKeywords: string[];
        keywordExplanations: { [keyword: string]: string };
        detectedSections: {
            contactInfo: boolean;
            profileSummary: boolean;
            skills: boolean;
            projects: boolean;
            experience: boolean;
            education: boolean;
            certifications: boolean;
        };
        strengths: string[];
        improvements: string[];
    };
}