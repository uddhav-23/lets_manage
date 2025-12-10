import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Height of fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={scrollToTop} className="text-2xl font-bold text-gray-900 hover:text-orange-600 transition-colors">
            Real Trust
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={scrollToTop} className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              HOME
            </button>
            <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              SERVICES
            </button>
            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              ABOUT
            </button>
            <button onClick={() => scrollToSection('projects')} className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              PROJECTS
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              TESTIMONIALS
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              CONTACT
            </button>
            <Link
              to="/admin/login"
              className="bg-orange-600 text-white px-6 py-2 rounded-md font-medium hover:bg-orange-700 transition-colors"
            >
              ADMIN LOGIN
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <button onClick={scrollToTop} className="block w-full text-left text-gray-700 hover:text-orange-600 font-medium">
              HOME
            </button>
            <button onClick={() => scrollToSection('services')} className="block w-full text-left text-gray-700 hover:text-orange-600 font-medium">
              SERVICES
            </button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left text-gray-700 hover:text-orange-600 font-medium">
              ABOUT
            </button>
            <button onClick={() => scrollToSection('projects')} className="block w-full text-left text-gray-700 hover:text-orange-600 font-medium">
              PROJECTS
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left text-gray-700 hover:text-orange-600 font-medium">
              TESTIMONIALS
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-gray-700 hover:text-orange-600 font-medium"
            >
              CONTACT
            </button>
            <Link
              to="/admin/login"
              className="block w-full bg-orange-600 text-white px-6 py-2 rounded-md font-medium text-center"
            >
              ADMIN LOGIN
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

