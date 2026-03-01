'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapIssue } from './actions';
import { Badge } from '@/components/ui/badge';
import { Locate } from 'lucide-react';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CATEGORY_COLORS = {
  water: '#3b82f6',
  sanitation: '#a855f7',
  waste: '#22c55e',
  other: '#6b7280',
} as const;

const STATUS_COLORS = {
  open: 'bg-red-500',
  in_progress: 'bg-yellow-500',
  resolved: 'bg-green-500',
} as const;

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
} as const;

// Create custom colored markers
const createCustomIcon = (category: MapIssue['category']) => {
  const color = CATEGORY_COLORS[category];
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

type IssueMapProps = {
  issues: MapIssue[];
};

export function IssueMap({ issues }: IssueMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  // Default center: Blantyre, Malawi
  const defaultCenter: [number, number] = [-15.7861, 35.0058];
  const defaultZoom = 13;

  // Calculate center based on issues if available
  const center: [number, number] = issues.length > 0
    ? [issues[0].latitude, issues[0].longitude]
    : defaultCenter;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={defaultZoom}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={createCustomIcon(issue.category)}
          >
            <Popup maxWidth={300}>
              <div className="space-y-2 p-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm">{issue.title}</h3>
                  <Badge className={`${STATUS_COLORS[issue.status]} text-xs`}>
                    {STATUS_LABELS[issue.status]}
                  </Badge>
                </div>
                
                {issue.image_url && (
                  <img
                    src={issue.image_url}
                    alt={issue.title}
                    className="w-full h-32 object-cover rounded"
                  />
                )}
                
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {issue.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" style={{ backgroundColor: CATEGORY_COLORS[issue.category], color: 'white' }}>
                    {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}
                  </Badge>
                </div>
                
                {issue.location_name && (
                  <div className="flex items-start gap-1 text-xs text-muted-foreground">
                    <Locate className="flex-shrink-0 mt-0.5" color="red" size={12} />
                    <span className="line-clamp-1">{issue.location_name}</span>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {formatDate(issue.created_at)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
