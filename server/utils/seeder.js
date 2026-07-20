import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Schema imports
import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import DSAProgress from '../models/DSAProgress.js';
import { googleQuestions, microsoftQuestions, amazonQuestions, tcsQuestions, infosysQuestions, accentureQuestions } from './companyQuestions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/talentsphere_db');
    console.log('Connected to MongoDB database for seeding...');
  } catch (err) {
    console.error('Database connection failed in seeder:', err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear collections
    await User.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Interview.deleteMany();
    await Resume.deleteMany();
    await DSAProgress.deleteMany();

    console.log('Cleaned pre-existing MongoDB records.');

    // 1. Create Core Users
    const admin = await User.create({
      name: 'Dev Sharma (Platform Owner)',
      email: 'admin.devsharma@careeros.com',
      password: 'DevSharma#Admin2026!Pass',
      role: 'admin'
    });

    const recruiter = await User.create({
      name: 'Pooja Sharma (Google HR)',
      email: 'recruiter@talentsphere.com',
      password: 'recruiterpassword123',
      role: 'recruiter'
    });

    const student = await User.create({
      name: 'Dev Mishra',
      email: 'student@talentsphere.com',
      password: 'studentpassword123',
      role: 'student',
      skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
      education: [
        {
          school: 'State Institute of Engineering',
          degree: 'Bachelor of Technology',
          fieldOfStudy: 'Computer Science and Engineering',
          startYear: '2023',
          endYear: '2027',
          grade: '9.2 CGPA'
        }
      ]
    });

    const student2 = await User.create({
      name: 'Rohan Sharma',
      email: 'rohan@talentsphere.com',
      password: 'studentpassword123',
      role: 'student',
      skills: ['Python', 'Django', 'SQL'],
      education: [{ school: 'IIT Bombay', degree: 'B.Tech', fieldOfStudy: 'EE', startYear: '2022', endYear: '2026', grade: '9.0 CGPA' }]
    });

    const student3 = await User.create({
      name: 'Ananya Roy',
      email: 'ananya@talentsphere.com',
      password: 'studentpassword123',
      role: 'student',
      skills: ['Java', 'Spring Boot', 'MongoDB'],
      education: [{ school: 'NIT Trichy', degree: 'B.Tech', fieldOfStudy: 'CS', startYear: '2023', endYear: '2027', grade: '9.5 CGPA' }]
    });

    const student4 = await User.create({
      name: 'Amit Patel',
      email: 'amit@talentsphere.com',
      password: 'studentpassword123',
      role: 'student',
      skills: ['C++', 'Algorithms'],
      education: [{ school: 'BITS Pilani', degree: 'B.Tech', fieldOfStudy: 'CS', startYear: '2022', endYear: '2026', grade: '8.9 CGPA' }]
    });

    console.log('Seeded Administrator, Recruiter, and multiple Student profiles.');

    // 2. Create Companies
    const companiesData = [
      {
        companyName: 'Google',
        logo: 'chrome',
        difficulty: 'Hard',
        requiredSkills: ['Data Structures', 'Algorithms', 'C++', 'Java', 'System Design'],
        interviewQuestions: googleQuestions,
        experiences: [
          {
            author: 'Aarav Sharma',
            role: 'Software Engineer L3',
            content: 'The interview process consisted of 1 resume screen, 1 phone screen, and 4 coding/system design rounds. Questions were heavily focused on graph traversal, dynamic programming, and scaling distributed search.',
            date: new Date()
          }
        ]
      },
      {
        companyName: 'Microsoft',
        logo: 'monitor',
        difficulty: 'Hard',
        requiredSkills: ['Data Structures', 'System Design', 'C#', 'SQL', 'OS Concepts'],
        interviewQuestions: microsoftQuestions,
        experiences: [
          {
            author: 'Priya Patel',
            role: 'Software Engineer 1',
            content: 'Microsoft rounds were highly cooperative. They asked about operating system concepts and double linked list modifications.',
            date: new Date()
          }
        ]
      },
      {
        companyName: 'Amazon',
        logo: 'shopping-cart',
        difficulty: 'Medium',
        requiredSkills: ['Object Oriented Design', 'Algorithms', 'Java', 'AWS', 'SQL'],
        interviewQuestions: amazonQuestions,
        experiences: [
          {
            author: 'Rajiv Malhotra',
            role: 'SDE-1',
            content: 'They focus intensely on Leadership Principles. Behavior-based rounds take half the time, and the technical half consists of medium-level LeetCode arrays and hashing.',
            date: new Date()
          }
        ]
      },
      {
        companyName: 'TCS',
        logo: 'briefcase',
        difficulty: 'Easy',
        requiredSkills: ['Java', 'C', 'HTML/CSS', 'SQL Basics'],
        interviewQuestions: tcsQuestions,
        experiences: [
          {
            author: 'Suman Sen',
            role: 'Ninja SDE',
            content: 'The TCS Ninja selection has an aptitude round and an interview round covering basic Java structures, SQL join outputs, and projects.',
            date: new Date()
          }
        ]
      },
      {
        companyName: 'Infosys',
        logo: 'award',
        difficulty: 'Easy',
        requiredSkills: ['Python', 'DBMS', 'Java', 'Software Engineering Lifecycle'],
        interviewQuestions: infosysQuestions,
        experiences: [
          {
            author: 'Ananya Roy',
            role: 'System Engineer',
            content: 'Infosys asks direct, conceptual questions about Java, Python syntax, SDLC models (waterfall vs agile), and simple SQL queries.',
            date: new Date()
          }
        ]
      },
      {
        companyName: 'Accenture',
        logo: 'globe',
        difficulty: 'Easy',
        requiredSkills: ['Aptitude', 'JavaScript', 'SQL Basics', 'Agile Principles'],
        interviewQuestions: accentureQuestions,
        experiences: [
          {
            author: 'Ravi Kumar',
            role: 'Associate SDE',
            content: 'Accenture focus was heavily on aptitude assessment followed by a single interview asking about academic coding projects, DBMS schemas, and cloud basics.',
            date: new Date()
          }
        ]
      },
      {
        companyName: 'Apple',
        logo: 'award',
        difficulty: 'Hard',
        requiredSkills: ['Swift', 'Objective-C', 'Embedded C', 'CoreOS', 'Hardware Architectures'],
        interviewQuestions: [
          { question: "What is reference counting in Swift?", answer: "Swift uses Automatic Reference Counting (ARC) to track and manage memory. It deallocates instances when reference counts drop to zero.", category: "Technical" },
          { question: "Explain the difference between class and struct in Swift.", answer: "Classes are reference types (stored on heap), support inheritance. Structs are value types (stored on stack), copied when passed.", category: "Technical" }
        ],
        experiences: [
          { author: 'Vikram Singh', role: 'iOS Architect', content: 'Apple interviews focus heavily on runtime efficiency, hardware constraints, and memory cycles.', date: new Date() }
        ]
      },
      {
        companyName: 'Adobe',
        logo: 'monitor',
        difficulty: 'Hard',
        requiredSkills: ['C++', 'Graphics Pipeline', 'Image Processing', 'Algorithms', 'Design Patterns'],
        interviewQuestions: [
          { question: "How do you implement Undo/Redo operations?", answer: "Use the Command Design Pattern. Store command operations in two stacks: an Undo stack and a Redo stack.", category: "Technical" }
        ],
        experiences: [
          { author: 'Megha Gupta', role: 'Software Engineer 2', content: 'Adobe tests deep algorithmic concepts and advanced object-oriented design patterns.', date: new Date() }
        ]
      },
      {
        companyName: 'Netflix',
        logo: 'chrome',
        difficulty: 'Hard',
        requiredSkills: ['Chaos Engineering', 'Video Compression', 'CDN', 'Java', 'Microservices'],
        interviewQuestions: [
          { question: "What is Chaos Engineering?", answer: "The practice of intentionally injecting failures (like shutting down instances) in production to verify system resilience.", category: "Technical" }
        ],
        experiences: [
          { author: 'Rohan Mehta', role: 'Senior SDE', content: 'Netflix checks system design, CDN configurations, and microservices fault tolerance.', date: new Date() }
        ]
      },
      {
        companyName: 'Meta',
        logo: 'globe',
        difficulty: 'Hard',
        requiredSkills: ['React', 'TAO Cache', 'Graph DB', 'Distributed Systems', 'Product Design'],
        interviewQuestions: [
          { question: "Describe Meta's TAO caching layer.", answer: "TAO is a geographically distributed graph store that provides low-latency access to social graph items using write-through cache clusters.", category: "Technical" }
        ],
        experiences: [
          { author: 'Aditya Sen', role: 'Production Engineer', content: 'Meta tests graph query optimization, database replication, and high-concurrency systems.', date: new Date() }
        ]
      },
      {
        companyName: 'Oracle',
        logo: 'building',
        difficulty: 'Medium',
        requiredSkills: ['SQL', 'Database Internals', 'Java', 'PL/SQL', 'Cloud Infrastructure'],
        interviewQuestions: [
          { question: "What is the difference between clustered and non-clustered indexes?", answer: "Clustered indexes define the physical order of database rows (1 per table). Non-clustered indexes build logical pointers to rows.", category: "Technical" }
        ],
        experiences: [
          { author: 'Sonal Verma', role: 'DB Analyst', content: 'Oracle focus is SQL queries, ACID properties, locking mechanisms, and Java runtime basics.', date: new Date() }
        ]
      },
      {
        companyName: 'Cisco',
        logo: 'briefcase',
        difficulty: 'Medium',
        requiredSkills: ['Routing Protocols', 'TCP/IP', 'C', 'Network Security', 'Linux Kernel'],
        interviewQuestions: [
          { question: "How does the TCP 3-way handshake work?", answer: "Client sends SYN, server replies SYN-ACK, client sends ACK. Connection established.", category: "Technical" }
        ],
        experiences: [
          { author: 'Karan Malhotra', role: 'Network Engineer', content: 'Cisco asks networking headers, socket programming in C, and network security profiles.', date: new Date() }
        ]
      },
      {
        companyName: 'IBM',
        logo: 'monitor',
        difficulty: 'Medium',
        requiredSkills: ['Cloud Systems', 'AI/ML', 'Enterprise Architectures', 'Mainframe', 'Docker'],
        interviewQuestions: [
          { question: "What is virtualization in cloud computing?", answer: "The process of creating virtual representations of physical servers, storage, and networks using hypervisors.", category: "Technical" }
        ],
        experiences: [
          { author: 'Deepak Sen', role: 'Cloud Engineer', content: 'IBM focuses on enterprise tools, virtualization, Docker containers, and REST APIs.', date: new Date() }
        ]
      },
      {
        companyName: 'Wipro',
        logo: 'award',
        difficulty: 'Easy',
        requiredSkills: ['Java Basics', 'SQL', 'Aptitude', 'Java EE'],
        interviewQuestions: [
          { question: "What is polymorphism in Java?", answer: "The ability of an object to take on many forms. Demonstrated via method overloading (static) and method overriding (dynamic).", category: "Technical" }
        ],
        experiences: [
          { author: 'Kirti Shaw', role: 'Project Engineer', content: 'Wipro interviews cover basic Java programming, simple SQL statements, and aptitude.', date: new Date() }
        ]
      },
      {
        companyName: 'Cognizant',
        logo: 'building',
        difficulty: 'Easy',
        requiredSkills: ['C#', 'SQL Basics', 'DBMS', 'Web Services'],
        interviewQuestions: [
          { question: "Explain the difference between WHERE and HAVING in SQL.", answer: "WHERE filters rows before aggregation. HAVING filters aggregated groups.", category: "Technical" }
        ],
        experiences: [
          { author: 'Tarun Das', role: 'Programmer Analyst', content: 'Cognizant tests database tables design, SQL queries, and basic software engineering lifecycle steps.', date: new Date() }
        ]
      },
      {
        companyName: 'HCLTech',
        logo: 'monitor',
        difficulty: 'Easy',
        requiredSkills: ['C++', 'Infrastructure Management', 'Linux', 'Helpdesk APIs'],
        interviewQuestions: [
          { question: "What is a pointer in C++?", answer: "A variable that stores the memory address of another variable.", category: "Technical" }
        ],
        experiences: [
          { author: 'Nisha Gupta', role: 'Associate Engineer', content: 'HCLTech checks basic programming, operating system commands, and relational database basics.', date: new Date() }
        ]
      },
      {
        companyName: 'Intel',
        logo: 'award',
        difficulty: 'Medium',
        requiredSkills: ['Assembly', 'Computer Architecture', 'C', 'Verilog', 'Microprocessors'],
        interviewQuestions: [
          { question: "What is pipelining in computer architecture?", answer: "Pipelining overlaps instruction execution phases to maximize throughput.", category: "Technical" }
        ],
        experiences: [
          { author: 'Anil Mehta', role: 'Hardware Engineer', content: 'Intel asks processor designs and low-level pipeline dependencies.', date: new Date() }
        ]
      },
      {
        companyName: 'Qualcomm',
        logo: 'globe',
        difficulty: 'Hard',
        requiredSkills: ['Embedded Systems', 'RTOS', 'C', 'Digital Signal Processing'],
        interviewQuestions: [
          { question: "What is an RTOS?", answer: "A Real-Time Operating System that guarantees deterministic scheduling deadlines.", category: "Technical" }
        ],
        experiences: [
          { author: 'Sanjay Dutt', role: 'Embedded Architect', content: 'Qualcomm tests interrupt latency and signal structures.', date: new Date() }
        ]
      },
      {
        companyName: 'Salesforce',
        logo: 'briefcase',
        difficulty: 'Medium',
        requiredSkills: ['Apex', 'SOQL', 'Java', 'Cloud Architectures', 'SaaS Models'],
        interviewQuestions: [
          { question: "What are governor limits in Salesforce Apex?", answer: "Runtime limits enforced to prevent scripts from hogging multi-tenant resources.", category: "Technical" }
        ],
        experiences: [
          { author: 'Preeti Rao', role: 'MTS Engineer', content: 'Salesforce tests object mappings and CRM API structures.', date: new Date() }
        ]
      },
      {
        companyName: 'Tesla',
        logo: 'monitor',
        difficulty: 'Hard',
        requiredSkills: ['Autopilot APIs', 'Computer Vision', 'C++', 'Control Systems'],
        interviewQuestions: [
          { question: "How does sensor fusion work in autonomous driving?", answer: "Aggregating camera and radar signals to form a low-error obstacle map.", category: "Technical" }
        ],
        experiences: [
          { author: 'Kabir Sen', role: 'Autopilot Engineer', content: 'Tesla tests real-time computer vision and memory constraints.', date: new Date() }
        ]
      }
    ];

    const companyLocations = {
      'Google': 'Mountain View, CA / Bangalore, India',
      'Microsoft': 'Redmond, WA / Hyderabad, India',
      'Amazon': 'Seattle, WA / Hyderabad, India',
      'TCS': 'Mumbai, India',
      'Infosys': 'Bangalore, India',
      'Accenture': 'Dublin, Ireland / Bangalore, India',
      'Apple': 'Cupertino, CA / Bangalore, India',
      'Adobe': 'San Jose, CA / Noida, India',
      'Netflix': 'Los Gatos, CA / Mumbai, India',
      'Meta': 'Menlo Park, CA / Bangalore, India',
      'Oracle': 'Austin, TX / Hyderabad, India',
      'Cisco': 'San Jose, CA / Bangalore, India',
      'IBM': 'Armonk, NY / Bangalore, India',
      'Wipro': 'Bangalore, India',
      'Cognizant': 'Teaneck, NJ / Chennai, India',
      'HCLTech': 'Noida, India',
      'Intel': 'Santa Clara, CA / Bangalore, India',
      'Qualcomm': 'San Diego, CA / Hyderabad, India',
      'Salesforce': 'San Francisco, CA / Hyderabad, India',
      'Tesla': 'Austin, TX / Fremont, CA'
    };

    const allQuestions = [
      ...googleQuestions,
      ...microsoftQuestions,
      ...amazonQuestions,
      ...tcsQuestions,
      ...infosysQuestions,
      ...accentureQuestions
    ];

    const finalCompaniesData = companiesData.map(c => ({
      ...c,
      location: companyLocations[c.companyName] || 'Multiple Global Locations',
      interviewQuestions: allQuestions
    }));

    const seededCompanies = await Company.insertMany(finalCompaniesData);
    console.log(`Seeded ${seededCompanies.length} company guides.`);

    // 3. Create Sample Jobs
    await Job.create([
      {
        recruiterId: recruiter._id,
        companyName: 'Google',
        title: 'Software Engineering Intern (Summer 2027)',
        description: 'Google is looking for ambitious computer science students to join our engineering teams. You will work on real-world projects that scale to billions of users, collaborate with senior mentors, and write production-level code.',
        location: 'Bangalore, India',
        salary: '₹100,000 / month',
        requirements: ['Enrolled in B.Tech/M.Tech Computer Science', 'Strong foundation in algorithms and complex graph structures', 'Familiarity with C++, Java, or Python', 'Experience in backend development is a plus'],
        applicants: []
      },
      {
        recruiterId: recruiter._id,
        companyName: 'Amazon',
        title: 'Full Stack Placement Associate',
        description: 'Join Amazon Web Services (AWS) team as a Full Stack placement associate. You will build and optimize customer-facing portals, implement serverless REST microservices, and deploy responsive UI elements.',
        location: 'Hyderabad, India (Hybrid)',
        salary: '₹1,500,000 / annum',
        requirements: ['Knowledge of React, Node.js, Express, and MongoDB', 'Familiarity with AWS Lambda, API Gateway, and S3', 'Excellent problem solving skills'],
        applicants: []
      },
      {
        recruiterId: recruiter._id,
        companyName: 'Microsoft',
        title: 'Graduate Developer - Azure Team',
        description: 'Build core components of Azure Cloud Systems. Design scalable schemas, optimize SQL procedures, and secure backend routing pipelines.',
        location: 'Remote, India',
        salary: '₹1,800,000 / annum',
        requirements: ['Excellent debugging skills in C# or Java', 'Knowledge of cloud principles and virtualization', 'Solid understanding of Operating Systems and concurrency models'],
        applicants: [student._id]
      }
    ]);

    console.log('Seeded job listings.');

    // 4. Seed DSA Progress categories & Interviews for rankings
    const dsaTopics = ['Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees', 'Graph', 'Dynamic Programming'];
    
    // Dev Mishra: Solves everything (First Place)
    for (let topic of dsaTopics) {
      await DSAProgress.create({
        userId: student._id,
        topic,
        solvedProblems: [
          { name: `Solve 2Sum under ${topic}`, difficulty: 'Easy', solvedAt: new Date(Date.now() - 86400000) },
          { name: `Solve MaxSubarray under ${topic}`, difficulty: 'Medium', solvedAt: new Date() }
        ],
        progress: 15
      });
    }
    await Interview.create({ userId: student._id, topic: 'Full Stack', role: 'SDE-1', score: 9.2, difficulty: 'Medium', experienceLevel: 'Entry Level', answers: [], date: new Date() });

    // Ananya Roy: Solves 8 problems (Second Place)
    for (let topic of dsaTopics) {
      await DSAProgress.create({
        userId: student3._id,
        topic,
        solvedProblems: [
          { name: `Solve 2Sum under ${topic}`, difficulty: 'Easy', solvedAt: new Date(Date.now() - 172800000) }
        ],
        progress: 8
      });
    }
    await Interview.create({ userId: student3._id, topic: 'Java Backend', role: 'SDE-1', score: 8.8, difficulty: 'Medium', experienceLevel: 'Entry Level', answers: [], date: new Date() });

    // Rohan Sharma: Solves 6 problems (Third Place)
    for (let i = 0; i < 6; i++) {
      await DSAProgress.create({
        userId: student2._id,
        topic: dsaTopics[i],
        solvedProblems: [
          { name: `Solve 2Sum under ${dsaTopics[i]}`, difficulty: 'Easy', solvedAt: new Date() }
        ],
        progress: 5
      });
    }
    await Interview.create({ userId: student2._id, topic: 'Python Backend', role: 'SDE-1', score: 8.2, difficulty: 'Medium', experienceLevel: 'Entry Level', answers: [], date: new Date() });

    // Amit Patel: Solves 3 problems (Fourth Place)
    for (let i = 0; i < 3; i++) {
      await DSAProgress.create({
        userId: student4._id,
        topic: dsaTopics[i],
        solvedProblems: [
          { name: `Solve 2Sum under ${dsaTopics[i]}`, difficulty: 'Easy', solvedAt: new Date() }
        ],
        progress: 3
      });
    }
    await Interview.create({ userId: student4._id, topic: 'C++ Systems', role: 'SDE-1', score: 7.5, difficulty: 'Medium', experienceLevel: 'Entry Level', answers: [], date: new Date() });

    console.log('Seeded DSA Tracker and Mock Interviews for rankings.');
    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process crashed:', error.message);
    process.exit(1);
  }
};

seedData();
