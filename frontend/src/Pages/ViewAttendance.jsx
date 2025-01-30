import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCourses } from '../store/Slices/auth.slice';
import axiosInstance from '../Helpers/axiosInstance';

const ViewAttendance = () => {
    const dispatch = useDispatch();
    const { userCourses } = useSelector(state => state.auth);
    const { role } = useSelector(state =>state.auth);
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        const storedData = localStorage.getItem('data');
        const data = storedData ? JSON.parse(storedData) : null;
        const userId = data?._id;

        if (userId) {
            dispatch(fetchUserCourses(userId));
        }
    }, [dispatch]);

    useEffect(() => {
        if (userCourses && userCourses.length > 0) {
            userCourses.forEach(async (course) => {
                try {
                    const response = await axiosInstance.post('/user/viewAttendance', {course_id:course.course_id
                    });
                    console.log("response:",response);
                    if (response.data.success) {
                        setAttendanceData((prevData) => [
                            ...prevData,
                            {
                                course_id: course.course_id,
                                attended: response.data.data.totalAttendances,
                                total: response.data.data.totalAttendanceTillNow,
                            },
                        ]);
                    }
                } catch (error) {
                    console.error('Error fetching attendance:', error);
                }
            });
        }
    }, [userCourses]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold text-center mb-6 text-black">Your Courses</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-4 text-left text-blue-800">Course Name</th>
                            <th className="p-4 text-left text-blue-800">Course Code</th>
                            <th className="p-4 text-left text-blue-800">Semester</th>
                            <th className="p-4 text-left text-blue-800">Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userCourses?.map((course, index) => {
                            const courseAttendance = attendanceData.find(
                                (data) => data.course_id === course.course_id
                            );
                            return (
                                <tr key={index} className="border-b">
                                    <td className="p-4 text-blue-800">{course.courseName}</td>
                                    <td className="p-4 text-blue-800">{course.courseCode}</td>
                                    <td className="p-4 text-blue-800">{course.semester}</td>
                                    <td className="p-4 text-blue-800">
                                        {courseAttendance
                                            ? `${courseAttendance.attended}/${courseAttendance.total}`
                                            : 'Loading...'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewAttendance;
