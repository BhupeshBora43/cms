import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../store/Slices/auth.slice';

function Profile() {
  const dispatch = useDispatch();
  const { data, role } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    avatar: null,
    previewImage: data.avatar?.secure_url||""
  });
  useEffect(() => {
    if (data) {
      setProfileData({
        name: data.name || '',
        previewImage: data.avatar?.secure_url || ""
      });
    }
  }, [data]);
  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveDetails();
    }
    setIsEditing(!isEditing);
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.addEventListener("load", function () {
      setProfileData({
        ...profileData,
        previewImage:this.result,
        avatar:file
      });
      })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSaveDetails = async () => {
    console.log("pd : ",profileData);
    await dispatch(updateUserProfile(profileData));
    setIsEditing(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>
      <div className="flex justify-center mb-4">
        <label htmlFor="avatarUpload" className="cursor-pointer">
          <img
            src={profileData.previewImage|| 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'} // Use default avatar if none
            alt="Profile Avatar"
            className="w-32 h-32 rounded-full object-cover border"
          />
          {isEditing && (
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              name="avatar"
              className="hidden"
              onChange={handleImageChange}
            />
          )}
        </label>
      </div>

      <div className="text-center mb-2">
        <span className="text-blue-800">Role:</span> <strong className='text-gray-600'>{role}</strong>
      </div>

      <div className="mb-4">
        <label className="block text-blue-800">Name</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        ) : (
          <p className="p-2 bg-gray-100 text-gray-600 rounded">{profileData.name}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-blue-800">Email</label>
        <p className="p-2 bg-gray-100 rounded text-gray-600">{data.email}</p>
      </div>

      <div className="text-center">
        <button
          onClick={handleEditToggle}
          className={`px-4 py-2 rounded ${isEditing ? 'bg-green-500' : 'bg-blue-500'} text-white`}
        >
          {isEditing ? 'Save Details' : 'Edit Details'}
        </button>
      </div>
    </div>
  );
}

export default Profile;
