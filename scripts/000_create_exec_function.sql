-- Create a function to execute SQL statements dynamically
-- This function is needed for the debug page to work
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Execute the query and return success
  EXECUTE sql_query;
  RETURN json_build_object('success', true, 'message', 'Query executed successfully');
EXCEPTION
  WHEN OTHERS THEN
    -- Return detailed error information
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'detail', SQLSTATE,
      'hint', 'Check the SQL syntax and database permissions'
    );
END;
$$;

-- Grant execute permission to authenticated users (you may want to restrict this further)
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
