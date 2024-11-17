import { useEffect, useState } from 'react';
import axiosInstance from '../Helpers/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const MarkAttendance = () => {
  const navigate = useNavigate()
  const { course_id } = useParams();
  const [students, setStudents] = useState([]);
  const [attendanceArray, setAttendanceArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.post(`/user/getAttendanceList`, { course_id });
        setStudents(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [course_id]);

  const handleCheckboxChange = (student_id, isChecked) => {
    if (isChecked) {
      setAttendanceArray(prev => [...prev, student_id]);
    } else {
      setAttendanceArray(prev => prev.filter(id => id !== student_id));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post(`/user/markAttendance`, {
        attendanceArray,
        course_id,
      });
      navigate(`/courseList`)
    } catch (error) {
      console.error('Error marking attendance', error);
      alert('An error occurred while marking attendance.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Mark Attendance</h1>
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Course ID: {course_id}</h2>

        {students?.length === 0 ? (
          <p className="text-center text-gray-500">No students enrolled in this course.</p>
        ) : (
          <div>
            <form className="space-y-4">
              {students?.map(student => (
                <div
                  key={student.user_id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      onChange={e => handleCheckboxChange(student.user_id, e.target.checked)}
                    />
                    <span className="text-lg font-medium text-gray-800">
                      {student.userDetails.name} ({student.userDetails.email})
                    </span>
                  </label>
                </div>
              ))}
            </form>

            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition duration-200"
            >
              Submit Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
