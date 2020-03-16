import { Routes } from './Routes';
import { ModuleHandler } from './ModuleHandler';
import { Mediator } from './Mediator';
import * as topics from './Mediator';
import { User } from './auth/AuthModels'


export default class LoginHandler extends ModuleHandler {
    constructor(mediator: Mediator, routes: Routes) {
        super(mediator, routes, 'login');
    }

    protected attachEvents(): void {
        let button = document.getElementById('submit');
        button.removeEventListener('click', this.clickHandler);
        button.addEventListener('click', this.clickHandler);
    }
    protected detachEvents(): void {
        let button = document.getElementById('submit');
        button.removeEventListener('click', this.clickHandler);
    }

    private async submit() {
        console.log('[HOST] login form submit');
        let userEl = document.getElementById('user') as HTMLInputElement;
        let passwordEl = document.getElementById('password') as HTMLInputElement;

        let userInfo: User = {
            user: userEl.value,
            password: passwordEl.value
        }

        try {
            await this.mediator.request(topics.COMMAND_LOGIN, userInfo);
            userEl.value = '';
            passwordEl.value = '';
            await this.mediator.request(topics.COMMAND_COMPLETE_PREV_NAVIGATION, {});
        } catch(error) {
            console.error(error);
            userEl.value = '';
            passwordEl.value = '';
        }        
    }

    private clickHandler = (event: any) =>  {
        console.log('[HOST] login click', event.target);
        event.preventDefault();

        this.submit();
    }

}