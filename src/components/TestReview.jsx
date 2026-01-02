import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import scoreAPI from "../entities/score";

const TestReview = () => {
  // ✅ get both params in ONE call
  const { test_set_id, student_id } = useParams();

  const [testReview, setTestReview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReview = async () => {
    try {
      setLoading(true);
      const data = await scoreAPI.getTestReview(student_id, test_set_id);
      console.log("Test Review Data:", data);
      setTestReview(data);
    } catch (error) {
      console.error("Error fetching test review:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (student_id && test_set_id) {
      fetchReview();
    }
  }, [student_id, test_set_id]);

  // 🔄 Loading state
  if (loading) {
    return <div className="p-4 text-center">Loading review...</div>;
  }

  // ❌ No data
  if (!testReview || !testReview.questions?.length) {
    return <div className="p-4 text-center">No review data found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Test Review</h1>


 {testReview.questions.map((q) => {
            return (
              <div
                key={q.id}
                className="p-4 bg-white shadow rounded-lg border"
              >
                <h3 className="font-bold text-lg">{q.question_text}</h3>

                {q.options?.length > 0 &&
                  q.options.map((opt) => {
                    const isCorrect = opt.key === q.correct_answer;
                    const isChosen = q.selected_answer=== opt.key;

                    let style =
                      "p-3 rounded-lg mt-2 border transition";

                    if (isCorrect) {
                      style += " bg-green-100 border-green-400";
                    } else if (isChosen && !isCorrect) {
                      style += " bg-red-100 border-red-400";
                    } else {
                      style += " bg-gray-50 border-gray-300";
                    }

                    return (
                      <div key={opt.option_id} className={style}>
                        <strong>{opt.key})</strong> {opt.value}
                      </div>
                    );
                  })}

                {/* For True/False */}
                {q.question_type === "tf" && (
                  <div className="mt-3">
                    {["True", "False"].map((val) => {
                      const isCorrect = opt.key === q.correct_answer;
                    const isChosen = q.selected_answer=== opt.key;

                      let style =
                        "p-3 rounded-lg mt-2 border transition";

                      if (isCorrect) {
                        style += " bg-green-100 border-green-400";
                      } else if (isChosen && !isCorrect) {
                        style += " bg-red-100 border-red-400";
                      } else {
                        style += " bg-gray-50 border-gray-300";
                      }

                      return (
                        <div key={val} className={style}>
                          {val}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

    </div>
  );
};

export default TestReview;
