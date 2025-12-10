import { useState, useEffect } from "react";
import { getAllContacts } from "../../services/contacts";
import { useAuth } from "../../contexts/AuthContext";

export default function ContactResponses() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only fetch if user is authenticated
    if (!user) {
      setLoading(false);
      setError("Please log in to view contacts");
      return;
    }

    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching contacts as authenticated user:', user.uid);
        const data = await getAllContacts();
        setContacts(data);
        console.log('Fetched contacts:', data.length);
      } catch (error: any) {
        console.error("Error fetching contacts:", error);
        const errorMessage = error?.message || 'Failed to load contacts';
        setError(errorMessage);
        if (error?.code === 'permission-denied') {
          setError("Permission denied. Make sure you're logged in and Firestore rules are deployed.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
    
    // Refresh every 5 seconds to see new contacts
    const interval = setInterval(fetchContacts, 5000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading && contacts.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Responses</h1>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Responses</h1>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="font-semibold">Error loading contacts:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Submitted At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id || contact._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.mobile}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(contact.submittedAt).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {contacts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No contact submissions yet.</p>
            <p className="text-gray-400 text-sm mt-2">Submissions from the landing page will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
