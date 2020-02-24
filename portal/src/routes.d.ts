export interface Routes {
    [key: string]: Target;
}

export interface Target {
    redirect?: URITarget;
    external?: URITarget;
    internal?: InternalTarget;
}

export interface URITarget {
    url:    string;
    target: string;
}

export interface InternalTarget {
    default?: boolean;
    target:  string;
}

