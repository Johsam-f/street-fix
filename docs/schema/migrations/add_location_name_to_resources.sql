-- Migration: Add location_name to resources table
-- This adds a human-readable location name field to resources (like "Ndirande", "Mbayani")

ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS location_name TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS resources_location_name_idx ON resources(location_name);

-- Update existing resources to have location names based on their name
-- (This is a one-time update for existing data)
UPDATE resources
SET location_name = SPLIT_PART(name, ' ', 1)
WHERE location_name IS NULL;
