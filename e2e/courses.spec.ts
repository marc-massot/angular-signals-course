import { expect, test } from '@playwright/test';

async function login(page: any) {
  await page.goto('/login');
  await page.locator('input[formcontrolname="email"]').fill('test@angular-university.io');
  await page.locator('input[formcontrolname="password"]').fill('test');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('h3')).toContainText('All Courses');
}

test.describe('Courses home page', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should show Beginners and Advanced tabs with courses', async ({ page }) => {
    // Verifiquem que existeixen les dues pestanyes
    const beginnersTab = page.getByRole('tab', { name: 'Beginners' });
    const advancedTab = page.getByRole('tab', { name: 'Advanced' });

    await expect(beginnersTab).toBeVisible();
    await expect(advancedTab).toBeVisible();

    // Comprovem que la pestanya Beginners té cursos
    await beginnersTab.click();
    const beginnersPanel = page.getByRole('tabpanel', { name: 'Beginners' });
    const beginnerCourses = beginnersPanel.locator('.course-card');
    await expect(beginnerCourses.first()).toBeVisible();
    const beginnerCount = await beginnerCourses.count();
    expect(beginnerCount).toBeGreaterThan(0);

    // Recollim els títols de cursos Beginners
    const beginnerTitles = await beginnerCourses.locator('.course-title').allTextContents();

    // Comprovem que la pestanya Advanced té cursos
    await advancedTab.click();
    const advancedPanel = page.getByRole('tabpanel', { name: 'Advanced' });
    const advancedCourses = advancedPanel.locator('.course-card');
    await expect(advancedCourses.first()).toBeVisible();
    const advancedCount = await advancedCourses.count();
    expect(advancedCount).toBeGreaterThan(0);

    // Recollim els títols de cursos Advanced
    const advancedTitles = await advancedCourses.locator('.course-title').allTextContents();

    // Verifiquem que ambdós llistats tenen cursos diferents (sense solapament)
    const hasOverlap = beginnerTitles.some(title => advancedTitles.includes(title));
    expect(hasOverlap).toBe(false);
  });

  test('should edit the title of the first Beginners course and verify the updated title', async ({ page }) => {
    // Anem a la pestanya Beginners
    await page.getByRole('tab', { name: 'Beginners' }).click();
    const beginnersPanel = page.getByRole('tabpanel', { name: 'Beginners' });

    // Llegim el títol original del primer curs
    const firstCourseTitle = beginnersPanel.locator('.course-card').first().locator('.course-title');
    const originalTitle = await firstCourseTitle.textContent();
    const newTitle = originalTitle!.trim() + 'X';

    // Cliquem EDIT del primer curs
    await beginnersPanel.locator('.course-card').first().getByRole('button', { name: 'EDIT' }).click();

    // Esperem que s'obri el diàleg d'edició
    const dialog = page.locator('edit-course-dialog');
    await expect(dialog).toBeVisible();

    // Modifiquem el títol afegint-hi una lletra 'X' al final
    const titleInput = dialog.locator('input[formcontrolname="title"]');
    await titleInput.clear();
    await titleInput.fill(newTitle);

    // Guardem el canvi
    await dialog.getByRole('button', { name: 'Save' }).click();

    // Esperem que el diàleg es tanqui
    await expect(dialog).not.toBeVisible();

    // Verifiquem que el títol actualitzat apareix al llistat
    await expect(firstCourseTitle).toHaveText(newTitle);
  });

});
