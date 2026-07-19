export const PROBLEMS = [
  {
    name: 'Two Sum',
    difficulty: 'Easy',
    isSql: false,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    starters: {
      javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> m;\n        for (int i = 0; i < nums.size(); ++i) {\n            int diff = target - nums[i];\n            if (m.count(diff)) return {m[diff], i};\n            m[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        hashmap = {}\n        for i, num in enumerate(nums):\n            diff = target - num\n            if diff in hashmap: return [hashmap[diff], i]\n            hashmap[num] = i\n        return []`,
      java: `import java.util.*;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) return new int[] { map.get(diff), i };\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}`,
      sql: `-- SQL not applicable`
    }
  },
  {
    name: 'Reverse Linked List',
    difficulty: 'Easy',
    isSql: false,
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    starters: {
      javascript: `function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr !== null) {\n    let next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}`,
      cpp: `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* prev = nullptr, *curr = head;\n        while (curr) {\n            ListNode* next = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n};`,
      python: `class Solution:\n    def reverseList(self, head: ListNode) -> ListNode:\n        prev, curr = None, head\n        while curr:\n            nxt = curr.next\n            curr.next = prev\n            prev, curr = curr, nxt\n        return prev`,
      java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}`,
      sql: `-- SQL not applicable`
    }
  },
  {
    name: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    isSql: false,
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    starters: {
      javascript: `function lengthOfLongestSubstring(s) {\n  let set = new Set(), left = 0, max = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left++]);\n    }\n    set.add(s[right]);\n    max = Math.max(max, right - left + 1);\n  }\n  return max;\n}`,
      cpp: `#include <string>\n#include <unordered_set>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_set<char> st;\n        int left = 0, maxL = 0;\n        for (int right = 0; right < s.length(); ++right) {\n            while (st.count(s[right])) st.erase(s[left++]);\n            st.insert(s[right]);\n            maxL = max(maxL, right - left + 1);\n        }\n        return maxL;\n    }\n};`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        st = set()\n        left = max_len = 0\n        for right in range(len(s)):\n            while s[right] in st:\n                st.remove(s[left])\n                left += 1\n            st.add(s[right])\n            max_len = max(max_len, right - left + 1)\n        return max_len`,
      java: `import java.util.*;\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> set = new HashSet<>();\n        int left = 0, max = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (set.contains(s.charAt(right))) {\n                set.remove(s.charAt(left++));\n            }\n            set.add(s.charAt(right));\n            max = Math.max(max, right - left + 1);\n        }\n        return max;\n    }\n}`,
      sql: `-- SQL not applicable`
    }
  },

  // 100+ Generated Algorithmic Practice Set
  ...Array.from({ length: 90 }).map((_, i) => {
    const titles = [
      '3Sum Triplet Target', 'Container With Most Water', 'Trapping Rain Water', 'Valid Anagram String',
      'Group Anagram Hash', 'Binary Tree Level Order', 'Validate Binary Search Tree', 'Lowest Common Ancestor Tree',
      'Course Schedule Graph Cycle', 'Number of Islands Grid BFS', 'Clone Undirected Graph', 'Pacific Atlantic Water Flow',
      'Word Search Matrix Backtrack', 'Combination Sum Candidates', 'Generate Valid Parentheses', 'Subsets Power Set',
      'Letter Combinations Phone Number', 'House Robber Dynamic Programming', 'Unique Paths Grid DP', 'Coin Change Fewest Coins',
      'Longest Increasing Subsequence', 'Edit Distance String DP', 'Merge Intervals Overlap', 'Insert Interval Overlap',
      'Non-overlapping Intervals Count', 'Meeting Rooms Interval Schedule', 'Rotate Image Matrix 90Deg', 'Spiral Matrix Traversal',
      'Kth Largest Element Array', 'Top K Frequent Elements', 'Find Median Data Stream', 'Merge K Sorted Lists',
      'Search Rotated Sorted Array', 'Find Minimum Rotated Sorted Array', 'Search 2D Matrix Matrix', 'Kth Smallest Element BST',
      'Construct Tree Preorder Inorder', 'Serialize Deserialize Tree', 'Palindromic Substrings Count', 'Longest Palindromic Substring',
      'Word Break Dictionary DP', 'Partition Equal Subset Sum', 'Target Sum Expression DP', 'Maximum Product Subarray'
    ];
    const name = `Problem ${i + 4}: ${titles[i % titles.length]} #${i + 4}`;
    const diff = ['Easy', 'Medium', 'Hard'][i % 3];
    return {
      name,
      difficulty: diff,
      isSql: false,
      description: `Solve ${name} using optimized time complexity and space bounds. Practice sorting, dynamic programming, or graph traversals.`,
      starters: {
        javascript: `function solve(input) {\n  // Write solution here\n  return input;\n}`,
        cpp: `class Solution {\npublic:\n    int solve(int input) {\n        return input;\n    }\n};`,
        python: `class Solution:\n    def solve(self, input: int) -> int:\n        return input`,
        java: `class Solution {\n    public int solve(int input) {\n        return input;\n    }\n}`,
        sql: `-- SQL not applicable`
      }
    };
  }),

  // SQL Questions Set (25 Dedicated Relational Database Queries)
  ...[
    { name: 'Combine Two Tables', diff: 'Easy', desc: 'Report firstName, lastName, city, state for each person using LEFT JOIN.', query: 'SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;' },
    { name: 'Employees Earning More Than Managers', diff: 'Easy', desc: 'Find employees earning higher salary than their managers.', query: 'SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;' },
    { name: 'Duplicate Emails', diff: 'Easy', desc: 'Find duplicate emails in Person table.', query: 'SELECT email FROM Person GROUP BY email HAVING COUNT(email) > 1;' },
    { name: 'Customers Who Never Order', diff: 'Easy', desc: 'Report customers who never placed orders.', query: 'SELECT name AS Customers FROM Customers WHERE id NOT IN (SELECT customerId FROM Orders);' },
    { name: 'Big Countries', diff: 'Easy', desc: 'Report big countries (area > 3M sq km or population > 25M).', query: 'SELECT name, population, area FROM World WHERE area > 3000000 OR population > 25000000;' },
    { name: 'Rising Temperature', diff: 'Easy', desc: 'Find dates with higher temperature than previous day.', query: 'SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;' },
    { name: 'Not Boring Movies', diff: 'Easy', desc: 'Filter odd ID movies with non-boring descriptions.', query: "SELECT id, movie, description, rating FROM Cinema WHERE id % 2 = 1 AND description <> 'boring' ORDER BY rating DESC;" },
    { name: 'Delete Duplicate Emails', diff: 'Easy', desc: 'Delete duplicate emails keeping smallest ID.', query: 'DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id;' },
    { name: 'Rank Scores', diff: 'Medium', desc: 'Rank scores descending with ties sharing ranks.', query: "SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as 'Rank' FROM Scores;" },
    { name: 'Department Highest Salary', diff: 'Medium', desc: 'Report highest paid employee per department.', query: 'SELECT d.name AS Department, e.name AS Employee, e.salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);' },
    { name: 'Nth Highest Salary', diff: 'Medium', desc: 'Query Nth highest salary in Employee table.', query: 'CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT BEGIN RETURN (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET N-1); END' },
    { name: 'Consecutive Numbers', diff: 'Medium', desc: 'Find numbers appearing at least 3 times consecutively.', query: 'SELECT DISTINCT l1.num AS ConsecutiveNums FROM Logs l1, Logs l2, Logs l3 WHERE l1.id = l2.id - 1 AND l2.id = l3.id - 1 AND l1.num = l2.num AND l2.num = l3.num;' },
    { name: 'Find Customer Referee', diff: 'Easy', desc: 'Find customers not referred by customer ID 2.', query: 'SELECT name FROM Customer WHERE referee_id <> 2 OR referee_id IS NULL;' },
    { name: 'Customer Placing Largest Orders', diff: 'Easy', desc: 'Find customer_number with most orders.', query: 'SELECT customer_number FROM Orders GROUP BY customer_number ORDER BY COUNT(*) DESC LIMIT 1;' },
    { name: 'Group Sold Products By Date', diff: 'Easy', desc: 'Find number of distinct products sold per date.', query: 'SELECT sell_date, COUNT(DISTINCT product) AS num_sold, GROUP_CONCAT(DISTINCT product ORDER BY product) AS products FROM Activities GROUP BY sell_date ORDER BY sell_date;' },
    { name: 'Product Sales Analysis I', diff: 'Easy', desc: 'Report product_name, year, price for each sale.', query: 'SELECT p.product_name, s.year, s.price FROM Sales s JOIN Product p ON s.product_id = p.product_id;' },
    { name: 'Project Employees I', diff: 'Easy', desc: 'Report average experience years of employees per project.', query: 'SELECT project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM Project p JOIN Employee e ON p.employee_id = e.employee_id GROUP BY project_id;' },
    { name: 'Fix Names in a Table', diff: 'Easy', desc: 'Capitalize first letter of customer name.', query: "SELECT user_id, CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name FROM Users ORDER BY user_id;" },
    { name: 'Top Travellers', diff: 'Easy', desc: 'Report distance travelled by each user sorted descending.', query: 'SELECT u.name, IFNULL(SUM(r.distance), 0) AS travelled_distance FROM Users u LEFT JOIN Rides r ON u.id = r.user_id GROUP BY u.id ORDER BY travelled_distance DESC, u.name ASC;' },
    { name: 'Sales Person No Red Orders', diff: 'Easy', desc: 'Report names of salespersons with no orders from company RED.', query: 'SELECT name FROM SalesPerson WHERE sales_id NOT IN (SELECT o.sales_id FROM Orders o JOIN Company c ON o.com_id = c.com_id WHERE c.name = "RED");' }
  ].map((sqlItem) => ({
    name: sqlItem.name,
    difficulty: sqlItem.diff,
    isSql: true,
    description: sqlItem.desc,
    starters: {
      javascript: `// Select SQL tab in editor`,
      cpp: `// Select SQL tab in editor`,
      python: `# Select SQL tab in editor`,
      java: `// Select SQL tab in editor`,
      sql: `-- ${sqlItem.name}\n${sqlItem.query}`
    }
  }))
];
