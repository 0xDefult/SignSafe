-- 1. Ensure table is named correctly
-- If the table is still 'contract_history', rename it to 'analysis_history'
-- ALTER TABLE contract_history RENAME TO analysis_history;

-- 2. Remove the restrictive 'own' policy
DROP POLICY IF EXISTS "own" ON analysis_history;

-- 3. Implement Team-based access for SELECT
-- Allows viewing if the user is the owner OR a member of the associated team
CREATE POLICY "team_access_select" ON analysis_history
FOR SELECT
USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.team_id = analysis_history.team_id
    AND team_members.user_id = auth.uid()
  )
);

-- 4. Restricted access for modifications
-- Only the owner can update or delete their own analysis
CREATE POLICY "owner_modify_all" ON analysis_history
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Enable RLS (if not already enabled)
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;
