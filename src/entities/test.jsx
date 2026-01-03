// User entity operations

const API_BASE_URL = 'http://localhost:5000/tests'; // adjust the URL according to your backend


// Generic request helper
async function apiRequest(url, method = "GET", body = null) {
  const token = localStorage.getItem("token");
  const options = { method, headers: {} };

  // Add Authorization header if token exists
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

 const testAPI = {

     getAllTests(id = null, role = null) {
  let url = `${API_BASE_URL}`;
 
  if (role === "Student") {
    url += `/assigned?id=${id}`;
  } 
  else if (id) {
    url += `?id=${id}`;
  }

  return apiRequest(url, "GET");
},


  getTestInfo(Id){
     return apiRequest(`${API_BASE_URL}/${Id}`);
  },

   getDownloadPdf(Id){
     return apiRequest(`${API_BASE_URL}/download/${Id}`);
  },

   getTestScoreInfo(Id){
     return apiRequest(`${API_BASE_URL}/score/${Id}`);
  },


  updateTest(testId, testName) {
    return apiRequest(`${API_BASE_URL}/${testId}`, "PUT", {testName });
  },

  deleteTest(testId) {
    return apiRequest(`${API_BASE_URL}/${testId}`, "DELETE");
  },
    // Get all users
    async addTest(title, ID, classId) {
        console.log(title, ID, classId)
        try {
 const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,ID, classId
      })
    });
            if (!response.ok) throw new Error('Failed to fetch users');
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Get user by ID
    async getTestAnswers(testId) {
        try {
            const response = await fetch(`${API_BASE_URL}/${testId}/answers`);
            if (!response.ok) throw new Error('Failed to fetch user');
            return await response.json();
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    // Add new user
    async getQuestionsByTestId(testId) {
       try {
            const response = await fetch(`${API_BASE_URL}/${testId}/questions`);
            if (!response.ok) throw new Error('Failed to fetch user');
            return await response.json();
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

     async addQuestions(testId,payload) {
        try {
             const res = await fetch(`${API_BASE_URL}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testId ,
        questions: payload
      })
    });

            if (!res.ok) throw new Error('Failed to add questions');
            return await res.json();
        } catch (error) {
            console.error('Error adding questions:', error);
            throw error;
        }
    },


};

export default testAPI;