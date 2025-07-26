
-- Create enum types for better data integrity
CREATE TYPE public.user_role AS ENUM ('vendor', 'supplier');
CREATE TYPE public.alert_status AS ENUM ('active', 'triggered', 'inactive');
CREATE TYPE public.bulk_order_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE public.notification_type AS ENUM ('price_drop', 'alert_triggered', 'bulk_order', 'system');

-- Create profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL,
  phone TEXT,
  location TEXT,
  business_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create market_prices table for daily price tracking
CREATE TABLE public.market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  supplier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, location, date, supplier_id)
);

-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  location TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  specialties TEXT[],
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create supplier_products table for many-to-many relationship
CREATE TABLE public.supplier_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  minimum_quantity INTEGER DEFAULT 1,
  available_quantity INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(supplier_id, product_id)
);

-- Create bulk_orders table
CREATE TABLE public.bulk_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  current_price DECIMAL(10,2) NOT NULL,
  target_price DECIMAL(10,2) NOT NULL,
  minimum_quantity INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 1,
  target_participants INTEGER NOT NULL,
  location TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status bulk_order_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bulk_order_participants table
CREATE TABLE public.bulk_order_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bulk_order_id UUID NOT NULL REFERENCES public.bulk_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(bulk_order_id, user_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_conversations table for AI chat history
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_order_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for products (public read access)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT TO authenticated USING (true);

-- Create RLS policies for market_prices
CREATE POLICY "Anyone can view market prices" ON public.market_prices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Suppliers can insert their own prices" ON public.market_prices FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'supplier')
);

-- Create RLS policies for suppliers
CREATE POLICY "Anyone can view suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage their own supplier profile" ON public.suppliers FOR ALL TO authenticated USING (user_id = auth.uid());

-- Create RLS policies for supplier_products
CREATE POLICY "Anyone can view supplier products" ON public.supplier_products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Suppliers can manage their own products" ON public.supplier_products FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.suppliers WHERE id = supplier_id AND user_id = auth.uid())
);

-- Create RLS policies for bulk_orders
CREATE POLICY "Anyone can view active bulk orders" ON public.bulk_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create bulk orders" ON public.bulk_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their bulk orders" ON public.bulk_orders FOR UPDATE TO authenticated USING (auth.uid() = creator_id);

-- Create RLS policies for bulk_order_participants
CREATE POLICY "Users can view bulk order participants" ON public.bulk_order_participants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join bulk orders" ON public.bulk_order_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own participation" ON public.bulk_order_participants FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Create RLS policies for chat_conversations
CREATE POLICY "Users can view their own conversations" ON public.chat_conversations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON public.chat_conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own conversations" ON public.chat_conversations FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view messages in their conversations" ON public.chat_messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert messages in their conversations" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND user_id = auth.uid())
);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_market_prices_product_location_date ON public.market_prices(product_id, location, date);
CREATE INDEX idx_suppliers_location ON public.suppliers(location);
CREATE INDEX idx_suppliers_verified ON public.suppliers(verified);
CREATE INDEX idx_bulk_orders_status_expires ON public.bulk_orders(status, expires_at);
CREATE INDEX idx_bulk_orders_location ON public.bulk_orders(location);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id);

-- Insert sample data for products
INSERT INTO public.products (name, category, unit, description) VALUES
('Onions', 'Vegetables', 'kg', 'Fresh red and white onions'),
('Rice', 'Grains', 'kg', 'Basmati and regular rice varieties'),
('Cooking Oil', 'Oil', '15L', 'Refined cooking oil in bulk'),
('Potatoes', 'Vegetables', 'kg', 'Fresh potatoes for cooking'),
('Tomatoes', 'Vegetables', 'kg', 'Fresh red tomatoes'),
('Wheat Flour', 'Grains', 'kg', 'High quality wheat flour'),
('Lentils', 'Pulses', 'kg', 'Various lentil varieties'),
('Paneer', 'Dairy', 'kg', 'Fresh cottage cheese'),
('Spices Mix', 'Spices', 'kg', 'Mixed spice blends'),
('Sugar', 'Grocery', 'kg', 'Refined white sugar');

-- Insert sample suppliers data
INSERT INTO public.suppliers (business_name, contact_person, phone, location, specialties, verified) VALUES
('Mumbai Fresh Produce', 'Rajesh Kumar', '+91-9876543210', 'Andheri West', ARRAY['Vegetables', 'Fruits'], true),
('Golden Oil Trading', 'Amit Sharma', '+91-9876543211', 'Bandra', ARRAY['Oil', 'Grocery'], true),
('Rice Masters', 'Suresh Patel', '+91-9876543212', 'Thane', ARRAY['Grains', 'Rice'], true),
('Spice Kingdom', 'Priya Singh', '+91-9876543213', 'Kurla', ARRAY['Spices', 'Masalas'], true),
('Dairy Fresh', 'Mohan Reddy', '+91-9876543214', 'Powai', ARRAY['Dairy', 'Milk Products'], true);
