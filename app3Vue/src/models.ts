
export type RouteViews = 'all' | 'completed' | 'active';

export interface AppState {
    newTodoTitle: string;
    currentView?: RouteViews;
    msg: string;
    messagePresent: boolean;
    navs: string[],
    todos: Todo[];
}

export interface Todo {
    title: string;
    completed: boolean;
}
