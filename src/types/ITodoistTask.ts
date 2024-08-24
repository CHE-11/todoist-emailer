
export interface ITodoistTask {
  creatorId: string;
  createdAt: string;
  assigneeId?: string;
  assignerId?: string;
  commentCount?: number;
  isCompleted?: boolean;
  content: string;
  description?: string;
  due?: {
    date?: string;
    isRecurring?: boolean;
    datetime?: string;
    string?: string;
    timezone?: string;
  };
  duration?: {
    amount: number;
    unit: string;
  }
  id: string;
  labels?: string[];
  order?: number;
  priority?: number;
  projectId?: string;
  sectionId?: string;
  parentId: string;
  url?: string;
}