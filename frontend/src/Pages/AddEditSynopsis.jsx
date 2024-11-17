import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../Helpers/axiosInstance';
import { fetchUserCourses } from '../store/Slices/auth.slice';

const CourseSynopsis = () => {
  const { courseMapId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userCourses } = useSelector((state) => state.auth);
  const [course, setCourse] = useState(null);
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the courses if not already fetched
    if (!userCourses.length) {
      const storedData = localStorage.getItem('data');
      const data = storedData ? JSON.parse(storedData) : null;
      const userId = data?._id;
      if (userId) {
        dispatch(fetchUserCourses(userId));
      }
    } else {
      const selectedCourse = userCourses.find(
        (course) => course.courseMapId === courseMapId
      );
      setCourse(selectedCourse);
      setDescription(selectedCourse?.description || '');
      setIsLoading(false);
    }
  }, [courseMapId, userCourses, dispatch]);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('course_id', course.course_id);
    formData.append('description', description);
    if (videoFile) {
      formData.append('file', videoFile);
    }

    try {
      const res = await axiosInstance.post('/user/addCourseSynopsis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/courseList');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error updating course synopsis:', error.message);
      toast.error('Failed to update course synopsis');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="max-w-2xl w-full bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">
          {course ? `Edit Synopsis for ${course.courseName}` : 'Loading...'}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Course Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2 mt-1"
              rows="4"
              placeholder="Enter course description"
            ></textarea>
          </div>

          {course?.video?.secure_url && (
            <div className="mb-4">
              <label className="block text-gray-700">Current Video:</label>
              <video controls className="w-full mt-2">
                <source src={course.video.secure_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700">Upload New Video (optional):</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full mt-2"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all duration-300"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseSynopsis;
