export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-heading font-bold mb-6">Our Projects</h1>
      <p className="text-muted-foreground text-lg max-w-3xl mb-12">
        Explore our portfolio of completed steel fabrication and welding projects.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-video bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
