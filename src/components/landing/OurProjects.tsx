import { useState, useEffect } from "react";
import { getAllProjects } from "../../services/projects";

export default function OurProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="py-20 bg-white relative overflow-hidden" id="projects">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
            </svg>
            Our Portfolio
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Projects</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore our portfolio of successful projects that showcase our expertise and commitment to excellence in digital innovation.
          </p>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max md:min-w-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {(projects.length > 0 ? projects : [
            {
              _id: "sample1",
              name: "E-Commerce Platform", 
              description: "Modern e-commerce platform with real-time inventory management, secure payment processing, and advanced analytics dashboard.",
              imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=450&h=350&fit=crop"
            },
            {
              _id: "sample2",
              name: "Mobile Banking App",
              description: "Secure mobile banking application with biometric authentication, instant transfers, and comprehensive financial management tools.", 
              imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=450&h=350&fit=crop"
            },
            {
              _id: "sample3",
              name: "Healthcare Management System",
              description: "Comprehensive healthcare platform connecting patients, doctors, and hospitals with appointment scheduling and medical records.",
              imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=450&h=350&fit=crop"
            }
          ]).map((project, index) => (
            <div
              key={project.id || project._id || index}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.imageUrl || "/api/placeholder/450/350"}
                  alt={project.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Live Project</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors duration-300">
                    {project.name}
                  </h3>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <button className="group/btn flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-300">
                    <span>Read More</span>
                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                        +3
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Projects Yet</h3>
            <p className="text-slate-600 text-lg">We're working on some amazing projects. Check back soon!</p>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Ready to Start Your Project?</h3>
              <p className="text-slate-600">Let's discuss how we can bring your vision to life.</p>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
