export default function IssuesPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Report an Issue</h1>
        <p className="text-muted-foreground mt-2">
          Document problems in your community with photos and location
        </p>
      </div>

      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p>Issue reporting form will go here</p>
        <p className="text-sm mt-2">
          Features: Photo upload, GPS location, category selection, description
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Issues</h2>
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p>Issue feed/list will go here</p>
        </div>
      </div>
    </div>
  );
}
