import { useEffect, useState } from 'react';
import axiosInstance from '../Helpers/axiosInstance';
import toast from 'react-hot-toast';

const CourseView = () => {
  const [courses, setCourses] = useState([]);
  const [semester, setSemester] = useState('');
  const [courseStatus, setCourseStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.post('/user/viewCourses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    }
  };

  const fetchCourseStatus = async () => {
    try {
      const response = await axiosInstance.get('/user/courseStatus');
      setCourseStatus(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching course status:', error);
      toast.error('Failed to fetch course statuses');
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await fetchCourses();
    await fetchCourseStatus();
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSemesterChange = async (e) => {
    const sem = e.target.value;
    setSemester(sem);

    try {
      const response = await axiosInstance.post('/user/viewCourses', { semester: sem ? parseInt(sem) : '' });
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses for semester:', error);
      toast.error('Failed to fetch courses for the selected semester');
    }
  };

  const handleRequestCourse = async (course_id) => {
    try {
      const response = await axiosInstance.post('/user/requestCourse', { course_id });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchCourseStatus();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error requesting course:', error);
      toast.error('Failed to request course');
    }
  };

  return (
    <div className="min-h-screen bg-slate-500 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-500">Request Courses</h1>

      <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-4">
        <label className="block mb-2 text-lg font-semibold">Select Semester:</label>
        <select
          value={semester}
          onChange={handleSemesterChange}
          className="w-full p-2 mb-4 border rounded-md"
        >
          <option value="">All Semesters</option>
          {[...Array(8)].map((_, index) => (
            <option key={index} value={index + 1}>
              Semester {index + 1}
            </option>
          ))}
        </select>

        <div className="mt-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course._id}
                className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.courseName}</h2>
                <p className="text-gray-600">Semester: {course.semester}</p>
                <p className="text-gray-600">Branch: {course.branch || 'Not specified'}</p>
                <p className="text-gray-700 mt-4">
                  {course.description || 'No description available.'}
                </p>

                <div className="mt-4">
                  {courseStatus[course._id] === 'enrolled' ? (
                    <button className="bg-green-500 text-white px-4 py-2 rounded" disabled>
                      Enrolled
                    </button>
                  ) : courseStatus[course._id] === 'requested' ? (
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded" disabled>
                      Requested
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={() => handleRequestCourse(course._id)}
                    >
                      Request Course
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No courses available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseView;
