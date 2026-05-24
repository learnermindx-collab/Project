import axios from 'axios';
import { performance } from 'perf_hooks';

const BASE_URL = 'http://localhost:5000/api'; // Adjust if different port
const TOKEN = 'your-jwt-token-here'; // Get from login /auth/login, set manually

async function benchmark(endpoint, times = 50) {
  console.log(`Benchmarking ${endpoint} (${times}x)...`);
  let total = 0;
  for (let i = 0; i < times; i++) {
    const start = performance.now();
    try {
      const res = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      const end = performance.now();
      total += end - start;
      if (i === 0) console.log('First call (cold/cache miss):', Math.round(end - start), 'ms');
      else if (i === times - 1) console.log('Last call (warm/cache hit):', Math.round(end - start), 'ms');
    } catch (err) {
      console.error('Request failed:', err.message);
    }
  }
  console.log(`Avg time: ${Math.round(total / times)} ms\n`);
}

// Run
async function runBenchmarks() {
  await benchmark('/projects/my', 20); // Student
  await benchmark('/projects/supervisor', 20); // Supervisor
  await benchmark('/projects/all', 20); // HOD
}

runBenchmarks().catch(console.error);

// Usage:
// 1. npm start (server)
// 2. Login to get TOKEN
// 3. docker redis running
// 4. node benchmark.js
// Compare before/after cache enables (restart server)
