export default function ImageGallery() {
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
      alt: "Real Estate Consultation"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      alt: "Property Showcase"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop",
      alt: "Client Meeting"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <div key={image.id} className="relative overflow-hidden rounded-lg shadow-lg group">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

