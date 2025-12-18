# SQL Debug Instructions

## Setup

1. **Create the exec_sql function**
   
   Open your Supabase SQL Editor and run the script from `scripts/000_create_exec_function.sql`:

   ```sql
   CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
   RETURNS json
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   DECLARE
     result json;
   BEGIN
     EXECUTE sql_query;
     RETURN json_build_object('success', true, 'message', 'Query executed successfully');
   EXCEPTION
     WHEN OTHERS THEN
       RETURN json_build_object(
         'success', false,
         'error', SQLERRM,
         'detail', SQLSTATE,
         'hint', 'Check the SQL syntax and database permissions'
       );
   END;
   $$;
   
   GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
   ```

2. **Navigate to the Debug Page**
   
   Open your browser and go to: `http://localhost:3000/debug/sql`

3. **Run the Migrations**
   
   Click the "Run All Steps" button. The page will execute each SQL statement step-by-step and show you:
   - ✅ Success status (green border)
   - ❌ Error status (red border) with detailed error message
   - ⏱️ Execution time for each step
   - 📝 The exact SQL that was executed

4. **Troubleshooting**

   If a step fails, you'll see:
   - The exact error message from PostgreSQL
   - The SQL statement that caused the error
   - The execution time before failure
   
   Common issues:
   - **"function exec_sql does not exist"**: Run step 1 above
   - **"type already exists"**: This is normal if you've run the script before
   - **"permission denied"**: Check RLS policies and user permissions
   - **"relation already exists"**: Tables already created (not an error)

5. **After Debugging**

   Once all steps are green, you can:
   - Navigate to `/auth/login` to log in
   - Create an admin user manually or use the setup script
   - Start using the application

## Manual Admin User Creation

If the automated scripts don't work, create an admin user manually:

1. Sign up through the app at `/auth/sign-up` with email `admin@propmanage.de`
2. Verify your email
3. Run this SQL in Supabase:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@propmanage.de';
