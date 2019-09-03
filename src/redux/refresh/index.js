import store from '../../redux/store';
import { http } from '../../redux/reducers';
import {getMangerToken} from '../../utils';
export function refresh(history){
    getCurrentUser(history);
    //getCurrentMenu(history);
}

function getCurrentMenu(history)
{
    let pathName = history.location.pathname;
    console.log(pathName);
    const { CURRENT_MENU } = store.getState();
    if(!!CURRENT_MENU)
    {
        return ;
    }
    store.dispatch(http({
        type: 'HTTP',
        name: 'CURRENT_MENU',
        http:
        {
            url: '/eframe/manage/menu-path',
            method: 'GET',
            params: {
                path:pathName
            }
        },


    }));

}

function getCurrentUser(history){
    const { CURRENT_USER } = store.getState();
    if(!!CURRENT_USER)
    {
        return;
    }
    let managerToken = getMangerToken();
    if(!managerToken || '' ===managerToken)
    {
        console.warn('Re login please');
        history.push('/');
        return;
    }
    store.dispatch(http({
        type: 'HTTP',
        name: 'CURRENT_USER',
        http:
        {
            url: '/eframe/system-information/current/login',
            method: 'GET',
            child:'data'
         
        },

    }));
}