import api from './axios';

const unityProgressAPI = {
    /**
     * Submit Unity session progress
     * @param {Object} progressData - { student_id, class_id, unity_build_id, instructor_id, session_data, progress_percentage, session_duration_seconds, completed }
     */
    async submitProgress(progressData) {
        try {
            const response = await api.post('/unity/progress', progressData);
            return response.data;
        } catch (error) {
            console.error('Error submitting Unity progress:', error);
            throw error;
        }
    },

    /**
     * Get progress for a student in a class
     * @param {number} studentId 
     * @param {number} classId 
     */
    async getProgressByStudentAndClass(studentId, classId) {
        try {
            const response = await api.get(`/unity/progress/student/${studentId}/class/${classId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching student progress:', error);
            throw error;
        }
    },

    /**
     * Get all progress for a class
     * @param {number} classId 
     */
    async getProgressByClass(classId) {
        try {
            const response = await api.get(`/unity/progress/class/${classId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching class progress:', error);
            throw error;
        }
    },

    /**
     * Get progress for a Unity build
     * @param {number} unityBuildId 
     */
    async getProgressByBuild(unityBuildId) {
        try {
            const response = await api.get(`/unity/progress/build/${unityBuildId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching build progress:', error);
            throw error;
        }
    },

    /**
     * Get latest progress for a student and build
     * @param {number} studentId 
     * @param {number} unityBuildId 
     */
    async getLatestProgress(studentId, unityBuildId) {
        try {
            const response = await api.get(`/unity/progress/student/${studentId}/build/${unityBuildId}/latest`);
            return response.data;
        } catch (error) {
            console.error('Error fetching latest progress:', error);
            throw error;
        }
    },

    /**
     * Delete progress record
     * @param {number} sessionId 
     */
    async deleteProgress(sessionId) {
        try {
            const response = await api.delete(`/unity/progress/${sessionId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting progress:', error);
            throw error;
        }
    }
};

export default unityProgressAPI;
