import React, { useEffect, useState } from "react";
import { getMyQuizzes, deleteQuiz } from "./api";
import axios from "axios";
import "./MyQuizzes.css";

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewQuiz, setViewQuiz] = useState(null);       // For questions modal
  const [resultsQuiz, setResultsQuiz] = useState(null); // For results modal
  const [results, setResults] = useState([]);           // Stores results
  const [deletingId, setDeletingId] = useState(null);

  const username = localStorage.getItem("fullName"); // must match your login storage

  // Fetch quizzes on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (!username) throw new Error("Username not found in localStorage.");
        const data = await getMyQuizzes(username);
        setQuizzes(data);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        alert("Failed to fetch your quizzes!");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [username]);

  // Delete quiz handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    setDeletingId(id);

    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter((q) => q.id !== id));
      if (viewQuiz?.id === id) setViewQuiz(null);
      if (resultsQuiz?.id === id) {
        setResultsQuiz(null);
        setResults([]);
      }
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      alert("Delete failed!");
    } finally {
      setDeletingId(null);
    }
  };

  // Fetch results for a quiz
  const handleResults = async (quizId) => {
    try {
      const response = await axios.get(
        `http://localhost:9097/api/quizzes/${quizId}/creator-results`
      );
      setResults(response.data);
      setResultsQuiz(quizzes.find((q) => q.id === quizId));
    } catch (error) {
      console.error("Failed to fetch results:", error);
      alert("Failed to fetch results!");
    }
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setViewQuiz(null);
        setResultsQuiz(null);
        setResults([]);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="my-quizzes">
      <h2>📚 My Quizzes</h2>

      {loading && <p>Loading quizzes...</p>}

      {!loading && (
        <div className="quiz-list">
          {quizzes.length === 0 ? (
            <p>No quizzes created yet.</p>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-card">
                <h3>{quiz.title}</h3>
                <p>
                  <strong>Domain:</strong> {quiz.domain}
                </p>
                <p>
                  <strong>Time Limit:</strong> {quiz.timeLimit} minutes
                </p>

                <div className="quiz-actions">
                  <button onClick={() => setViewQuiz(quiz)}>👀 View</button>
                  <button onClick={() => handleResults(quiz.id)}>📊 Results</button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    disabled={deletingId === quiz.id}
                  >
                    {deletingId === quiz.id ? "Deleting..." : "🗑️ Delete"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal for Quiz Questions */}
      {viewQuiz && (
        <div className="modal-overlay" onClick={() => setViewQuiz(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>📖 {viewQuiz.title}</h3>
            <p>
              <strong>Domain:</strong> {viewQuiz.domain}
            </p>
            <p>
              <strong>Time Limit:</strong> {viewQuiz.timeLimit} minutes
            </p>

            <h4>Questions:</h4>
            <ol>
              {viewQuiz.questions?.map((q, idx) => (
                <li key={q.id || idx}>
                  {q.text}
                  <ul>
                    {q.options?.map((opt, i) => {
                      const optionLetter = String.fromCharCode(65 + i);
                      return (
                        <li
                          key={i}
                          style={{
                            fontWeight:
                              q.answer === optionLetter ? "bold" : "normal",
                            color:
                              q.answer === optionLetter ? "green" : "black",
                          }}
                        >
                          {optionLetter}. {opt}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>

            <button onClick={() => setViewQuiz(null)}>❌ Close</button>
          </div>
        </div>
      )}

      {/* Modal for Quiz Results */}
      {resultsQuiz && (
        <div className="modal-overlay" onClick={() => setResultsQuiz(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>📊 Results for {resultsQuiz.title}</h3>

            {results.length === 0 ? (
              <p>No attempts yet.</p>
            ) : (
              <table className="results-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Score</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      <td>{r.username}</td>
                      <td>{r.score}</td>
                      <td>{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              onClick={() => {
                setResultsQuiz(null);
                setResults([]);
              }}
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
