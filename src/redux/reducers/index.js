
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import { notification, message } from 'antd';
import {getMangerToken,getVersion,getJSONData,converString2Array} from '../../utils';
import store from '../../redux/store';

export function http(action) {

    if (!action.http) {
        console.warn("if http type , need http paramter for request");
    }
    let url = action.http.url || '';
    let params = action.http.params;
    let data = action.http.data;
    let method = action.http.method || '';
    let child = action.http.child || '';
    let name = action.name;
    let keyname =  action.keyname || 'code';
    let operator = action.operator;
    let cache = action.cache;

    if ('' === url || '' === method) {
        console.warn("Http request parameter error ");
        return;
    }
    let oldData = store.getState()[name];
    if(!!oldData && cache)
    {
        //若已经查询，则不会再去查询 
        return dispatch =>{
            dispatch({ type: 'CHANGE', name: name, value:store.getState()[name] });
        }
    }
    let callback = action.callback;
 
    return dispatch => {
        return httpRequest(url, method, params, data).then(response => {
            if(!operator || '' === operator)
            {
                if( child !== '')
                {
                    dispatch({ type: 'CHANGE', name: name, value: response.data[child] });
                }
                else{
                    dispatch({ type: 'CHANGE', name: name, value: response.data });
                }
            }
            else 
            {
                if(!!oldData)
                {
                    if(operator === 'push')
                    {
                        let oldDataArr =  child !== ''?oldData[child]:oldData;
                        if(!oldDataArr)
                        {
                            oldDataArr = [];
                        }
                        if( child !== '')
                        {
                            let returnData = response.data.data;
                            oldDataArr.push(returnData);
                            oldData[child]=oldDataArr;
                   
                            dispatch({ type: 'CHANGE', name: name, value: oldData });
                        }
                        else{
                            let returnData = response.data;
                             oldDataArr.push(returnData);
                            dispatch({ type: 'CHANGE', name: name, value:oldDataArr});
                        }
                    }
                    else if(operator === 'deduct')
                    { 
                        let oldDataArr =  child !== ''?oldData[child]:oldData;
                        let dataResponse = getJSONData(response.data);
                        if (!!dataResponse && !!dataResponse.code && dataResponse.code === "0") {
                          let keys = converString2Array(dataResponse.data, ",");
                          let deleteKeys = [];
                          for (let h = 0; h < keys.length; h++) {
                            let indexArr = oldDataArr.findIndex((value, index, arr) => { return value[keyname] == keys[h] });
                            deleteKeys.push(indexArr);
                          }
                          for (let hk = 0; hk < deleteKeys.length; hk++) {
                            if (deleteKeys[hk] === -1) {
                              continue;
                            }
                            oldDataArr.splice(deleteKeys[hk], 1);
                          }
                          if(!!child && child !== '')
                          {
                             oldData[child] = oldDataArr;
                    
                             dispatch({ type: 'CHANGE', name: name, value:oldData});
                          }
                          else
                          {
                       
                            dispatch({ type: 'CHANGE', name: name, value:oldDataArr});
                          }
                        
                        }
                    }
                    else if(operator === 'update')
                    {
                       
                        let oldDataArr =  (child !== '')?oldData[child]:oldData;
                        if(!oldDataArr)
                        {
                            oldDataArr = [];
                        }
                        if (!!response && !!response.data) {
                          let newData = response.data.data;
                          for (let i = 0; i < oldDataArr.length; i++) {
                              
                            if (oldDataArr[i][keyname] === newData[keyname]) {
                                oldDataArr[i] = newData;
                            }
                          }
                        }
                   
                        if(!!child && child !== '')
                        {
                        
                           oldData[child] = oldDataArr;
                           dispatch({ type: 'CHANGE', name: name, value:oldData});
            
                        }
                        else
                        {
                          dispatch({ type: 'CHANGE', name: name, value:oldDataArr});
                        }
                       
                    }
             
                  
                }
                else
                {
                    dispatch({ type: 'CHANGE', name: name, value:  child !== ''?response.data.data:esponse.data });
                }
               
            }
          
          
            if (!!callback) {
                callback(response.data);
            }
        }).catch(error => {
            
            if (error.response) {
                if (!!error.response.data) {
                    let msg = error.response.data.msg;
                    if(!!msg && ''!==msg)
                    {
                        message.error(msg);
                    }
                    else
                    {
                        message.error('网络异常');
                    }
                  
                }
                else {
                    message.error('网络异常');
                }

            }
            if (!!callback) {
                callback({code:"10001",msg:'网络异常'});
            }
        });
    }

}

export function downLoadFile(url, method) {
    return axios.request({
        url: url,
        method: method,
        headers: {
            "Authorization": "Bearer " + getMangerToken(),
            "Content-Type": "application/json",
            "Accept": "application/json",
            "EVersion": getVersion(),
        },
        responseType:'blob',

    }).then( data => {
            let code = decodeURI(data.headers['code']);
            let fileName = decodeURI(data.headers['content-disposition'].split(';')[1].split('=')[1]);
            let url = window.URL.createObjectURL(new Blob([data.data]));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        
           
       })
}


export function httpDict(key,refresh = false,name){

    let dName = name || key;
    if(!key || '' === key)
    {
        console.warn("Key not emit.");
        return;
    }
    if(!!store.getState()[dName] && !refresh)
    {
        //若已经查询，则不会再去查询 
        return dispatch =>{
            dispatch({ type: 'CHANGE', name: dName, value:store.getState()[key] });
        }
    }
   
    let url = '/eframe/dict/'+key;
    let method = 'GET';
    return dispatch => {
        return httpRequest(url, method, undefined, undefined).then(response => {
        
            dispatch({ type: 'CHANGE', name: dName, value: response.data.data });
        }).catch(error => {
            console.error(error);
            if (error.response) {
                if (!!error.response.data) {
                    let msg = error.response.data.msg;
                    if(!!msg && msg !== '')
                    {
                        message.error(msg);
                    }
                    else
                    {
                        message.error('网络异常');
                    }
                   
                }
                else {
                    message.error('网络异常');
                }

            }
        });
    }

}


export function httpRequest(url, method, params, data) {
    return axios.request({
        url: url,
        method: method,
        headers: {
            "Authorization": "Bearer " + getMangerToken(),
            "Content-Type": "application/json",
            "Accept": "application/json",
            "EVersion": getVersion(),
        },
        params: params,
        data: data

    })
}



//action格式
// {
//     type:'' 操作类型:HTTP:  发送http请求,   CHANGE:修改值
//     name:'' 键值
//     http.url:''  http地址
//     http.params:''  请求参数(URL)
//     http.data:''  请求参数(body)
//     http.method:''  请求方法
//     value  是修改的值
//     callBack:function  回调(只有成功才会回调)
// }
export function httpReducer(state = [], action) {
    switch (action.type) {
        case 'CHANGE':
            {
                let name = action.name;
                state[name] = action.value;
                return state;
            }
        default:
            {
                return state;
            }
    }
}



export function createRootReducer() {
    return combineReducers({
        http: httpReducer
    })
}