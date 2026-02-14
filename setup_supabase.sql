-- ProKanban Elite: Supabase Schema Setup

-- 1. Create Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' NOT NULL,
    priority TEXT DEFAULT 'medium' NOT NULL,
    category TEXT DEFAULT 'feature' NOT NULL,
    assignee TEXT,
    due_date DATE,
    subtasks JSONB DEFAULT '[]'::jsonb,
    is_archived BOOLEAN DEFAULT false NOT NULL,
    archived_at TIMESTAMP WITH TIME ZONE
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 3. Create Security Policies
-- Users can only view their own tasks
CREATE POLICY "Users can view their own tasks" 
ON public.tasks FOR SELECT 
USING (auth.uid() = owner_id);

-- Users can only insert their own tasks
CREATE POLICY "Users can insert their own tasks" 
ON public.tasks FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- Users can only update their own tasks
CREATE POLICY "Users can update their own tasks" 
ON public.tasks FOR UPDATE 
USING (auth.uid() = owner_id);

-- Users can only delete their own tasks
CREATE POLICY "Users can delete their own tasks" 
ON public.tasks FOR DELETE 
USING (auth.uid() = owner_id);

-- 4. Automatic 'updated_at' Refresh
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
