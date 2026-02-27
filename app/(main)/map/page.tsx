export default function MapPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold">Community Map</h1>
        <p className="text-muted-foreground mt-2">
          Find nearby resources and view reported issues
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center text-muted-foreground space-y-2">
          <p className="text-lg font-medium">Interactive map will go here</p>
          <p className="text-sm">
            Leaflet.js map with issue markers and resource locations
          </p>
          <p className="text-sm">
            Center: Blantyre (-15.7861, 35.0058)
          </p>
        </div>
      </div>
    </div>
  );
}
