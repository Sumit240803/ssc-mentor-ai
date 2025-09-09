-- Create mock_test_results table to store student test scores
CREATE TABLE public.mock_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_questions INTEGER NOT NULL,
  answered_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  incorrect_answers INTEGER NOT NULL,
  unanswered_questions INTEGER NOT NULL,
  score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  section_wise_scores JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mock_test_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own test results" 
ON public.mock_test_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results" 
ON public.mock_test_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all test results" 
ON public.mock_test_results 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mock_test_results_updated_at
BEFORE UPDATE ON public.mock_test_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_mock_test_results_user_id ON public.mock_test_results(user_id);
CREATE INDEX idx_mock_test_results_test_date ON public.mock_test_results(test_date DESC);