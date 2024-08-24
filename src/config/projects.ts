export interface IMyProject {
  id: string;
  name: string;
  include: boolean;
  daysToIncludeInFutureMorning?: number;
  daysToIncludeInFutureNightly?: number;
}

export const myProjects: IMyProject[] = [
  // Included
  { name: 'Example Project',
    id: '1234567890',
    include: true,
    daysToIncludeInFutureMorning: 2,
    daysToIncludeInFutureNightly: 1,
  },
];
