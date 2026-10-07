import { volunteerForProject, unvolunteerFromProject } from '../models/volunteers.js';

const processVolunteerForm = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.session.user.user_id;

    try {
        await volunteerForProject(userId, projectId);
        req.flash('success', 'You have volunteered for this project!');
    } catch (error) {
        console.error('Error volunteering for project:', error);
        req.flash('error', 'There was an error signing you up as a volunteer.');
    }

    res.redirect(`/project/${projectId}`);
};

const processUnvolunteerForm = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.session.user.user_id;
    const { redirectTo } = req.body;
    const safeRedirect = redirectTo === '/dashboard' || /^\/project\/\d+$/.test(redirectTo)
        ? redirectTo
        : '/dashboard';

    try {
        await unvolunteerFromProject(userId, projectId);
        req.flash('success', 'You have been removed as a volunteer for this project.');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'There was an error removing you as a volunteer.');
    }

    res.redirect(safeRedirect);
};

export { processVolunteerForm, processUnvolunteerForm };
