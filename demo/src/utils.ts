export interface Project {
  title: string;
  description: string;
}

export interface Deliverable {
  id: number;
  name: string;
}

let nextDeliverableId = 0;

export function createDeliverable(): Deliverable {
  return {
    id: nextDeliverableId++,
    name: '',
  };
}

export function validateProject(value: Project) {
  if (!value.title.trim()) {
    return new Error('Enter a project name.');
  }

  if (value.description.trim().length < 20) {
    return new Error('Use at least 20 characters for the description.');
  }

  return true;
}

export function validateDeliverables(values: Deliverable[]) {
  if (values.length === 0 || values.some((item) => item.name.trim().length < 3)) {
    return new Error('Add at least one deliverable. Use 3 or more characters for each.');
  }

  if (new Set(values.map((item) => item.name.trim().toLowerCase())).size !== values.length) {
    return new Error('Each deliverable must have a different name.');
  }

  return true;
}

export async function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export function submissionMessage(project: Project, deliverables: Deliverable[]) {
  return `Project “${project.title}” validated with ${deliverables.length} deliverable(s). Nothing was sent or saved.`;
}
