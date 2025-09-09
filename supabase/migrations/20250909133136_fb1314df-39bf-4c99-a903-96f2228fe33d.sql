-- Add missing columns to subjects table for admin management
ALTER TABLE public.subjects 
ADD COLUMN name character varying,
ADD COLUMN description text,
ADD COLUMN is_active boolean DEFAULT true,
ADD COLUMN color_code character varying DEFAULT '#3B82F6',
ADD COLUMN icon character varying DEFAULT 'BookOpen';

-- Update existing data to use subject column as name
UPDATE public.subjects 
SET name = subject 
WHERE name IS NULL;

-- Make name column NOT NULL after populating it
ALTER TABLE public.subjects 
ALTER COLUMN name SET NOT NULL;