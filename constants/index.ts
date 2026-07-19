import type { Resume } from "../types";

export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "4",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "5",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "6",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      // Extended fields for improved matching, synonyms, sections, and structured scoring
      extendedATS?: {
        keywordMatchScore: number; // 0-100
        projectRelevanceScore: number; // 0-100
        skillsMatchScore: number; // 0-100
        formattingScore: number; // 0-100
        educationScore: number; // 0-100
        matchedKeywords: string[];
        missingKeywords: string[];
        keywordExplanations: { [keyword: string]: string }; // Map each missing keyword to why it matters
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
    }`;

export const prepareInstructions = ({jobTitle, jobDescription, extractedText}: { jobTitle: string; jobDescription: string; extractedText?: string; }) =>
    `You are a top-tier Applicant Tracking System (ATS) matching engine like Jobscan, Greenhouse, or Lever.
      Analyze the provided resume image and the extracted text below.
      
      Job Title: ${jobTitle}
      Job Description: ${jobDescription}
      
      Extracted Resume Text (if available):
      """
      ${extractedText || ""}
      """
      
      IMPORTANT SCORING REQUIREMENTS:
      1. Redesign the ATS scoring logic using a weighted average:
         - Keyword Match: 45% (based on matches of keywords extracted from Job Description using synonym groups. e.g. React == React.js == reactjs, REST API == REST APIs == restful api, JavaScript == js, HTML == html5, CSS == css3, MySQL == SQL, Git == GitHub)
         - Projects & Experience Relevance: 25% (Award high score if projects use matching technologies/responsibilities from JD)
         - Resume Sections Present: 10% (Contact info, Profile/Summary, Skills, Projects, Experience, Education, Certifications)
         - Formatting & ATS Readability: 10% (Clean layout, proper headings)
         - Education & Certifications: 10% (Relevant degree or certifications present)
         
         Overall ATS Score = weighted average of these five components.
         For a qualifying resume containing Java, React.js, JavaScript, MySQL, HTML5, CSS3, REST APIs, Git, Docker, Firebase, CRUD operations, Chart.js, etc., compared against a Full Stack Developer Intern JD, the score MUST realistically be between 75% and 95%.

      2. Never produce false warnings:
         - Do not say "No evidence of required keywords" if the keywords exist in the resume.
         - Do not say "Missing resume content" if sections are present.

      3. Return matched keywords (green) and missing keywords (red).
      4. For each missing keyword, provide a brief actionable explanation (why it matters / how to address it, e.g. "Consider adding a Spring Boot project if you have experience").
      
      Provide the feedback using the following JSON format:
      ${AIResponseFormat}
      
      Return the analysis as a raw JSON object, without any other text and without the markdown backticks.`;