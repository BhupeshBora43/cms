// src/pages/CourseView.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../Helpers/axiosInstance';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const CourseView = () => {
    const [courses, setCourses] = useState([]);
    const [semester, setSemester] = useState('');
    const role = useSelector(state => state.auth.role);

    const initialMount = async () => {
        const userEndpoint = role === 'STUDENT' ? 'user/viewCourses' : 'admin/viewCourses';
        try {
            const data = await axiosInstance.post(`/${userEndpoint}`);
            setCourses(data.data.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses');
        }
    };

    useEffect(() => {
        initialMount();
    }, []);

    const handleSemesterChange = async (e) => {
        const sem = e.target.value;
        setSemester(sem);
        const userEndpoint = role === 'STUDENT' ? 'user/viewCourses' : 'admin/viewCourses';
        try {
            const data = await axiosInstance.post(`/${userEndpoint}`, { semester: sem ? parseInt(sem) : '' });
            setCourses(data.data.data);
        } catch (error) {
            console.error('Error fetching courses for semester:', error);
            toast.error('Failed to fetch courses for the selected semester');
        }
    };

    return (
        <div className="min-h-screen bg-slate-500 p-6">
            <h1 className="text-3xl font-bold text-center mb-8 text-green-600">View Courses</h1>

            <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-4">
                <label className="block mb-2 text-lg font-semibold">Select Semester:</label>
                <select
                    value={semester}
                    onChange={handleSemesterChange}
                    className="w-full p-2 mb-4 border rounded-md"
                >
                    <option value="">All Semesters</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                </select>

                <div className="mt-6">
                    {courses.length > 0 ? (
                        courses.map(course => (
                            <div
                                key={course._id}
                                className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.courseName}</h2>
                                <p className="text-gray-600">Semester: <span className="font-semibold">{course.semester}</span></p>
                                <p className="text-gray-600">Branch: {course.branch || 'Not specified'}</p>

                                <p className="text-gray-700 mt-4">
                                    {course.description ? course.description : 'No description available.'}
                                </p>

                                {course.video?.secure_url ? (
                                    <div className="mt-4">
                                        <h3 className="font-semibold text-gray-800">Course Video:</h3>
                                        <div className="relative w-full overflow-hidden pt-[56.25%] rounded-lg mt-2 bg-black">
                                            <video
                                                src={course.video.secure_url}
                                                controls
                                                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 mt-2">No video available.</p>
                                )}
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
