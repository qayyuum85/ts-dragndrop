import { autobind } from '../decorators/autobind';
import { DragTarget } from '../models/drag-drop';
import { Project, ProjectStatus } from '../models/project';
import { projectState } from '../state/project';
import { Component } from './base-component';
import { ProjectItem } from './project-item';
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED);
  }

  @autobind
  dragLeaveHandler() {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter((p) => {
        if (this.type === 'active') {
          return p.status === ProjectStatus.ACTIVE;
        }

        return p.status === ProjectStatus.FINISHED;
      });
      this.renderProject();
    });
  }

  private renderProject() {
    const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
    }
  }
}
