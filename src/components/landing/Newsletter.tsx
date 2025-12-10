import { useState } from "react";
import { toast } from "sonner";
import { subscribe as subscribeToNewsletter } from "../../services/subscribers";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email format
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setLoading(true);

    try {
      console.log('Newsletter subscription attempt for:', email);
      await subscribeToNewsletter(email);
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      const errorMessage = error?.message || 'Unknown error';
      
      // Show the actual error message from the service
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-orange-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
      >
        {loading ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
