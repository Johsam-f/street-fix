'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { createIssue } from './actions';
import { Locate } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CATEGORIES = [
  { value: 'water', label: 'Water' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'waste', label: 'Waste' },
  { value: 'other', label: 'Other' },
] as const;

export function IssueReportForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('water');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        setLocationName(data.display_name);
      } else if (data.address) {
        // Build a more concise address from components
        const parts = [];
        if (data.address.road) parts.push(data.address.road);
        if (data.address.suburb) parts.push(data.address.suburb);
        if (data.address.city) parts.push(data.address.city);
        setLocationName(parts.join(', ') || data.display_name);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      // Keep coordinates only if geocoding fails
    }
  };

  const handleGetLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          
          setLocation({ lat, lng });
          await reverseGeocode(lat, lng);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Image must be smaller than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onerror = () => {
        toast.error('Failed to read image file');
        setImageFile(null);
        setImagePreview('');
      };
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6">
      <form action={async (formData: FormData) => {
        if (!location) {
          toast.error('Please get your location first');
          return;
        }

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;

        if (title.length < 5) {
          toast.error('Title must be at least 5 characters');
          return;
        }

        if (description.length < 10) {
          toast.error('Description must be at least 10 characters');
          return;
        }

        setIsSubmitting(true);

        try {
          let imageData;
          if (imageFile) {
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(imageFile);
            });
            
            imageData = {
              base64,
              fileName: imageFile.name,
              fileType: imageFile.type,
            };
          }

          const result = await createIssue({
            title,
            description,
            category: category as 'water' | 'sanitation' | 'waste' | 'other',
            latitude: location.lat,
            longitude: location.lng,
            locationName: locationName || undefined,
            imageData,
          });

          if (result.error) {
            toast.error(result.error);
            return;
          }

          // Reset form
          setTitle('');
          setDescription('');
          setCategory('water');
          setImageFile(null);
          setImagePreview('');
          setLocation(null);
          setLocationName('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }

          toast.success('Issue reported successfully!');
        } catch (error) {
          console.error('Error submitting issue:', error);
          toast.error('Failed to submit issue. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      }} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief summary of the issue"
            required
            minLength={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail"
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
            minLength={10}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Photo (optional)</Label>
          <Input
            id="image"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2 relative">
              <Image
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-48 object-cover rounded-md"
                width={400}
                height={200}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2"
              >
                Remove
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              onClick={handleGetLocation}
              disabled={isLoadingLocation}
              variant="outline"
            >
              {isLoadingLocation ? 'Getting Location...' : 'Get My Location'}
            </Button>
            {location && (
              <div className="flex-1 text-sm">
                <div className="flex items-start gap-2">
                  <Locate className="flex-shrink-0 mt-0.5" color='red' size={16}/>
                  <div>
                    {locationName && (
                      <p className="font-medium text-foreground">{locationName}</p>
                    )}
                    <p className="text-muted-foreground text-xs">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting || !location} className="w-full">
          {isSubmitting ? 'Submitting...' : 'Report Issue'}
        </Button>
      </form>
    </Card>
  );
}
