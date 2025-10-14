import axios from "axios";

const USER_API_URL = "http://localhost:9097/api/users";
const QUIZ_API_URL = "http://localhost:9097/api/quizzes";

/* ---------------- USER APIs ---------------- */

export async function signup(data) {
  const res = await axios.post(`${USER_API_URL}/signup`, data);
  return res.data;
}

export async function login(data) {
  const res = await axios.post(`${USER_API_URL}/login`, data);
  return res.data;
}

export async function getAllUsers() {
  const res = await axios.get(`${USER_API_URL}/all`);
  return res.data;
}

/* ---------------- QUIZ APIs ---------------- */

export async function createQuiz(data) {
  const res = await axios.post(QUIZ_API_URL, data);
  return res.data;
}

export async function getAllQuizzes() {
  const res = await axios.get(QUIZ_API_URL);
  return res.data;
}

export async function getMyQuizzes(username) {
  const res = await axios.get(`${QUIZ_API_URL}/myquizzes/${username}`);
  return res.data;
}

export async function deleteQuiz(quizId) {
  await axios.delete(`${QUIZ_API_URL}/${quizId}`);
}

export async function getQuizById(id) {
  const res = await axios.get(`${QUIZ_API_URL}/${id}`);
  return res.data;
}

// ✅ Get quizzes by domain
export async function getQuizzesByDomain(domain) {
  const res = await axios.get(`${QUIZ_API_URL}/domain/${domain}`);
  return res.data;
}

// Submit quiz answers
export async function submitQuiz(id, submission) {
  try {
    const res = await axios.post(`${QUIZ_API_URL}/${id}/submit`, submission);
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 403) {
      throw new Error("You have already attempted this quiz.");
    }
    throw err;
  }
}

// ✅ Get attempted quizzes for disabling already attempted
export async function getAttemptedQuizIds(username) {
  try {
    const quizzes = await getMyQuizzes(username); // Fetches quizzes attempted by user
    return quizzes.map((q) => q.id);
  } catch (err) {
    console.error("Failed to fetch attempted quizzes:", err);
    return [];
  }
}
