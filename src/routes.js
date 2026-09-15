import { showOrganizationDetailsPage } from './controllers/organizations.js';

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);