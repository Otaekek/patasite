export interface DiyProject {
  id: string
  name: string
}

// Each project's page content lives in src/content/diy/<id>.md
export const diyProjects: DiyProject[] = [
  { id: 'patadome', name: 'Patadôme' },
  { id: 'patasound', name: 'Patasound' },
  { id: 'patanode', name: 'Patanode' },
  { id: 'patalight', name: 'Patalight' },
]

export function projectHref(id: string): string {
  return `${import.meta.env.BASE_URL}project.html?id=${id}`
}
