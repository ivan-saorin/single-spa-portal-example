
export type RouteViews = 'all' | 'completed' | 'active';

export interface AppState {
    newTodoTitle: string;
    currentView?: RouteViews;
    msg: string;
    messagePresent: boolean;
    todos: Todo[];
}

export interface Todo {
    title: string;
    completed: boolean;
}
