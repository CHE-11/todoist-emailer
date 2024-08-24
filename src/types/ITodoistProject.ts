

export interface ITodoistProject {
  id: string;
  parentId: string;
  order: number;
  color: string;
  name: string;
  commentCount: number;
  isShared: boolean;
  isFavorite: boolean;
  isInboxProject: boolean;
  isTeamInbox: boolean;
  url: string;
  viewStyle: string;
}