import fetch from '../interceptors'

/*
* url: '/task/task'
* method: 'get'
* Request:
* Object
* data:{
*   id: graphId,
* }
*
* Response:
* Object
* {
*   data:graphData,
*   msg:responseMsg,
*   stateCode:responseCode
* }
*
* */
export function runTask(data) {
  return fetch({
    url: '/task/task',
    method: 'post',
    data: data
  });
}


export function runTaskFromNode(data) {
  return fetch({
    url: '/task/taskfromnode',
    method: 'post',
    data: data
  });
}
