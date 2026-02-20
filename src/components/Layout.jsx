import { Outlet, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { account } from "../appwrite/config";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Layout = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await account.deleteSession("current");
        dispatch(logout());
        navigate("/login");
    };

    const navItemClass = ({ isActive }) =>
        `block px-4 py-2 rounded-lg transition font-medium
     ${isActive
            ? "text-white shadow border-b border-[#546283]"
            : "text-gray-300 hover:border-[#fff] hover:text-white"
        }`;

    return (
        <div className="flex min-h-screen ">

            {/* Sidebar */}
            <div className="w-72 bg-slate-900 text-white p-6 flex flex-col justify-between">

                <div>
                    <h2 className="text-2xl font-bold mb-10">CRM Admin</h2>

                    <nav className="space-y-2">
                        <NavLink to="/dashboard" className={navItemClass}>
                            Dashboard
                        </NavLink>

                        <NavLink to="/leads" className={navItemClass}>
                            Leads
                        </NavLink>

                        {user?.role === "admin" && (
                            <NavLink to="/users" className={navItemClass}>
                                Users
                            </NavLink>
                        )}
                    </nav>
                </div>

                {/* User Info + Logout */}
                <div className="border-t border-slate-700 pt-4">
                    {/* <p className="text-sm text-gray-400 mb-2">
                        Logged in as:
                    </p> */}
                    <p className="text-sm font-semibold text-white text-center mb-4">
                        {user?.name} ({user?.role})
                    </p>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition"
                    >
                        Logout
                    </button>
                </div>

            </div>

            {/* Main Content */}
            <div className="flex-1">
                <Outlet />
            </div>

        </div>
    );
};

export default Layout;