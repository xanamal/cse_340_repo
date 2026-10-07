import db from './db.js'

const volunteerForProject = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteer (project_id, user_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [projectId, userId]);
}

const unvolunteerFromProject = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteer
        WHERE project_id = $1 AND user_id = $2;
    `;

    await db.query(query, [projectId, userId]);
}

const isUserVolunteered = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM project_volunteer
        WHERE project_id = $1 AND user_id = $2;
    `;

    const result = await db.query(query, [projectId, userId]);

    return result.rows.length > 0;
}

const getProjectsVolunteeredByUser = async (userId) => {
    const query = `
        SELECT
          s.project_id,
          s.title,
          s.description,
          s.location,
          s.date,
          o.name
        FROM project_volunteer v
        JOIN service_project s
        ON v.project_id = s.project_id
        JOIN organization o
        ON s.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY s.date;
    `;

    const result = await db.query(query, [userId]);

    return result.rows;
}

export { volunteerForProject, unvolunteerFromProject, isUserVolunteered, getProjectsVolunteeredByUser };
