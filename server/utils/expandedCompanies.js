export const EXPANDED_COMPANIES = [
  {
    name: 'Google',
    logo: 'chrome',
    difficulty: 'Hard',
    location: 'Mountain View, CA / Bangalore, India',
    requiredSkills: ['Data Structures', 'Algorithms', 'C++', 'Java', 'System Design', 'Graphs'],
    questions: [
      { question: "How would you implement a distributed cache like Memcached?", answer: "Use consistent hashing to distribute keys across cache nodes, with LRU eviction per node.", category: "System Design" },
      { question: "Given a binary tree, return its lowest common ancestor of two nodes.", answer: "Use DFS traversal; node is LCA if both left and right subtrees contain target nodes or node itself matches.", category: "Technical" },
      { question: "Explain Google's PageRank algorithm.", answer: "PageRank models web navigation as a random walk on directed graphs, solving stationary probability distribution.", category: "Technical" }
    ],
    experiences: [{ author: 'Aarav Sharma', role: 'SDE-2', content: 'Focus heavily on graph traversal and DP optimizations.', date: new Date() }]
  },
  {
    name: 'Microsoft',
    logo: 'monitor',
    difficulty: 'Hard',
    location: 'Redmond, WA / Hyderabad, India',
    requiredSkills: ['C#', '.NET', 'SQL', 'OS Concepts', 'Data Structures', 'System Architecture'],
    questions: [
      { question: "Difference between Process and Thread memory space?", answer: "Processes have separate memory address spaces; threads share memory of parent process.", category: "Technical" },
      { question: "Design an LFU (Least Frequently Used) cache.", answer: "Use a hashmap for key-node lookup and a frequency map of doubly-linked lists for O(1) eviction.", category: "Technical" }
    ],
    experiences: [{ author: 'Priya Patel', role: 'Software Engineer 1', content: 'Super collaborative interviewers; asked OS thread locking.', date: new Date() }]
  },
  {
    name: 'Amazon',
    logo: 'shopping-cart',
    difficulty: 'Medium',
    location: 'Seattle, WA / Hyderabad, India',
    requiredSkills: ['AWS', 'Java', 'Object Oriented Design', 'DynamoDB', 'Microservices'],
    questions: [
      { question: "Design Amazon's shopping cart service for prime day peak traffic.", answer: "Use stateless API instances, Redis session caching, and DynamoDB for persistent cart items.", category: "System Design" },
      { question: "Tell me about a time you made a decision based on customer feedback.", answer: "Use STAR method emphasizing Customer Obsession leadership principle.", category: "Behavioral" }
    ],
    experiences: [{ author: 'Rajiv Malhotra', role: 'SDE-1', content: '50% of round is Leadership Principles (STAR format).', date: new Date() }]
  },
  {
    name: 'Apple',
    logo: 'award',
    difficulty: 'Hard',
    location: 'Cupertino, CA / Bangalore, India',
    requiredSkills: ['Swift', 'Objective-C', 'Embedded C', 'CoreOS', 'Hardware Architectures'],
    questions: [
      { question: "How does Automatic Reference Counting (ARC) work in Swift?", answer: "ARC tracks reference count of class instances and frees memory when count drops to zero.", category: "Technical" },
      { question: "How do you detect memory leaks in iOS apps?", answer: "Use Xcode Memory Graph Debugger and Instruments Leaks tool.", category: "Technical" }
    ],
    experiences: [{ author: 'Vikram Singh', role: 'iOS Architect', content: 'Deep questions on hardware memory registers and Swift retain cycles.', date: new Date() }]
  },
  {
    name: 'Meta',
    logo: 'globe',
    difficulty: 'Hard',
    location: 'Menlo Park, CA / Bangalore, India',
    requiredSkills: ['React', 'GraphQL', 'PHP/Hack', 'Distributed Systems', 'Big Data'],
    questions: [
      { question: "Explain Meta's TAO caching architecture.", answer: "TAO is a distributed caching layer built over MySQL to handle graph-based queries at scale.", category: "System Design" },
      { question: "How does React Virtual DOM reconciliation work?", answer: "Diffing algorithm compares virtual DOM trees in O(n) using key properties and batch DOM updates.", category: "Technical" }
    ],
    experiences: [{ author: 'Aditya Sen', role: 'Production Engineer', content: 'Rapid coding speed is required. Expect 2 Leetcode Hard/Medium in 45 mins.', date: new Date() }]
  },
  {
    name: 'Netflix',
    logo: 'chrome',
    difficulty: 'Hard',
    location: 'Los Gatos, CA / Mumbai, India',
    requiredSkills: ['Chaos Engineering', 'Video Compression', 'Java', 'Microservices', 'CDN'],
    questions: [
      { question: "What is Chaos Engineering and Chaos Monkey?", answer: "Intentionally failing random production services to verify resilience and automated fallback.", category: "System Design" }
    ],
    experiences: [{ author: 'Rohan Mehta', role: 'Senior SDE', content: 'High culture density; tests freedom & responsibility mindset.', date: new Date() }]
  },
  {
    name: 'Stripe',
    logo: 'briefcase',
    difficulty: 'Hard',
    location: 'San Francisco, CA / Remote',
    requiredSkills: ['Ruby', 'Go', 'API Design', 'Financial Systems', 'Distributed Transactions'],
    questions: [
      { question: "How do you ensure Idempotency in Payment APIs?", answer: "Use an Idempotency-Key HTTP header and store API response signatures in a fast cache.", category: "System Design" }
    ],
    experiences: [{ author: 'Evelyn Zhang', role: 'Staff Engineer', content: 'Practical coding on actual codebase with real API documentation.', date: new Date() }]
  },
  {
    name: 'Uber',
    logo: 'globe',
    difficulty: 'Hard',
    location: 'San Francisco, CA / Bangalore, India',
    requiredSkills: ['Geospatial Queries', 'Go', 'Kafka', 'Cassandra', 'Microservices'],
    questions: [
      { question: "Design Uber's driver matching system.", answer: "Use GeoHash indexing (H3) to partition maps and match drivers within spatial buckets.", category: "System Design" }
    ],
    experiences: [{ author: 'Karan Joshi', role: 'Senior SDE', content: 'Heavy spatial indexing queries and high throughput streaming.', date: new Date() }]
  },
  {
    name: 'Airbnb',
    logo: 'building',
    difficulty: 'Hard',
    location: 'San Francisco, CA / Gurgaon, India',
    requiredSkills: ['React', 'Java', 'ElasticSearch', 'GraphQL', 'System Design'],
    questions: [
      { question: "Design a search ranking pipeline for property listings.", answer: "Inverted index search with ElasticSearch combined with real-time ML ranking models.", category: "System Design" }
    ],
    experiences: [{ author: 'Siddharth Rao', role: 'Full Stack Engineer', content: 'Focus on clean architecture and UI component modularity.', date: new Date() }]
  },
  {
    name: 'Snowflake',
    logo: 'monitor',
    difficulty: 'Hard',
    location: 'Bozeman, MT / Bangalore, India',
    requiredSkills: ['C++', 'Java', 'Distributed Databases', 'Columnar Storage', 'Query Engines'],
    questions: [
      { question: "What is columnar storage and why is it faster for OLAP queries?", answer: "Columnar format stores data by columns rather than rows, minimizing I/O read bandwidth.", category: "Technical" }
    ],
    experiences: [{ author: 'Rahul Deshmukh', role: 'Database SDE', content: 'Deep internals on cloud data warehousing and query optimization.', date: new Date() }]
  },
  {
    name: 'Databricks',
    logo: 'award',
    difficulty: 'Hard',
    location: 'San Francisco, CA / Bangalore, India',
    requiredSkills: ['Apache Spark', 'Scala', 'C++', 'Distributed Computing', 'Delta Lake'],
    questions: [
      { question: "Explain Spark RDD transformations vs actions.", answer: "Transformations are lazy operations (map/filter); actions (count/collect) trigger computation DAG.", category: "Technical" }
    ],
    experiences: [{ author: 'Nikhil Verma', role: 'Distributed Systems Engineer', content: 'Exacting standards on concurrency and memory management.', date: new Date() }]
  },
  {
    name: 'Atlassian',
    logo: 'briefcase',
    difficulty: 'Medium',
    location: 'Sydney, Australia / Bangalore, India',
    requiredSkills: ['Java', 'React', 'Microservices', 'REST APIs', 'PostgreSQL'],
    questions: [
      { question: "Design Jira issue tracking status workflow.", answer: "Use state machine pattern with event listeners for notification triggers.", category: "System Design" }
    ],
    experiences: [{ author: 'Neha Gupta', role: 'Senior SDE', content: 'Values alignment round is as crucial as technical interview.', date: new Date() }]
  },
  {
    name: 'Nvidia',
    logo: 'monitor',
    difficulty: 'Hard',
    location: 'Santa Clara, CA / Bangalore, India',
    requiredSkills: ['CUDA', 'C++', 'GPU Architecture', 'Deep Learning', 'Computer Vision'],
    questions: [
      { question: "How does CUDA thread block allocation work on Streaming Multiprocessors?", answer: "SM schedules warps (32 threads) concurrently using SIMT (Single Instruction Multiple Threads).", category: "Technical" }
    ],
    experiences: [{ author: 'Arjun Nair', role: 'AI Systems Architect', content: 'Requires hardware level matrix calculation knowledge.', date: new Date() }]
  },
  {
    name: 'Tesla',
    logo: 'monitor',
    difficulty: 'Hard',
    location: 'Austin, TX / Fremont, CA',
    requiredSkills: ['Autopilot APIs', 'Computer Vision', 'C++', 'Control Systems', 'Embedded Systems'],
    questions: [
      { question: "How does sensor fusion work in autonomous driving?", answer: "Aggregates camera streams and radar signals into a unified 3D obstacle occupancy grid.", category: "Technical" }
    ],
    experiences: [{ author: 'Kabir Sen', role: 'Autopilot Engineer', content: 'Tests real-time C++ efficiency and computer vision filters.', date: new Date() }]
  },
  {
    name: 'SpaceX',
    logo: 'award',
    difficulty: 'Hard',
    location: 'Hawthorne, CA / Starbase, TX',
    requiredSkills: ['C++', 'Flight Software', 'Linux Kernel', 'Telemetry', 'Hard Real-Time'],
    questions: [
      { question: "How do real-time operating systems prevent priority inversion?", answer: "Using Priority Inheritance Protocols where low priority thread temporarily inherits high priority.", category: "Technical" }
    ],
    experiences: [{ author: 'Devon Miller', role: 'Flight Software Engineer', content: 'High rigor on zero-fault software tolerance and telemetry.', date: new Date() }]
  },
  {
    name: 'Palantir',
    logo: 'globe',
    difficulty: 'Hard',
    location: 'Denver, CO / London, UK',
    requiredSkills: ['Java', 'TypeScript', 'Ontology Engine', 'Data Security', 'Distributed Systems'],
    questions: [
      { question: "Explain fine-grained access control on graph-structured data.", answer: "Apply security label tags on graph nodes and edges to evaluate caller ACL permissions.", category: "Technical" }
    ],
    experiences: [{ author: 'Marcus Vance', role: 'Forward Deployed Engineer', content: 'Fast-paced environment; deep product and deployment focus.', date: new Date() }]
  },
  {
    name: 'Salesforce',
    logo: 'briefcase',
    difficulty: 'Medium',
    location: 'San Francisco, CA / Hyderabad, India',
    requiredSkills: ['Apex', 'SOQL', 'Java', 'Cloud Architectures', 'CRM'],
    questions: [
      { question: "What are Governor Limits in multi-tenant cloud architectures?", answer: "Execution constraints on CPU time, database queries, and memory to prevent tenant noisy neighbors.", category: "Technical" }
    ],
    experiences: [{ author: 'Preeti Rao', role: 'MTS Engineer', content: 'Asks multi-tenant design patterns and database locking.', date: new Date() }]
  },
  {
    name: 'Adobe',
    logo: 'monitor',
    difficulty: 'Hard',
    location: 'San Jose, CA / Noida, India',
    requiredSkills: ['C++', 'Graphics Pipeline', 'Image Processing', 'Algorithms', 'WebAssembly'],
    questions: [
      { question: "How do you implement Undo/Redo operations in graphic applications?", answer: "Use Command Design pattern storing executable operation objects on undo/redo stacks.", category: "Technical" }
    ],
    experiences: [{ author: 'Megha Gupta', role: 'Software Engineer 2', content: 'Tests design patterns, dynamic memory, and rendering pipelines.', date: new Date() }]
  },
  {
    name: 'Cisco',
    logo: 'briefcase',
    difficulty: 'Medium',
    location: 'San Jose, CA / Bangalore, India',
    requiredSkills: ['TCP/IP', 'Routing Protocols', 'C', 'Network Security', 'Linux'],
    questions: [
      { question: "Explain TCP 3-way handshake and packet flags.", answer: "Client sends SYN, server responds with SYN-ACK, client completes connection with ACK.", category: "Technical" }
    ],
    experiences: [{ author: 'Karan Malhotra', role: 'Network Engineer', content: 'Networking fundamentals, socket programming, and OS kernels.', date: new Date() }]
  },
  {
    name: 'Oracle',
    logo: 'building',
    difficulty: 'Medium',
    location: 'Austin, TX / Hyderabad, India',
    requiredSkills: ['SQL', 'Database Internals', 'Java', 'PL/SQL', 'Cloud Infrastructure'],
    questions: [
      { question: "Clustered vs Non-Clustered index in SQL database?", answer: "Clustered index alters physical row ordering; non-clustered creates separate pointer table.", category: "Technical" }
    ],
    experiences: [{ author: 'Sonal Verma', role: 'DB Analyst', content: 'Deep SQL optimization, execution plans, and transaction isolation levels.', date: new Date() }]
  },
  {
    name: 'Intel',
    logo: 'award',
    difficulty: 'Medium',
    location: 'Santa Clara, CA / Bangalore, India',
    requiredSkills: ['Assembly', 'Computer Architecture', 'C', 'Verilog', 'Compilers'],
    questions: [
      { question: "Explain instruction pipelining and pipeline hazards.", answer: "Pipelining overlaps instruction execution; hazards include structural, data, and control dependencies.", category: "Technical" }
    ],
    experiences: [{ author: 'Anil Mehta', role: 'Hardware Engineer', content: 'Computer architecture, memory hierarchy, and C micro-optimizations.', date: new Date() }]
  },
  {
    name: 'TCS',
    logo: 'briefcase',
    difficulty: 'Easy',
    location: 'Mumbai, India / Global Delivery Centers',
    requiredSkills: ['Java', 'C', 'HTML/CSS', 'SQL Basics', 'Aptitude'],
    questions: [
      { question: "What is OOP and explain its 4 key pillars?", answer: "Encapsulation, Abstraction, Inheritance, Polymorphism.", category: "Technical" }
    ],
    experiences: [{ author: 'Suman Sen', role: 'Ninja SDE', content: 'Aptitude round followed by basic Java and SQL queries.', date: new Date() }]
  },
  {
    name: 'Infosys',
    logo: 'award',
    difficulty: 'Easy',
    location: 'Bangalore, India / Global',
    requiredSkills: ['Python', 'DBMS', 'Java', 'Software Engineering Lifecycle'],
    questions: [
      { question: "Explain the difference between Agile and Waterfall software models.", answer: "Agile is iterative and flexible; Waterfall is sequential and rigid.", category: "Technical" }
    ],
    experiences: [{ author: 'Ananya Roy', role: 'System Engineer', content: 'Conceptual questions on SDLC, SQL joins, and coding project.', date: new Date() }]
  },
  {
    name: 'Accenture',
    logo: 'globe',
    difficulty: 'Easy',
    location: 'Dublin, Ireland / Bangalore, India',
    requiredSkills: ['Aptitude', 'JavaScript', 'SQL Basics', 'Cloud Fundamentals'],
    questions: [
      { question: "Difference between SQL and NoSQL databases?", answer: "SQL is relational and structured; NoSQL is document/key-value based and schema-less.", category: "Technical" }
    ],
    experiences: [{ author: 'Ravi Kumar', role: 'Associate SDE', content: 'Aptitude test followed by academic project evaluation.', date: new Date() }]
  },
  {
    name: 'Wipro',
    logo: 'award',
    difficulty: 'Easy',
    location: 'Bangalore, India / Global',
    requiredSkills: ['Java Basics', 'SQL', 'Aptitude', 'Communication'],
    questions: [
      { question: "What is method overriding in Java?", answer: "Subclass providing specific implementation of a method declared in parent class.", category: "Technical" }
    ],
    experiences: [{ author: 'Kirti Shaw', role: 'Project Engineer', content: 'Technical screening focused on Java syntax and basic algorithms.', date: new Date() }]
  }
];
