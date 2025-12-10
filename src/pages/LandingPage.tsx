import Header from "../components/landing/Header";
import HeroSection from "../components/landing/HeroSection";
import NotYourAverage from "../components/landing/NotYourAverage";
import WhyChooseUs from "../components/landing/WhyChooseUs";
import ImageGallery from "../components/landing/ImageGallery";
import AboutUs from "../components/landing/AboutUs";
import OurProjects from "../components/landing/OurProjects";
import HappyClients from "../components/landing/HappyClients";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <NotYourAverage />
      <WhyChooseUs />
      <ImageGallery />
      <AboutUs />
      <OurProjects />
      <HappyClients />
      <Footer />
    </div>
  );
}
