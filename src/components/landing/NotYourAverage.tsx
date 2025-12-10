export default function NotYourAverage() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Not Your Average Realtor
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              We go beyond traditional real estate services to provide comprehensive consultation, design, and marketing solutions that help you achieve top dollar for your property.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our team combines years of experience with innovative strategies to ensure your property stands out in the market.
            </p>
          </div>

          {/* Right Side - Circular Images */}
          <div className="grid grid-cols-2 gap-6">
            {/* Top Left - Circular */}
            <div className="relative">
              <div className="aspect-square rounded-full overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=300&fit=crop"
                  alt="Consultation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Top Right - Circular */}
            <div className="relative mt-8">
              <div className="aspect-square rounded-full overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=300&fit=crop"
                  alt="Client Service"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Bottom - Circular, centered */}
            <div className="relative col-span-2 -mt-8 flex justify-center">
              <div className="aspect-square w-3/4 rounded-full overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=300&h=300&fit=crop"
                  alt="Technology"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

