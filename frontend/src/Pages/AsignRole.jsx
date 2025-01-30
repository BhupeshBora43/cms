import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { assignUserRole, fetchUsers } from "../store/Slices/auth.slice";

const AssignRole = () => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.auth.users);
    const [editRole, setEditRole] = useState({ id: null, role: "" });

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleDoubleClick = (id, currentRole) => {
        setEditRole({ id, role: currentRole || "" });
    };

    const handleChange = (e) => {
        setEditRole({ ...editRole, role: e.target.value });
    };

    const handleBlurOrEnter = async (id) => {
        if (editRole.role.trim() && editRole.role !== users.find(user => user._id === id)?.role) {
          try {
            await dispatch(assignUserRole({ id, role: editRole.role }));
          } catch (error) {
            console.error("Error updating role:", error);
          }
        }
        // Ensure this runs regardless of whether the role was updated or not
        await dispatch(fetchUsers());
        setEditRole({ id: null, role: "" });
      };

    const handleKeyPress = (e, id) => {
        if (e.key === "Enter") {
            handleBlurOrEnter(id);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-10 m-16">
            <h2 className="text-center text-2xl font-semibold text-gray-700 mb-6">Assign Roles</h2>
            <ul className="space-y-4">
                {users?.map(user => (
                    <li
                        key={user._id}
                        className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all"
                    >
                        <span className="font-medium text-gray-600">{user.email}:</span>
                        {editRole.id === user._id ? (
                            <input
                                type="text"
                                value={editRole.role}
                                onChange={handleChange}
                                onBlur={() => handleBlurOrEnter(user._id)}
                                onKeyDown={(e) => handleKeyPress(e, user._id)}
                                className="w-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                autoFocus
                            />
                        ) : (
                            <span
                                onDoubleClick={() => handleDoubleClick(user._id, user.role)}
                                className={`cursor-pointer px-2 py-1 rounded ${
                                    user.role ? "text-gray-700" : "text-gray-400 italic"
                                } hover:bg-gray-200 transition`}
                            >
                                {user.role || "assignRole"}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AssignRole;
