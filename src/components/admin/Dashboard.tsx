import { useState, useEffect } from "react";
import { getAllContacts } from "../../services/contacts";
import { getAllProjects } from "../../services/projects";
import { getAllClients } from "../../services/clients";
import { getAllSubscribers } from "../../services/subscribers";

export default function Dashboard() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactsData, projectsData, clientsData, subscribersData] = await Promise.all([
          getAllContacts(),
          getAllProjects(),
          getAllClients(),
          getAllSubscribers(),
        ]);
        setContacts(contactsData);
        setProjects(projectsData);
        setClients(clientsData);
        setSubscribers(subscribersData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Contacts",
      value: contacts.length,
      icon: "📧",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Active Projects",
      value: projects.length,
      icon: "🚀",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Happy Clients",
      value: clients.length,
      icon: "😊",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Subscribers",
      value: subscribers.length,
      icon: "📬",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  const recentContacts = contacts.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-purple-100">Manage your projects, clients, and business operations from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div className={`px-3 py-1 bg-gradient-to-r ${stat.color} text-white text-xs font-semibold rounded-full`}>
                +12%
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Contacts */}
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in-up animation-delay-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Contacts</h2>
            <span className="text-sm text-gray-500">{contacts.length} total</span>
          </div>
          
          <div className="space-y-4">
            {recentContacts.length > 0 ? (
              recentContacts.map((contact, index) => (
                <div
                  key={contact.id || contact._id}
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {contact.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900">{contact.fullName}</h3>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{contact.city}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(contact.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500">No contacts yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in-up animation-delay-450">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🚀</div>
              <div className="text-sm font-semibold">Add Project</div>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
              <div className="text-sm font-semibold">Add Client</div>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
              <div className="text-sm font-semibold">View Analytics</div>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
              <div className="text-sm font-semibold">Settings</div>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in-up animation-delay-600">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Overview</h2>
        
        <div className="h-64 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-600">Detailed performance metrics and charts will be available here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
