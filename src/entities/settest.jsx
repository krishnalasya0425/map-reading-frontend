const API_URL = "http://localhost:5000/subtest";

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


const setTest = {

  getSetTest(Id){
     return apiRequest(`${API_URL}/g/${Id}`);
  },

   deleteById(Id){
     return apiRequest(`${API_URL}/delete/${Id}`,"DELETE");
  },

    getTestSetQuestions(Id){
      return apiRequest(`${API_URL}/testquestions/${Id}`);
    },


    
}

export default setTest;