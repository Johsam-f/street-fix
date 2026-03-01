'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { createResource } from './actions';
import { Locate } from 'lucide-react';
import { toast } from 'sonner';

const RESOURCE_TYPES = [
  { value: 'water', label: 'Water (Communal Tap)' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'waste_collection', label: 'Waste Collection Point' },
  { value: 'other', label: 'Other' },
] as const;

export function AdminResourceForm() {
  const [name, setName] = useState('');
  const [type, setType] = useState<'water' | 'clinic' | 'waste_collection' | 'other'>('water');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          
          console.log(`Location accuracy: ${accuracy} meters`);
          setLocation({ lat, lng });

          // Get location name using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`
            );
            const data = await response.json();
            const locationName =
              data.address?.suburb ||
              data.address?.neighbourhood ||
              data.address?.village ||
              data.address?.town ||
              data.address?.city ||
              'Unknown Location';
            setLocationName(locationName);
          } catch (error) {
            console.error('Error getting location name:', error);
            setLocationName('Location captured');
          }

          setIsLoadingLocation(false);
          
          // Notify user if accuracy is low
          if (accuracy > 50) {
            toast.info(`Location captured with ${Math.round(accuracy)}m accuracy. For better accuracy, ensure GPS is enabled.`);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please enable location services.');
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,  // Use GPS for high accuracy
          timeout: 10000,             // Wait up to 10 seconds
          maximumAge: 0               // Don't use cached position
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
      setIsLoadingLocation(false);
    }
  };

  return (
    <Card className="p-6">
      <form
        action={async (formData: FormData) => {
          if (!location) {
            toast.error('Please capture the location first');
            return;
          }

          const name = formData.get('name') as string;
          const type = formData.get('type') as 'water' | 'clinic' | 'waste_collection' | 'other';
          const description = formData.get('description') as string;
          const contact = formData.get('contact') as string;

          if (!name || name.length < 2) {
            toast.error('Name must be at least 2 characters');
            return;
          }

          setIsSubmitting(true);

          const result = await createResource({
            name,
            type,
            latitude: location.lat,
            longitude: location.lng,
            locationName: locationName || undefined,
            description: description || undefined,
            contact: contact || undefined,
          });

          setIsSubmitting(false);

          if (result.error) {
            toast.error(result.error);
          } else {
            toast.success('Resource added successfully!');
            setName('');
            setDescription('');
            setContact('');
            setLocation(null);
            setLocationName('');
          }
        }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-xl font-semibold mb-4">Add Resource</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Resource Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="e.g., Community Tap #5"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <textarea
            id="description"
            name="description"
            placeholder="Additional details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={3}
            className="w-full px-3 py-2 border rounded-md resize-vertical bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contact Info (Optional)</Label>
          <Input
            id="contact"
            name="contact"
            type="text"
            placeholder="Phone number or contact details"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <Button
            type="button"
            onClick={handleGetLocation}
            disabled={isLoadingLocation || isSubmitting}
            variant="outline"
            className="w-full"
          >
            <Locate className="w-4 h-4 mr-2" />
            {location
              ? `Location: ${locationName || 'Captured'}`
              : isLoadingLocation
              ? 'Getting Location...'
              : 'Capture Current Location'}
          </Button>
          {location && locationName && (
            <p className="text-xs text-muted-foreground">
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          )}
        </div>

        <Button type="submit" disabled={!location || isSubmitting} className="w-full">
          {isSubmitting ? 'Adding...' : 'Add Resource'}
        </Button>
      </form>
    </Card>
  );
}
