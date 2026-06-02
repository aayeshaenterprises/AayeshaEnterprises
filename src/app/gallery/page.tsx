export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-heading font-bold mb-6">Gallery</h1>
      <p className="text-muted-foreground text-lg max-w-3xl mb-12">
        A closer look at our craftsmanship and attention to detail.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
