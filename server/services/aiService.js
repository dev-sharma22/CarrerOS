import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
let aiModel = null;

if (API_KEY) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    aiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Gemini AI Client (gemini-1.5-flash) connected successfully.');
  } catch (error) {
    console.error('Gemini AI Client initialization failed:', error.message);
  }
} else {
  console.log('No GEMINI_API_KEY detected. Running in simulated AI mode.');
}

// @desc    Generate interview questions based on role, experience, difficulty, and resume
export const generateInterviewQuestions = async (role, experienceLevel, difficulty, resumeText = '') => {
  const prompt = `
    You are an encouraging and supportive technical interviewer at a top software company.
    Generate a list of 5 interview questions for a candidate seeking a ${role} position.
    Experience Level: ${experienceLevel}
    Difficulty Level: ${difficulty}
    ${difficulty === 'Easy' ? 'IMPORTANT: Keep questions beginner-friendly, straightforward, foundational, and accessible to minimize difficulty for the candidate.' : ''}
    ${resumeText ? `Candidate Resume Context: ${resumeText}` : ''}

    Provide the output strictly as a JSON array of strings, like this:
    [
      "Question 1",
      "Question 2",
      "Question 3",
      "Question 4",
      "Question 5"
    ]
    Do not add markdown backticks like \`\`\`json or any other text before/after the JSON. Just return the raw JSON array.
  `;

  if (aiModel) {
    try {
      const result = await aiModel.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanText = text.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.warn('Gemini question generation error, falling back to simulator:', error.message);
    }
  }

  // Fallback Simulator
  return getMockQuestions(role, experienceLevel, difficulty);
};

// @desc    Evaluate candidate answer to an interview question
export const evaluateAnswer = async (question, answer, role) => {
  const prompt = `
    You are an elite technical interviewer.
    Question: "${question}"
    Candidate's Answer: "${answer}"
    Target Role: ${role}

    Evaluate the candidate's response. Return a JSON object with:
    1. "score": a number from 1 to 10 based on correctness, depth, and clarity.
    2. "comments": a detailed evaluation of their answer, explaining what was correct, what was incorrect or missing, and how to improve.

    Example JSON structure:
    {
      "score": 7,
      "comments": "The explanation of closures was good, but missed explaining how they can lead to memory leaks if variables are retained. Explain variable scope and garbage collection references."
    }
    Do not add markdown backticks or other explanation text.
  `;

  if (aiModel) {
    try {
      const result = await aiModel.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanText = text.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.warn('Gemini answer evaluation error, falling back to simulator:', error.message);
    }
  }

  // Fallback Simulator
  return getMockEvaluation(question, answer);
};

// @desc    Analyze resume text and extract data, calculate ATS score and suggestions
export const analyzeResume = async (resumeText) => {
  const prompt = `
    You are an expert ATS (Applicant Tracking System) scanner and corporate placement head.
    Analyze the following resume text:
    "${resumeText}"

    Provide a thorough placement readiness assessment. Return a JSON object containing:
    1. "ATSScore": a score from 0 to 100 based on standard section presence, keywords, and layout structure.
    2. "extractedSkills": array of identified tech skills (e.g. JavaScript, C++, SQL, Docker) in uppercase.
    3. "suggestions": array of actionable recommendations (e.g. "Add a projects section", "Use action verbs").

    Do not include markdown tags or explanation text, just raw JSON.
  `;

  if (aiModel) {
    try {
      const result = await aiModel.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanText = text.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.warn('Gemini resume analysis error, falling back to simulator:', error.message);
    }
  }

  // Fallback Simulator
  return getMockResumeAnalysis(resumeText);
};

// ====================================================
// SIMULATOR MOCK DATA HELPERS
// ====================================================

function getMockQuestions(role, experienceLevel, difficulty) {
  const frontendBase = [
    'What is the difference between Virtual DOM and Real DOM in React, and how does reconciliation work?',
    'Explain closures in JavaScript and how they can cause memory leaks.',
    'How does CSS Flexbox differ from Grid? Provide a layout scenario for each.',
    'Explain the purpose and performance impacts of the React useEffect dependency array.',
    'What is state hydration in the context of Server-Side Rendering (SSR) frameworks?',
    'Explain event delegation and how event bubbling enables it in modern browsers.',
    'What are Web Workers and when should you use them to offload main thread operations?',
    'Describe the CSS Box Model and the impact of setting box-sizing to border-box.',
    'What is the difference between debounce and throttle? Provide use cases for each.',
    'How does React Server Components (RSC) differ from standard Client components?',
    'Explain code-splitting in React/Vite and how dynamic imports optimize bundle size.',
    'What are meta-frameworks like Next.js and how do they implement pre-rendering?',
    'Explain the differences between cookies, localStorage, and sessionStorage.',
    'What is Cross-Origin Resource Sharing (CORS) and how does a browser handle preflight requests?',
    'How do you optimize images and web fonts to improve Largest Contentful Paint (LCP)?',
    'Describe CSS specificity rules and how they determine style overrides.',
    'Explain semantic HTML and why it is critical for web accessibility (A11y).',
    'What is the difference between CSS variables (custom properties) and Sass variables?',
    'How does the browser rendering pipeline (layout, paint, composite) work?',
    'What is state management in React? Compare Redux with Context API.'
  ];
  const frontendList = [
    ...frontendBase,
    ...Array.from({ length: 65 - frontendBase.length }).map((_, i) => `Explain the optimization strategy, browser painting lifecycle, or layout rendering considerations for Frontend engineering scenario #${i + 1}.`)
  ];

  const backendBase = [
    'Explain the Node.js event loop and differentiate between setImmediate and process.nextTick.',
    'What are the advantages of MongoDB indexes, and when can indexing degrade performance?',
    'How do you design a secure token rotation policy for JSON Web Tokens (JWT) in production?',
    'Explain ACID properties in SQL databases and compare them with BASE properties in NoSQL.',
    'What is horizontal scaling vs vertical scaling, and how does a load balancer distribute traffic?',
    'How does clustering work in Node.js to leverage multi-core processor performance?',
    'Describe the difference between REST, GraphQL, and gRPC architectures.',
    'What are database transaction isolation levels and how do they prevent dirty reads?',
    'How does Redis handle cache eviction policies like LRU and LFU?',
    'Explain how database sharding partitions tables across multiple nodes.',
    'What is the difference between symmetric and asymmetric encryption?',
    'How do you defend against SQL/NoSQL injections and Cross-Site Scripting (XSS) in an API?',
    'Explain consistent hashing and how it is used in distributed caching rings.',
    'What is rate limiting? Explain the token bucket and sliding window log algorithms.',
    'How does a message broker like RabbitMQ or Kafka handle event delivery guarantees?',
    'Explain HTTP status codes: 301, 302, 401, 403, 409, and 503.',
    'What is the purpose of database replication (Master-Slave) and how does it provide failover?',
    'Explain the difference between thread pools and process isolation in backend services.',
    'How do you profile memory leaks and CPU bottlenecks in a running Node.js process?',
    'Explain database deadlocks, how they occur, and how modern DB engines resolve them.'
  ];
  const backendList = [
    ...backendBase,
    ...Array.from({ length: 65 - backendBase.length }).map((_, i) => `Describe the database design, thread scheduling, caching topology, or security architecture for Backend engineering scenario #${i + 1}.`)
  ];

  const fullstackBase = [
    'Explain the structure of a complete MERN stack application and how client-server communication is secured.',
    'What are WebSockets, and how would you implement a fallback strategy if connection falls back to HTTP?',
    'How do you prevent Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) in a React-Express stack?',
    'Describe your strategy for syncing a complex global Redux/Context state with database writes.',
    'Explain caching layers, specifically where and when you would use Redis in a MERN architecture.',
    'What is Server-Side Rendering (SSR) vs Static Site Generation (SSG) in web platforms?',
    'How do you design a high-throughput file upload service that processes large PDF resumes?',
    'What is the role of Nginx as a reverse proxy and load balancer in web stacks?',
    'Describe containerization with Docker and how it ensures environment parity.',
    'Explain CI/CD pipelines and how they automate build, test, and deployment stages.',
    'What are Microfrontends and how do you orchestrate them in web deployments?',
    'How do you implement optimistic UI updates to make actions feel instantaneous?',
    'Describe OAuth 2.0 authorization code flow with PKCE for single-page applications.',
    'How do you orchestrate secure CORS setups for web clients querying API subdomains?',
    'Explain database migrations and how schema updates are managed safely in production.',
    'What is search engine optimization (SEO) and how does pre-rendering enhance crawling?',
    'Explain service workers and how they enable progressive web app (PWA) offline modes.',
    'How do you prevent race conditions when handling simultaneous checkout writes?',
    'Describe logging, monitoring, and error reporting setups (e.g. Sentry, Winston) in modern apps.',
    'What is the difference between serverless functions (like AWS Lambda) and persistent web servers?'
  ];
  const fullstackList = [
    ...fullstackBase,
    ...Array.from({ length: 60 - fullstackBase.length }).map((_, i) => `Outline the end-to-end integration, API endpoints design, or client-server caching policy for Full Stack engineering scenario #${i + 1}.`)
  ];

  const javaBase = [
    'What is the difference between an Abstract Class and an Interface in Java 8, 9 and 11?',
    'Explain how garbage collection works in JVM, specifically heap generations (Eden, Survivor, Tenured).',
    'What are Lambda expressions and Stream APIs in Java? How do they improve performance?',
    'Explain Spring Boot dependency injection and the difference between @Component, @Service, and @Repository.',
    'What is a thread deadlock, and how can you avoid deadlocks in multi-threaded Java applications?',
    'Explain Java reflection and how libraries use it to inspect classes at runtime.',
    'What is the difference between final, finally, and finalize in Java?',
    'How do you make a class immutable in Java? Provide code examples.',
    'Explain Java concurrent collections like ConcurrentHashMap and CopyOnWriteArrayList.',
    'What is the difference between HashMap and Hashtable? Explain hash collisions resolution.',
    'Describe Spring Boot auto-configuration and how the @SpringBootApplication annotation works.',
    'What is Hibernate / JPA and how do you resolve the N+1 select query problem?',
    'Explain the Java Memory Model (JMM) and the purpose of the volatile keyword.',
    'What are checked and unchecked exceptions in Java? Provide examples.',
    'Describe the ExecutorService framework and how you manage thread pools in Java.',
    'Explain Java Classloaders and the delegation model they follow.',
    'What is the difference between String, StringBuilder, and StringBuffer?',
    'Describe Java design patterns: Singleton, Factory, and Builder.',
    'How does the JIT (Just-In-Time) compiler optimize bytecode execution at runtime?',
    'What is the Java Optional class and how does it prevent NullPointerExceptions?'
  ];
  const javaList = [
    ...javaBase,
    ...Array.from({ length: 60 - javaBase.length }).map((_, i) => `Describe the JVM memory management, multi-threading orchestration, or Spring Framework design pattern for Java engineering scenario #${i + 1}.`)
  ];

  const generic = [
    'Explain the pillars of Object-Oriented Programming (OOP) with real-world design examples.',
    'What is your branching model in Git (e.g. GitFlow), and how do you handle merge conflicts?',
    'Explain how you debug a server crash in production using logs and APMs.',
    'What is RESTful API design, and what are key HTTP status codes for updates and creations?',
    'Design a database schema for a multi-user collaborative task management system.'
  ];

  const qMap = {
    'Frontend Developer': frontendList,
    'Backend Developer': backendList,
    'Full Stack Developer': fullstackList,
    'Java Developer': javaList
  };

  let list = qMap[role] || generic;
  
  if (difficulty === 'Easy') {
    list = list.map(q => 'Explain the basic concepts of: ' + q.split('?')[0]);
  }
  return list;
}

function getMockEvaluation(question, answer) {
  const text = (answer || '').trim();

  if (!text) {
    return {
      score: 1,
      comments: 'No answer was submitted. Please write a descriptive response covering the technical terms.'
    };
  }

  if (text.length < 15) {
    return {
      score: 3,
      comments: 'Your response is very short. Aim to expand on your answers by providing code examples, architecture contexts, or placement case studies.'
    };
  }

  let score = 7;
  let comments = 'Good explanation. You identified the primary mechanism of the concept. ';

  if (text.toLowerCase().includes('react') || text.toLowerCase().includes('database') || text.toLowerCase().includes('node') || text.toLowerCase().includes('index')) {
    score = 8;
    comments += 'You successfully integrated core technical keywords. For a perfect 10/10, contrast this concept with an alternative technique or cite a placement project where you implemented it.';
  } else {
    comments += 'To improve your score, structure your answer using the STAR method: state the technical scenario, action taken, and results achieved.';
  }

  return { score, comments };
}

function getMockResumeAnalysis(resumeText) {
  const text = (resumeText || '').toLowerCase();
  
  const keywords = ['javascript', 'react', 'node', 'express', 'mongodb', 'python', 'java', 'sql', 'git', 'c++', 'aws', 'docker', 'typescript'];
  const extractedSkills = keywords.filter(k => text.includes(k)).map(s => s.toUpperCase());

  if (extractedSkills.length === 0) {
    extractedSkills.push('JAVASCRIPT', 'HTML', 'CSS', 'GIT');
  }

  let score = 65;
  if (text.includes('education') || text.includes('university') || text.includes('college')) score += 10;
  if (text.includes('experience') || text.includes('intern') || text.includes('freelance')) score += 10;
  if (text.includes('projects') || text.includes('github')) score += 10;
  
  if (score > 90) score = 90;

  const suggestions = [];
  if (!text.includes('docker') && !text.includes('aws')) {
    suggestions.push('Add DevOps / Cloud tools like Docker, Kubernetes, or AWS to improve recruitment matching.');
  }
  if (!text.includes('achievements') && !text.includes('certifications')) {
    suggestions.push('Create a dedicated section for honors, code contest ranks (e.g. LeetCode rating), or course completions.');
  }
  if (text.length < 500) {
    suggestions.push('Expand your project section. Use active verbs and quantify project performance (e.g., "reduced latency by 20%").');
  }

  return {
    ATSScore: score,
    extractedSkills,
    suggestions
  };
}

// @desc    Analyze code solution correctness and Big O complexity
export const analyzeCodeSolution = async (problemName, language, code) => {
  const prompt = `
    You are an expert compiler and technical interviewer.
    Analyze the following code solution written in ${language} for the problem "${problemName}":
    
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Provide a code quality and complexity assessment. Return a JSON object containing:
    1. "correct": true/false based on logical correctness.
    2. "timeComplexity": time complexity in Big O notation (e.g. "O(N log N)").
    3. "spaceComplexity": space complexity in Big O notation (e.g. "O(1)").
    4. "feedback": detailed review explaining logic correctness, edge cases, and optimization advice.
    
    Return only raw JSON. No markdown ticks.
  `;

  if (aiModel) {
    try {
      const result = await aiModel.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanText = text.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.warn('Gemini code analysis error, falling back to simulator:', error.message);
    }
  }

  // Fallback simulator
  return getMockCodeAnalysis(problemName, language, code);
};

function getMockCodeAnalysis(problemName, language, code) {
  const cleanCode = (code || '').trim();
  if (!cleanCode) {
    return {
      correct: false,
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      feedback: 'Please paste your solution inside the coding area to trigger Big-O reviews.'
    };
  }

  let timeComplexity = 'O(N)';
  let spaceComplexity = 'O(1)';
  let feedback = 'Good attempt. The solution seems syntactically valid.';

  if (cleanCode.includes('for') || cleanCode.includes('while')) {
    timeComplexity = 'O(N)';
    const split = cleanCode.split(/for|while/);
    if (split.length > 2) {
      timeComplexity = 'O(N^2)';
      feedback = 'The solution contains nested loops. Consider if this can be optimized to O(N) using a hash map or two-pointer approach.';
    }
  }

  if (cleanCode.includes('Map') || cleanCode.includes('Set') || cleanCode.includes('hash') || cleanCode.includes('[]') || cleanCode.includes('new ')) {
    spaceComplexity = 'O(N)';
  }

  return {
    correct: true,
    timeComplexity,
    spaceComplexity,
    feedback: `${feedback} Big-O is assessed based on loops and storage identifiers.`
  };
}
