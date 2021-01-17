/// <reference path="./base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../utils/validation.ts" />
/// <reference path="../state/project.ts" />
namespace App {
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
      super('project-input', 'app', true, 'user-input');

      this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

      this.configure();
    }
    configure() {
      this.element.addEventListener('submit', this.submitHandler);
    }
    renderContent() {}

    @autobind
    private submitHandler(event: Event) {
      event.preventDefault();
      const collectedInputs = this.collectInput();

      if (Array.isArray(collectedInputs)) {
        const [title, desc, people] = collectedInputs;
        projectState.addProject(title, desc, people);
        this.clearInput();
      }
    }

    private clearInput(): void {
      this.titleInputElement.value = '';
      this.descriptionInputElement.value = '';
      this.peopleInputElement.value = '';
    }

    private collectInput(): [string, string, number] | void {
      const title = this.titleInputElement.value;
      const desc = this.descriptionInputElement.value;
      const people = this.peopleInputElement.value;

      const titleValidatable: Validatable = {
        value: title,
        required: true,
      };
      const descValidatable: Validatable = {
        value: desc,
        required: true,
        minLength: 5,
      };
      const peopleValidatable: Validatable = {
        value: +people,
        required: true,
        min: 1,
        max: 5,
      };

      if (!validate(titleValidatable) || !validate(descValidatable) || !validate(peopleValidatable)) {
        alert('Invalid input, please try again!');
        return;
      }

      return [title, desc, +people];
    }
  }
}
