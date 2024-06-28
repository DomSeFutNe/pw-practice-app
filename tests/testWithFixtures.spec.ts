import { test } from "../fixtures/test-option";

import { faker } from "@faker-js/faker";

test("Parametrized methods", async ({ pageManager }) => {
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName
    .replace(/\s/g, ".")
    .toLowerCase()}@test.com`;
  const randomPassword = faker.internet;

  await pageManager
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
      randomEmail,
      randomPassword.password(),
      "Option 1"
    );
  await pageManager
    .onFormLayoutsPage()
    .submitInlineFormWithNameEmailAndCheckbox(
      randomFullName,
      randomEmail,
      true
    );
});
