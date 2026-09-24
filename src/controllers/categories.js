// Import any needed model functions
import { body, validationResult } from 'express-validator';
import { getAllCategories, getCategoryById, getCategoriesByServiceProject, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js';
import { getProjectsByCategory, getProjectById } from '../models/projects.js';

// Define validation rules for category form
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 1, max: 150 }).withMessage('Category name must be between 1 and 150 characters')
];

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};  

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategory(categoryId);
    const title = 'Category Details';

    res.render('category', { title, category, projects});
}

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectById(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProject(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categories || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', { title });
}

const processNewCategoryForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new category form
        return res.redirect('/new-category');
    }

    // Extract form data from req.body
    const { name } = req.body;

    try {
        // Create the new category in the database
        const newCategoryId = await createCategory(name);

        req.flash('success', 'New category created successfully!');
        res.redirect(`/category/${newCategoryId}`);
    } catch (error) {
        console.error('Error creating new category:', error);
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new-category');
    }
}

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const categoryResult = await getCategoryById(categoryId);
    const category = categoryResult[0];
    const title = 'Edit Category';

    res.render('edit-category', { title, category });
}

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit category form
        return res.redirect('/edit-category/' + categoryId);
    }

    // Extract form data from req.body
    const { name } = req.body;

    try {
        // Update the category in the database
        await updateCategory(categoryId, name);

        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        res.redirect('/edit-category/' + categoryId);
    }
}

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation };