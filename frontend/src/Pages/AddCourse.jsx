import { useState } from 'react';
import { FaEdit, FaCheck } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addCourse } from '../store/Slices/auth.slice';

function AddCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');

  const [isEditingCourseName, setIsEditingCourseName] = useState(false);
  const [isEditingCourseCode, setIsEditingCourseCode] = useState(false);
  const [isEditingBranch, setIsEditingBranch] = useState(false);
  const [isEditingSemester, setIsEditingSemester] = useState(false);

  // Handlers for each field
  const handleCourseNameChange = (e) => setCourseName(e.target.value);
  const handleCourseCodeChange = (e) => setCourseCode(e.target.value);
  const handleBranchChange = (e) => setBranch(e.target.value);
  const handleSemesterChange = (e) => setSemester(e.target.value);

  // Toggle edit mode for each field
  const toggleEditCourseName = () => setIsEditingCourseName(!isEditingCourseName);
  const toggleEditCourseCode = () => setIsEditingCourseCode(!isEditingCourseCode);
  const toggleEditBranch = () => setIsEditingBranch(!isEditingBranch);
  const toggleEditSemester = () => setIsEditingSemester(!isEditingSemester);


  const onSubmit = () => {
    dispatch(addCourse({ courseName, courseCode, branch, semester }));
    navigate('/addCourse');
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Add Course</h1>
        <h3 className="text-center text-gray-600 mb-6">All fields are required</h3>

        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-1">Course Name:</label>
          {isEditingCourseName ? (
            <div className="flex items-center">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={courseName}
                onChange={handleCourseNameChange}
                placeholder="Enter Course Name"
              />
              <FaCheck
                className="ml-2 text-green-600 cursor-pointer"
                onClick={toggleEditCourseName}
              />
            </div>
          ) : (
            <div className="flex items-center">
              <h2 className="text-lg text-blue-800">{courseName ? courseName : 'Course Name'}</h2>
              <FaEdit
                className="ml-2 text-blue-600 cursor-pointer"
                onClick={toggleEditCourseName}
              />
            </div>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-1">Course Code:</label>
          {isEditingCourseCode ? (
            <div className="flex items-center">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={courseCode}
                onChange={handleCourseCodeChange}
                placeholder="Enter Course Code"
              />
              <FaCheck
                className="ml-2 text-green-600 cursor-pointer"
                onClick={toggleEditCourseCode}
              />
            </div>
          ) : (
            <div className="flex items-center">
              <h2 className="text-lg text-blue-800">{courseCode || 'Course Code'}</h2>
              <FaEdit
                className="ml-2 text-blue-600 cursor-pointer"
                onClick={toggleEditCourseCode}
              />
            </div>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-1">Branch:</label>
          {isEditingBranch ? (
            <div className="flex items-center">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={branch}
                onChange={handleBranchChange}
                placeholder="Enter Branch"
              />
              <FaCheck
                className="ml-2 text-green-600 cursor-pointer"
                onClick={toggleEditBranch}
              />
            </div>
          ) : (
            <div className="flex items-center">
              <h2 className="text-lg text-blue-800">{branch || 'Branch'}</h2>
              <FaEdit
                className="ml-2 text-blue-600 cursor-pointer"
                onClick={toggleEditBranch}
              />
            </div>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-1">Semester:</label>
          {isEditingSemester ? (
            <div className="flex items-center">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={semester}
                onChange={handleSemesterChange}
                placeholder="Enter Semester"
              />
              <FaCheck
                className="ml-2 text-green-600 cursor-pointer"
                onClick={toggleEditSemester}
              />
            </div>
          ) : (
            <div className="flex items-center">
              <h2 className="text-lg text-blue-800">{semester || 'Semester'}</h2>
              <FaEdit
                className="ml-2 text-blue-600 cursor-pointer"
                onClick={toggleEditSemester}
              />
            </div>
          )}
        </div>

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
          onClick={onSubmit}
        >
          Add Course
        </button>
      </div>
    </div>
  );
}

export default AddCourse;
