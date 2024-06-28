import { Page } from "@playwright/test";
import DatepickerPage from '../page-objects/datepickerPage';
import FormLayoutsPage from '../page-objects/formLayoutsPage';
import NavigationPage from '../page-objects/navigationPage';

class PageManager {
    private readonly page: Page;
    private readonly datepickerPage: DatepickerPage;
    private readonly formLayoutsPage: FormLayoutsPage;
    private readonly navigationPage: NavigationPage;

    constructor(page: Page) {
        this.page = page;
        this.datepickerPage = new DatepickerPage(this.page);
        this.formLayoutsPage = new FormLayoutsPage(this.page);
        this.navigationPage = new NavigationPage(this.page);
    }

    navigateTo() {
        return this.navigationPage;
    }

    onFormLayoutsPage() {
        return this.formLayoutsPage;
    }

    onDatepickerPage() {
        return this.datepickerPage;
    }
}

export default PageManager;