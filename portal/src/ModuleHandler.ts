import { Routes } from './Routes';
import { Mediator } from './Mediator';

export abstract class ModuleHandler {

    constructor(protected mediator: Mediator, protected routes: Routes, protected selector: string) {
        
    }

    protected getSelectorEl(): HTMLElement {
        let el: HTMLElement = document.querySelector(this.selector);
        if (!el) {
            throw new EvalError(`Invalid selector: ${this.selector}`);
        }
        return document.querySelector(this.selector);
    }

    public mount(): void {
        this.attachEvents();
    }

    protected abstract attachEvents(): void;

    public unmount(): void {
        this.detachEvents();
    }

    protected abstract detachEvents(): void;

}