
-- Create a profiles table for additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  business_name TEXT,
  location TEXT,
  role user_role NOT NULL DEFAULT 'vendor',
  phone TEXT,
  about TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create or replace function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'vendor')::user_role,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update bulk_orders table to ensure creator_id references auth.users
-- (This should already exist but ensuring it's properly set up)
ALTER TABLE public.bulk_orders 
ADD CONSTRAINT bulk_orders_creator_id_fkey 
FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure bulk_order_participants table has proper foreign key
ALTER TABLE public.bulk_order_participants 
ADD CONSTRAINT bulk_order_participants_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add policy to allow users to create bulk orders
CREATE POLICY IF NOT EXISTS "Authenticated users can create bulk orders" 
ON public.bulk_orders 
FOR INSERT 
WITH CHECK (auth.uid() = creator_id);

-- Add policy to allow users to view their participation in bulk orders
CREATE POLICY IF NOT EXISTS "Users can view their participation" 
ON public.bulk_order_participants 
FOR SELECT 
USING (auth.uid() = user_id);
