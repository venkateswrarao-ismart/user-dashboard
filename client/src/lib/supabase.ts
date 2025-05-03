
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sqpgtmpbfmtaivbfsjuy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxcGd0bXBiZm10YWl2YmZzanV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTg5NjksImV4cCI6MjA1Nzg3NDk2OX0.lXF9kF17AvrXT7Om8It8JoVTD-cLkuYQffz5bdQ61XA';

export const supabase = createClient(supabaseUrl, supabaseKey);
