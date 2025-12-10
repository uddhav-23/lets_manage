import { useState, useEffect } from "react";
import { getAllClients } from "../../services/clients";

export default function HappyClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getAllClients();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden" id="testimonials">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <svg width="60" height="60" viewBox="0 0 60 60" className="absolute top-10 left-10">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Client Testimonials
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
            Happy <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Clients</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our satisfied clients have to say about our exceptional services and results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(clients.length > 0 ? clients : [
            {
              _id: "client1",
              name: "Sarah Johnson",
              designation: "CEO, TechStart Inc.",
              review: "Exceptional service and outstanding results. They transformed our business completely with their innovative approach and dedication.",
              imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
            },
            {
              _id: "client2", 
              name: "Michael Chen",
              designation: "CTO, InnovateCorp",
              review: "Professional team with incredible expertise. Their attention to detail and commitment to excellence is truly remarkable.",
              imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
            },
            {
              _id: "client3",
              name: "Emily Rodriguez",
              designation: "Founder, Creative Studios",
              review: "Working with them was a game-changer for our company. They delivered beyond our expectations and on time.",
              imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
            }
          ]).map((client, index) => (
            <div
              key={client.id || client._id || index}
              className="group relative bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 hover:border-purple-200 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>

              {/* Client Info */}
              <div className="flex items-center mb-6">
                <div className="relative">
                  <img
                    src={client.imageUrl || "/api/placeholder/80/80"}
                    alt={client.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors duration-300">
                    {client.name}
                  </h3>
                  <p className="text-purple-600 font-medium text-sm">
                    {client.designation}
                  </p>
                </div>
              </div>

              {/* Review */}
              <blockquote className="text-slate-600 leading-relaxed italic mb-6 text-lg">
                "{client.review}"
              </blockquote>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex text-yellow-400 text-lg">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <div className="text-sm text-slate-400 font-medium">
                  Verified Client
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {clients.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Building Amazing Relationships</h3>
            <p className="text-slate-600 text-lg">We're working with incredible clients. Their testimonials will be here soon!</p>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-slate-600 text-sm">Client Retention</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
            <div className="text-slate-600 text-sm">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">50+</div>
            <div className="text-slate-600 text-sm">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">24h</div>
            <div className="text-slate-600 text-sm">Response Time</div>
          </div>
        </div>
      </div>
    </section>
  );
}
