import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import ProjectsManagement from "../components/admin/ProjectsManagement";
import ClientsManagement from "../components/admin/ClientsManagement";
import ContactResponses from "../components/admin/ContactResponses";
import Dashboard from "../components/admin/Dashboard";

export default function AdminPanel() {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsManagement />} />
            <Route path="/clients" element={<ClientsManagement />} />
            <Route path="/contacts" element={<ContactResponses />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
