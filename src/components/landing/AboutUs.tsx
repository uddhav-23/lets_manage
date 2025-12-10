export default function AboutUs() {
  return (
    <section className="py-20 bg-white" id="about">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About Us
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            With over a decade of experience in consultation, design, and marketing, we've helped hundreds of businesses transform their operations and achieve remarkable growth. Our team of experts combines strategic thinking with creative execution to deliver solutions that not only meet your current needs but also position you for future success.
          </p>
          <button className="bg-orange-600 text-white px-8 py-4 rounded-md font-semibold hover:bg-orange-700 transition-colors">
            LEARN MORE
          </button>
        </div>
      </div>
    </section>
  );
}
