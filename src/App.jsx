import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { account, databases, DATABASE_ID, USER_PROFILE_COLLECTION_ID } from "./appwrite/config";
import { setUser, setLoading } from "./features/auth/authSlice";

import { Query } from "appwrite";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Login from "./pages/Login";
import Users from "./pages/Users";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const authUser = await account.get();

        let role = "user"; // default role

        try {
          const profile = await databases.listDocuments(
            DATABASE_ID,
            USER_PROFILE_COLLECTION_ID,
            [Query.equal("userId", authUser.$id)]
          );

          if (profile.documents.length > 0) {
            role = profile.documents[0].role;
          }
        } catch (err) {
          console.log("Role fetch failed, using default role");
        }

        dispatch(setUser({ ...authUser, role }));

      } catch {
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkSession();
  }, [dispatch]);

  return (
    <Routes>

      {/* 🔥 Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/login" element={<Login />} />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/users" element={<Users />} />
      </Route>

    </Routes>
  );
}

export default App;