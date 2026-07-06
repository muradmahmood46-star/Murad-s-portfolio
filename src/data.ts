export type PortfolioData = {
  hero: {
    name: string;
    title: string;
    subtitle: string;
    image: string;
    imageAlt: string;
    buttons: {
      primary: { text: string; link: string };
      secondary: { text: string; link: string };
    };
  };
  about: {
    title: string;
    description: string;
    profileImage: string;
    education: Array<{ degree: string; institution: string; image: string }>;
    certifications: string[];
  };
  skills: {
    title: string;
    categories: Array<{ name: string; icon: string; skills: Array<{ name: string; percentage: number }> }>;
  };
  services: {
    title: string;
    list: string[];
  };
  career: {
    title: string;
    experiences: Array<{
      id: number;
      position: string;
      company: string;
      yearStart: string;
      yearEnd: string;
      icon: string;
      description: string;
      techStack: string[];
    }>;
  };
  projects: {
    title: string;
    list: Array<{
      name: string;
      description: string;
      technologies: string[];
      link: string;
    }>;
  };
  contact: {
    title: string;
    email: string;
    phone: string;
    social: {
      github: string;
      linkedin: string;
    };
    footer: {
      text: string;
      year: string;
    };
  };
};

export const portfolioData: PortfolioData = {
  hero: {
    name: "MURAD MAHMOOD",
    title: "AI ENGINEER & FULL STACK DEVELOPER",
    subtitle: "Specializing in Full-Stack AI & Web Applications",
    image: "/images/image1.jpeg",
    imageAlt: "Murad Mahmood - AI Engineer",
    buttons: {
      primary: { text: "View Projects", link: "#projects" },
      secondary: { text: "Contact Me", link: "#contact" },
    },
  },
  about: {
    title: "About Me",
    description:
      "AI Engineer and Full Stack Developer with expertise in building intelligent systems, scalable web applications, and enterprise solutions. Skilled in machine learning, API development, modern frontend frameworks, and database management. Passionate about delivering innovative, efficient, and user-centric technology solutions.",
    profileImage: "/images/image2.jpeg",
    education: [
      {
        degree: "Bachelor of Science in Artificial Intelligence (BSAI)",
        institution: "Capital University of Science & Technology (CUST), Islamabad",
        image: "/images/image3.jpeg",
      },
      {
        degree: "FSC (Engineering)",
        institution: "Punjab Board of Intermediate and Secondary Education",
        image: "/images/image4.jpeg",
      },
    ],
    certifications: ["Python for Everybody - Coursera"],
  },
  skills: {
    title: "My Skills",
    categories: [
      {
        name: "Programming Languages",
        icon: "💻",
        skills: [
          { name: "Python", percentage: 90 },
          { name: "C++", percentage: 85 },
          { name: "C", percentage: 80 },
          { name: "JavaScript", percentage: 85 },
          { name: "HTML", percentage: 95 },
          { name: "CSS", percentage: 90 },
        ],
      },
      {
        name: "AI & Machine Learning",
        icon: "🧠",
        skills: [
          { name: "Model Training", percentage: 80 },
          { name: "Model Deployment", percentage: 80 },
          { name: "Scikit-learn", percentage: 80 },
          { name: "Pandas", percentage: 80 },
          { name: "NumPy", percentage: 80 },
          { name: "Data Analysis", percentage: 80 },
          { name: "Prediction Models", percentage: 80 },
          { name: "Classification", percentage: 80 },
        ],
      },
      {
        name: "Frontend Development",
        icon: "🎨",
        skills: [
          { name: "React", percentage: 85 },
          { name: "Angular", percentage: 80 },
          { name: "HTML5", percentage: 95 },
          { name: "CSS3", percentage: 90 },
          { name: "Responsive Design", percentage: 90 },
          { name: "UI/UX", percentage: 80 },
        ],
      },
      {
        name: "Backend & Databases",
        icon: "⚙️",
        skills: [
          { name: "RESTful APIs", percentage: 80 },
          { name: "Node.js", percentage: 80 },
          { name: "MySQL", percentage: 80 },
          { name: "Database Management", percentage: 80 },
          { name: "System Optimization", percentage: 80 },
        ],
      },
      {
        name: "Tools & Technologies",
        icon: "🛠️",
        skills: [
          { name: "API Integration", percentage: 85 },
          { name: "ERP Solutions", percentage: 80 },
          { name: "Report Generation", percentage: 80 },
          { name: "Business Intelligence", percentage: 80 },
          { name: "Git", percentage: 90 },
        ],
      },
      {
        name: "Soft Skills",
        icon: "🤝",
        skills: [
          { name: "Problem Solving", percentage: 95 },
          { name: "Team Collaboration", percentage: 90 },
          { name: "Client Communication", percentage: 90 },
          { name: "Project Management", percentage: 85 },
          { name: "Time Management", percentage: 85 },
        ],
      },
    ],
  },
  services: {
    title: "My Services",
    list: [
      "AI Model Development",
      "Machine Learning Solutions",
      "Full Stack Web Development",
      "Frontend Development",
      "Backend Development",
      "API Development & Integration",
      "ERP Solutions",
      "Database Design & Management",
      "Custom Website Development",
      "Portfolio Websites",
      "Business Websites",
      "AI-Powered Applications",
      "Prediction & Calculation Tools",
      "System Optimization",
      "Technology Consultation",
    ],
  },
  career: {
    title: "My Career & Experience",
    experiences: [
      {
        id: 1,
        position: "AI Engineer (Intern)",
        company: "ERP Collabs",
        yearStart: "2024",
        yearEnd: "2025",
        icon: "💼",
        description: "Developed and integrated AI-powered ERP modules and customized solutions. Designed and implemented RESTful APIs for different business modules. Managed databases, optimized system performance, and generated comprehensive reports. Collaborated with cross-functional teams to deliver scalable enterprise features.",
        techStack: ["Python", "REST APIs", "MySQL", "ERP", "AI"]
      },
      {
        id: 2,
        position: "Full Stack Developer (Freelance)",
        company: "Self-Employed",
        yearStart: "2024",
        yearEnd: "Present",
        icon: "💻",
        description: "Building modern websites, portfolios, and full-stack web applications for global clients. Developing AI models and intelligent automation solutions. Creating academic projects, PTC platforms, calculation tools, and AI-based prediction applications. Designing and deploying business websites with responsive, user-centric interfaces.",
        techStack: ["React", "Node.js", "Python", "APIs", "MongoDB"]
      },
      {
        id: 3,
        position: "AI & Full Stack Developer (Projects)",
        company: "Academic & Personal",
        yearStart: "2023",
        yearEnd: "2024",
        icon: "🚀",
        description: "Developed and deployed various machine learning models for prediction, classification, and data analysis tasks. Built intelligent applications with AI capabilities. Worked on full stack web development projects with modern frameworks and database integration.",
        techStack: ["Python", "ML", "React", "SQL", "AI"]
      },
    ],
  },
  projects: {
    title: "My Projects",
    list: [
      {
        name: "Police System Management",
        description:
          "A complete police station management system with modules for FIR, records, complaints, and user management.",
        technologies: ["Python", "MySQL", "HTML", "CSS", "JavaScript"],
        link: "#",
      },
      {
        name: "AI Calculation and Prediction",
        description:
          "An advanced AI-powered tool for complex calculations and predictive analysis, utilizing machine learning to provide accurate forecasts and data-driven insights.",
        technologies: ["Python", "Scikit-learn", "React", "FastAPI"],
        link: "#",
      },
      {
        name: "AI Model Training Projects",
        description:
          "Various machine learning models including prediction, classification, and data analysis tasks.",
        technologies: ["Python", "Scikit-learn", "Pandas", "NumPy"],
        link: "#",
      },
      {
        name: "Portfolio Websites",
        description:
          "Multiple modern, responsive portfolio websites developed for different clients and personal branding.",
        technologies: ["React", "Angular", "HTML", "CSS", "JavaScript"],
        link: "#",
      },
      {
        name: "API-Based Prediction Apps",
        description:
          "Intelligent applications for prediction and calculation purposes using machine learning algorithms.",
        technologies: ["Python", "Machine Learning", "Web Integration"],
        link: "#",
      },
      {
        name: "Business Websites",
        description:
          "Professional business websites with custom features and responsive design.",
        technologies: ["Full Stack Development", "Responsive Design"],
        link: "#",
      },
    ],
  },
  contact: {
    title: "Contact Me",
    email: "muradmahmood46@gmail.com",
    phone: "+92 3455181242",
    social: {
      github: "https://github.com/muradmahmood46-star",
      linkedin: "https://www.linkedin.com/in/murad-mahmood-005ba9250",
    },
    footer: {
      text: "DESIGNED AND DEVELOPED BY MURAD MAHMOOD [TAMSAL TECHNOLOGIES]",
      year: "2026",
    },
  },
};
export const techStackData: TechStackItem[] = [
  { id: "python", name: "Python", icon: "🐍", size: "large" },
  { id: "cplusplus", name: "C++", icon: "⚡", size: "medium" },
  { id: "c", name: "C", icon: "🔧", size: "small" },
  { id: "javascript", name: "JavaScript", icon: "🟡", size: "large" },
  { id: "react", name: "React", icon: "⚛️", size: "large" },
  { id: "angular", name: "Angular", icon: "🅰️", size: "small" },
  { id: "nodejs", name: "Node.js", icon: "🟢", size: "medium" },
  { id: "nextjs", name: "Next.js", icon: "▲", size: "small" },
  { id: "expressjs", name: "Express.js", icon: "🚂", size: "small" },
  { id: "mysql", name: "MySQL", icon: "🐬", size: "small" },
  { id: "postgresql", name: "PostgreSQL", icon: "🐘", size: "small" },
  { id: "mongodb", name: "MongoDB", icon: "🍃", size: "small" },
  { id: "firebase", name: "Firebase", icon: "🔥", size: "small" },
  { id: "docker", name: "Docker", icon: "🐳", size: "medium" },
  { id: "git", name: "Git", icon: "🐙", size: "medium" },
  { id: "github", name: "GitHub", icon: "🐱", size: "small" },
  { id: "vercel", name: "Vercel", icon: "▲", size: "small" },
  { id: "railway", name: "Railway", icon: "🚄", size: "small" },
  { id: "scikit-learn", name: "Scikit-learn", icon: "🧠", size: "small" },
  { id: "pandas", name: "Pandas", icon: "🐼", size: "small" },
  { id: "numpy", name: "NumPy", icon: "🔢", size: "small" },
  { id: "tailwind", name: "Tailwind CSS", icon: "💨", size: "small" },
  { id: "java", name: "Java", icon: "☕", size: "small" },
  { id: "typescript", name: "TypeScript", icon: "🔵", size: "small" },
];

export const servicesData: ServiceItem[] = [
  {
    id: "full-stack-web-development",
    name: "Full Stack Web Development",
    icon: "💻",
    tone: "web",
    description: "Complete frontend, backend, and database builds for responsive web products.",
  },
  {
    id: "frontend-development",
    name: "Frontend Development",
    icon: "🎨",
    tone: "web",
    description: "Polished interfaces with responsive layouts, smooth interactions, and clean UX.",
  },
  {
    id: "backend-development",
    name: "Backend Development",
    icon: "⚙️",
    tone: "web",
    description: "Reliable APIs, server logic, authentication, and scalable application foundations.",
  },
  {
    id: "custom-website-development",
    name: "Custom Website Development",
    icon: "✨",
    tone: "web",
    description: "Tailored websites built around your brand, workflow, and business goals.",
  },
  {
    id: "portfolio-websites",
    name: "Portfolio Websites",
    icon: "📁",
    tone: "web",
    description: "Modern personal sites that present your work clearly and professionally.",
  },
  {
    id: "business-websites",
    name: "Business Websites",
    icon: "🏢",
    tone: "web",
    description: "Conversion-focused company websites with fast performance and clear messaging.",
  },
  {
    id: "api-development-integration",
    name: "API Development & Integration",
    icon: "🔗",
    tone: "web",
    description: "Custom endpoints and third-party integrations that connect your systems.",
  },
  {
    id: "ai-model-development",
    name: "AI Model Development",
    icon: "🤖",
    tone: "ai",
    description: "Practical AI models designed for prediction, classification, and automation.",
  },
  {
    id: "machine-learning-solutions",
    name: "Machine Learning Solutions",
    icon: "🧠",
    tone: "ai",
    description: "Data-driven ML workflows from preprocessing through training and evaluation.",
  },
  {
    id: "ai-powered-applications",
    name: "AI-Powered Applications",
    icon: "⚡",
    tone: "ai",
    description: "Web applications enhanced with intelligent features and automation.",
  },
  {
    id: "prediction-calculation-tools",
    name: "Prediction & Calculation Tools",
    icon: "📐",
    tone: "ai",
    description: "Interactive calculators and forecasting tools powered by structured logic or ML.",
  },
  {
    id: "erp-solutions",
    name: "ERP Solutions",
    icon: "📋",
    tone: "business",
    description: "Business modules that organize records, operations, reporting, and workflows.",
  },
  {
    id: "database-design-management",
    name: "Database Design & Management",
    icon: "🗄️",
    tone: "business",
    description: "Clean schema design, data organization, optimization, and maintenance.",
  },
  {
    id: "system-optimization",
    name: "System Optimization",
    icon: "🚀",
    tone: "business",
    description: "Performance improvements for slow workflows, databases, APIs, and interfaces.",
  },
  {
    id: "technology-consultation",
    name: "Technology Consultation",
    icon: "💡",
    tone: "business",
    description: "Clear technical guidance for choosing tools, planning features, and shipping faster.",
  },
];
