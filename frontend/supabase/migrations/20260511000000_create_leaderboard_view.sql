-- Create a function to calculate leaderboard for a contest
CREATE OR REPLACE FUNCTION public.get_contest_leaderboard(p_contest_id UUID)
RETURNS TABLE (
    user_id UUID,
    username TEXT,
    avatar_url TEXT,
    solved_count BIGINT,
    total_penalty BIGINT,
    last_solve_at TIMESTAMP WITH TIME ZONE,
    problem_stats JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH participant_data AS (
        SELECT 
            p.user_id,
            pr.username,
            pr.avatar_url,
            cpp.problem_id,
            cpp.status,
            cpp.submission_count,
            cpp.first_solve_at,
            c.started_at
        FROM public.contest_participants p
        JOIN public.profiles pr ON p.user_id = pr.id
        JOIN public.contests c ON p.contest_id = c.id
        LEFT JOIN public.contest_participant_progress cpp ON p.contest_id = cpp.contest_id AND p.user_id = cpp.user_id
        WHERE p.contest_id = p_contest_id
    ),
    user_stats AS (
        SELECT 
            pd.user_id,
            pd.username,
            pd.avatar_url,
            COUNT(CASE WHEN pd.status = 'solved' THEN 1 END) as solved_count,
            SUM(
                CASE 
                    WHEN pd.status = 'solved' THEN 
                        EXTRACT(EPOCH FROM (pd.first_solve_at - pd.started_at)) / 60 + 
                        (pd.submission_count - 1) * 20
                    ELSE 0 
                END
            )::BIGINT as total_penalty,
            MAX(pd.first_solve_at) as last_solve_at,
            jsonb_object_agg(
                pd.problem_id, 
                jsonb_build_object(
                    'status', COALESCE(pd.status, 'untouched'),
                    'attempts', COALESCE(pd.submission_count, 0),
                    'solve_time', pd.first_solve_at
                )
            ) FILTER (WHERE pd.problem_id IS NOT NULL) as problem_stats
        FROM participant_data pd
        GROUP BY pd.user_id, pd.username, pd.avatar_url
    )
    SELECT 
        us.user_id,
        us.username,
        us.avatar_url,
        us.solved_count,
        us.total_penalty,
        us.last_solve_at,
        COALESCE(us.problem_stats, '{}'::jsonb)
    FROM user_stats us
    ORDER BY us.solved_count DESC, us.total_penalty ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
