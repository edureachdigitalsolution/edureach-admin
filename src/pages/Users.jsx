import { useState } from "react";
import { useSelector } from "react-redux";
import {
    useGetUsersQuery,
    useUpdateUserProfileMutation,
    useDeleteUserProfileMutation,
} from "../features/leads/leadsApi";

const USERS_PER_PAGE = 15;

const Users = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: users = [], isLoading } = useGetUsersQuery();

    const [updateUser] = useUpdateUserProfileMutation();
    const [deleteUser] = useDeleteUserProfileMutation();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    if (isLoading) return <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
    </div>

    // 🔥 Remove self
    const filteredUsers = users
        .filter((u) => u.userId !== user.$id)
        .filter((u) =>
            u.userId.toLowerCase().includes(search.toLowerCase())
        );

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    const paginatedUsers = filteredUsers.slice(
        (page - 1) * USERS_PER_PAGE,
        page * USERS_PER_PAGE
    );

    const handleFreeze = (id, isActive) => {
        updateUser({ id, updates: { isActive: !isActive } });
    };


     const handleRoleChange = async (id, newRole) => {
    try {
        await updateUser({
            id,
            updates: { role: newRole },
        }).unwrap();

        console.log("Role updated successfully");
    } catch (err) {
        console.error("Role update failed:", err);
    }
};
    // const handleDelete = (id) => {
    //     if (confirm("Delete user?")) {
    //         deleteUser(id);
    //     }
    // };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Users</h1>

            {/* 🔍 Search */}
            <input
                type="text"
                placeholder="Search by User ID..."
                className="mb-4 p-2 border rounded w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Sr. No.</th>
                            <th className="px-6 py-3">User ID</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Active</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedUsers.map((u, index) => (
                            <tr key={u.$id} className="border-b">
                                <td className="px-6 py-4">
                                    {(page - 1) * USERS_PER_PAGE + index + 1}
                                </td>
                                <td className="px-6 py-4">{u.userId}</td>

                                <td className="px-6 py-4">
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.$id, e.target.value)}
                                        className="border p-1 rounded text-xs"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </td>

                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${u.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {u.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                <td className="px-6 py-4 space-x-2">
                                    <button
                                        onClick={() => handleFreeze(u.$id, u.isActive)}
                                        className={`px-2 py-1 rounded text-white ${u.isActive ? "bg-yellow-500" : "bg-green-600"
                                            }`}
                                    >
                                        {u.isActive ? "Freeze" : "Unfreeze"}
                                    </button>

                                    {/* <button
                                        onClick={() => handleDelete(u.$id)}
                                        className="px-2 py-1 bg-red-600 text-white rounded"
                                    >
                                        Delete
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 📄 Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded ${page === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Users;