import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        try {
            setIsProcessing(true);

            setStatusText('Uploading the file...');
            const uploadedFile = await fs.upload([file]);
            console.log("Uploaded resume file:", uploadedFile);
            if(!uploadedFile) return setStatusText('Error: Failed to upload file');

            setStatusText('Converting to image...');
            const imageFile = await convertPdfToImage(file);
            console.log("Converted image file:", imageFile);
            if(!imageFile.file) return setStatusText(`Error: Failed to convert PDF to image - ${imageFile.error ?? 'unknown'}`);

            setStatusText('Uploading the image...');
            const uploadedImage = await fs.upload([imageFile.file]);
            console.log("Uploaded image result:", uploadedImage);
            if(!uploadedImage) return setStatusText('Error: Failed to upload image');

            setStatusText('Preparing data...');
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName, jobTitle, jobDescription,
                feedback: '' as any,
            }
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analyzing...');
            console.log("Calling ai.feedback with image path and text:", uploadedImage.path);

            const feedback = await ai.feedback(
                uploadedImage.path,
                prepareInstructions({ jobTitle, jobDescription, extractedText: imageFile.extractedText })
            )
            console.log("Raw feedback response:", feedback);

            if (!feedback || !feedback.message) {
                return setStatusText('Error: Invalid response structure from AI model');
            }

            const content = feedback.message.content;
            let feedbackText = "";
            if (typeof content === 'string') {
                feedbackText = content;
            } else if (Array.isArray(content) && content.length > 0) {
                feedbackText = content[0].text || "";
            }

            console.log("Feedback text before parsing:", feedbackText);
            if (!feedbackText) {
                return setStatusText('Error: Empty feedback received from AI model');
            }

            let cleanedText = feedbackText.trim();
            if (cleanedText.startsWith("```")) {
                cleanedText = cleanedText.replace(/^```(?:json)?\n?/, "");
                cleanedText = cleanedText.replace(/\n?```$/, "");
                cleanedText = cleanedText.trim();
            }

            const rawFeedback = JSON.parse(cleanedText);
            
            const findKey = (obj: any, target: string) => {
                if (!obj) return undefined;
                // Try exact match, then case-insensitive, then remove underscores
                const keys = Object.keys(obj);
                const exact = keys.find(k => k === target);
                if (exact) return obj[exact];
                const caseInsensitive = keys.find(k => k.toLowerCase() === target.toLowerCase());
                if (caseInsensitive) return obj[caseInsensitive];
                const cleanTarget = target.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                const matched = keys.find(k => k.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === cleanTarget);
                return matched ? obj[matched] : undefined;
            };
            
            const normalizeTips = (tips: any) => {
                if (!Array.isArray(tips)) return [];
                return tips.map(t => ({
                    type: findKey(t, 'type') || 'improve',
                    tip: findKey(t, 'tip') || '',
                    explanation: findKey(t, 'explanation') || ''
                }));
            };

            const normalizeSection = (sectionName: string) => {
                const section = findKey(rawFeedback, sectionName);
                if (!section) return { score: 0, tips: [] };
                return {
                    score: Number(findKey(section, 'score')) || 0,
                    tips: normalizeTips(findKey(section, 'tips'))
                };
            };

            data.feedback = {
                overallScore: Number(findKey(rawFeedback, 'overallScore')) || Number(findKey(rawFeedback, 'overallscore')) || 0,
                ATS: normalizeSection('ATS'),
                toneAndStyle: normalizeSection('toneAndStyle'),
                content: normalizeSection('content'),
                structure: normalizeSection('structure'),
                skills: normalizeSection('skills'),
                extendedATS: findKey(rawFeedback, 'extendedATS')
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete, redirecting...');
            console.log(data);
            navigate(`/resume/${uuid}`);
        } catch (err: any) {
            console.error("handleAnalyze error:", err);
            let errorMessage = "Unknown error";
            if (err) {
                if (err instanceof Error) {
                    errorMessage = err.message;
                } else if (typeof err === 'object') {
                    errorMessage = err.message || err.error || JSON.stringify(err);
                } else {
                    errorMessage = String(err);
                }
            }
            setStatusText(`Error: ${errorMessage}`);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
