-- Add location_name field to issues table
ALTER TABLE issues ADD COLUMN IF NOT EXISTS location_name TEXT;

-- Create index for searching by location name
CREATE INDEX IF NOT EXISTS issues_location_name_idx ON issues(location_name);
