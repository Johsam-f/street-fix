export default function ForumPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community Forum</h1>
        <p className="text-muted-foreground mt-2">
          Share tips, ask questions, and connect with neighbors
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">
          All Posts
        </button>
        <button className="px-4 py-2 rounded-lg hover:bg-accent">
          Tips
        </button>
        <button className="px-4 py-2 rounded-lg hover:bg-accent">
          Emergency
        </button>
        <button className="px-4 py-2 rounded-lg hover:bg-accent">
          General
        </button>
      </div>

      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p>Forum posts will go here</p>
        <p className="text-sm mt-2">
          Features: Create post, reply, categories, search
        </p>
      </div>
    </div>
  );
}
