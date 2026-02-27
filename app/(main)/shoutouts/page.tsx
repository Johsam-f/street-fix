export default function ShoutoutsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Neighbor Shoutouts</h1>
        <p className="text-muted-foreground mt-2">
          Thank helpful neighbors and celebrate community spirit
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Give a Shoutout</h2>
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
          <p>Shoutout creation form will go here</p>
          <p className="text-sm mt-2">
            Features: Recipient name, thank you message, celebration animation
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Shoutouts</h2>
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p>Shoutouts feed will go here</p>
          <p className="text-sm mt-2">
            Show appreciation messages with heart icons and timestamps
          </p>
        </div>
      </div>
    </div>
  );
}
