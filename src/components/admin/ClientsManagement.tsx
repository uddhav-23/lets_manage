import { useState, useEffect } from "react";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
import { getAllClients, createClient, updateClient, deleteClient } from "../../services/clients";

export default function ClientsManagement() {
  const [clients, setClients] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    review: "",
    imageId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await getAllClients();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageId) {
      toast.error("Please upload an image");
      return;
    }

    setLoading(true);
    try {
      if (editingClient) {
        await updateClient(editingClient.id || editingClient._id, {
          name: formData.name,
          designation: formData.designation,
          review: formData.review,
          imageId: formData.imageId || undefined,
        });
        toast.success("Client updated successfully!");
      } else {
        await createClient({
          name: formData.name,
          designation: formData.designation,
          review: formData.review,
          imageId: formData.imageId,
        });
        toast.success("Client created successfully!");
      }
      await fetchClients();
      resetForm();
    } catch (error) {
      toast.error("Failed to save client");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      designation: client.designation,
      review: client.review,
      imageId: client.imageId || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteClient(id);
        toast.success("Client deleted successfully!");
        await fetchClients();
      } catch (error) {
        toast.error("Failed to delete client");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", designation: "", review: "", imageId: "" });
    setEditingClient(null);
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clients Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Client
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id || client._id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <img
                src={client.imageUrl || "/api/placeholder/80/80"}
                alt={client.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                <p className="text-blue-600 font-medium">{client.designation}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4 italic">"{client.review}"</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(client)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(client.id || client._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingClient ? "Edit Client" : "Add Client"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Photo
                </label>
                <ImageUpload
                  onImageUploaded={(imageId) => setFormData({ ...formData, imageId })}
                  currentImageId={formData.imageId}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
