<p align="center">
  <h1 align="center">@devlsh/form-demo</h1>
  <p align="center">Interactive demonstration of reactive Vue forms.</p>
</p>

<br />

The demo is a simple, styled project-brief form utilizing `@devlsh/form` for field values, validation errors, submission, and reset.

## Try It

Open the [interactive demo](https://form.devlsh.com).

Fill in the project brief to see the validation results.

Use the controls to change the demonstration:

- **Contact:** Enter a valid email address and the same address in **Confirm email**.
- **Project:** Enter a project name and a description with at least 20 characters after whitespace trim.
- **Working arrangement:** Select **Remote** or **On-site**. **On-site** requires a nonblank city.
- **Deliverables:** Use **Add deliverable** and **Remove** to edit the array. Keep at least one item. Each name requires at least three characters after whitespace trim. Names must differ regardless of case or outer whitespace.
- **Submit demo:** Validate the form. An invalid submission shows field errors. A valid submission runs a local callback with a 2-second delay, then shows success.
- **Reset:** Restore the blank fields, **Remote** selection, and one blank deliverable. Clear errors and status.

Controls remain disabled during the local callback.

---

> [devlsh.com](https://devlsh.com) &nbsp;&middot;&nbsp;
> GitHub: [@devlsh](https://github.com/devlsh) &nbsp;&middot;&nbsp;
> X: [@itsdevlsh](https://x.com/itsdevlsh)
