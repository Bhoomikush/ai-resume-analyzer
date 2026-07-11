import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx', { id: 'resume-detail' }),
    route('/resumes/:id', 'routes/resume.tsx', { id: 'resumes-detail' }),
] satisfies RouteConfig;
