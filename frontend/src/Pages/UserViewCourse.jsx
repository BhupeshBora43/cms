import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserCourses } from '../store/Slices/auth.slice';

const CourseList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userCourses } = useSelector(state => state.auth);

    useEffect(() => {
        const storedData = localStorage.getItem('data');
        const data = storedData ? JSON.parse(storedData) : null;

        const userId = data?._id;
        if (userId) {
            dispatch(fetchUserCourses(userId));
        }
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold text-center mb-6 text-black">Your Courses</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-4 text-left text-blue-800">Course Name</th>
                            <th className="p-4 text-left text-blue-800">Course Code</th>
                            <th className="p-4 text-left text-blue-800">Approved</th>
                            <th className="p-4 text-left text-blue-800">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userCourses?.map((course, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-4 text-blue-800">{course.courseName}</td>
                                <td className="p-4 text-blue-800">{course.courseCode}</td>
                                <td className="p-4 text-blue-800">{course.approved ? 'Yes' : 'No'}</td>
                                <td className="p-4 text-blue-800 space-x-2">
                                    <button
                                        onClick={() => navigate(`/markAttendance/${course.course_id}`)}
                                        className={`${
                                            course.approved ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                                        } text-white px-4 py-2 rounded`}
                                        disabled={!course.approved}
                                    >
                                        Mark Attendance
                                    </button>
                                    <button
                                        onClick={() => navigate(`/view-attendance/${course.course_id}`)}
                                        className={`${
                                            course.approved ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                                        } text-white px-4 py-2 rounded`}
                                        disabled={!course.approved}
                                    >
                                        View Attendance
                                    </button>
                                    <button
                                        onClick={() => navigate(`/addSynopsis/${course.courseMapId}`)}
                                        className={`${
                                            course.approved ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'
                                        } text-white px-4 py-2 rounded`}
                                        disabled={!course.approved}
                                    >
                                        Add Synopsis
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseList;
