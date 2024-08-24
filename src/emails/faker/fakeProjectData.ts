import { ITodoistProject } from "../../types/ITodoistProject";

// Helper function to generate mock projects
function createMockProject(id: number): ITodoistProject {
  return {
    id: `project-${id}`,
    parentId: `parent-${id}`,
    order: id,
    color: `color-${id}`,
    name: `Project Name ${id}`,
    commentCount: Math.floor(Math.random() * 10),
    isShared: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
    isInboxProject: Math.random() > 0.5,
    isTeamInbox: Math.random() > 0.5,
    url: `http://todoist.com/projects/project-${id}`,
    viewStyle: `style-${id}`
  };
}



// Function to generate mock project data based on ITodoistProject interface
export function generateMockProjects(number: number): ITodoistProject[] {
  const projects: ITodoistProject[] = [];
  for (let i = 1; i <= number; i++) {
    projects.push(createMockProject(i));
  }
  return projects;
}
