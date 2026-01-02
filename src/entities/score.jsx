

const API_URL = "http://localhost:5000/score";

export const RoomService = {
  // Add new score
 async postScore({
  test_set_id,
  student_id,
  score,
  started_at,
  submitted_at,
   answers
}) {
  
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test_set_id,
        student_id,
        score,
        started_at,
        submitted_at,
        answers
  
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to submit score");
    }

    return await response.json();
  } catch (error) {
    console.error("Error posting score:", error);
    throw error;
  }
},

async getTestReview(student_id, test_set_id) {
  try {
    const response = await fetch(`${API_URL}/${student_id}/${test_set_id}`);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to fetch test review");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching test review:", error);
    throw error;
  }
},

async getTestSetResults( test_set_id) {
  try {
    const response = await fetch(`${API_URL}/${test_set_id}/results`);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to fetch test review");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching test review:", error);
    throw error;
  }
}



};


   


export default RoomService;