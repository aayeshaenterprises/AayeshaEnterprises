export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-heading font-bold mb-6">Our Services</h1>
      <p className="text-muted-foreground text-lg max-w-3xl mb-12">
        We offer a wide range of steel fabrication and welding services to meet your needs.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
