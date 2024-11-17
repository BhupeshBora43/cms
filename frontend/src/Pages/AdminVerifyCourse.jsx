import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoursesToVerify, verifyCourse } from '../store/Slices/auth.slice';

const CourseVerification = () => {
    const dispatch = useDispatch();
    const { coursesToVerify } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchCoursesToVerify());
    }, [dispatch]);

    const handleVerify = (id, status) => {
        dispatch(verifyCourse({ id, verify: status }));
    };

    return (
        <div className="max-w-5xl mx-auto p-8 bg-gray-900 shadow-lg rounded-lg mt-10">
            <h2 className="text-4xl font-bold text-center mb-8 text-orange-500">Course Verification</h2>
            {coursesToVerify.length === 0 ? (
                <p className="text-center text-gray-300">No courses pending verification</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Course Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Requested By</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coursesToVerify.map((course) => (
                                <tr key={course._id} className="hover:bg-gray-700">
                                    <td className="px-6 py-4 text-gray-300 border-b border-gray-700">
                                        {course.course_id.courseName}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 border-b border-gray-700">
                                        {course.user_id.name} <span className="text-gray-400">({course.user_id.email})</span>
                                    </td>
                                    <td className="px-6 py-4 text-center border-b border-gray-700">
                                        <button
                                            className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded mr-3 transition duration-200 focus:ring-2 focus:ring-green-300"
                                            onClick={() => handleVerify(course._id, true)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded transition duration-200 focus:ring-2 focus:ring-red-300"
                                            onClick={() => handleVerify(course._id, false)}
                                        >
                                            Disapprove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CourseVerification;
