import { useState } from "react";
import { toast } from "sonner";
import { submitContact } from "../../services/contacts";

export default function HeroSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await submitContact(formData);
      toast.success("Thank you! We'll get back to you soon.");
      setFormData({ fullName: "", email: "", mobile: "", city: "" });
    } catch (error: any) {
      console.error('Contact submission error:', error);
      const errorMessage = error?.message || 'Unknown error';
      if (errorMessage.includes('permission')) {
        toast.error("Permission denied. Please check if Firestore rules allow anonymous writes.");
      } else {
        toast.error(`Failed to submit: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20" id="contact">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1920&h=1080&fit=crop)"
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
        {/* Left Content - Large Text */}
        <div className="text-white">
          <h1 className="text-6xl lg:text-8xl font-bold leading-tight mb-8">
            Consultation,<br />
            Design &<br />
            Marketing
          </h1>
        </div>

        {/* Right Content - Dark Blue Contact Form */}
        <div className="relative">
          <div className="bg-[#1e3a5f] rounded-lg p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="City"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 rounded-md font-semibold text-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Get Quick Quote"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
