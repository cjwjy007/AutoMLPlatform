import fetch from '../interceptors'

/*
* url: '/config/columns'
* method: 'get'
* Request:
* Object
* data:{
*   graphId: graphId,
*   nodeId: nodeId,
* }
*
* Response:
* Object
* {
*   data:[columnName1,columnName2,columnName3...],
*   msg:responseMsg,
*   stateCode:responseCode
* }
*
* */
export function getColumns(data) {
  return fetch({
    url: '/config/columns',
    method: 'get',
    params: data
  });
}

/*
* url: '/config/columnsdetail'
* method: 'get'
* Request:
* Object
* data:{
*   graphId: graphId,
*   nodeId: nodeId,
*   column: columnName
* }
*
* Response:
* Object
* {
*   data:{
*     feature1: value,
*     feature2: value
*     ...
*   },
*   msg:responseMsg,
*   stateCode:responseCode
* }
* */
export function getColumnDetail(data) {
  return fetch({
    url: '/config/columnsdetail',
    method: 'get',
    params: data
  });
}

/*
* url: '/config/config'
* method: 'post'
* Request:
* Object
* data:{
*   graphId: graphId,
*   nodeId: nodeId,
*   config: configDetail
* }
*
* Response:
* Object
* {
*   data:null,
*   msg:responseMsg,
*   stateCode:responseCode
* }
* */
export function setConfig(data){
  return fetch({
    url: '/config/config',
    method: 'post',
    data: data
  });
}

/*
* url: '/config/config'
* method: 'get'
* Request:
* Object
* data:{
*   graphId: graphId,
*   nodeId: nodeId
* }
*
* Response:
* Object
* {
*   data:{
*     config: configDetail,
*   },
*   msg:responseMsg,
*   stateCode:responseCode
* }
* */
export function getConfig(data){
  return fetch({
    url: '/config/config',
    method: 'get',
    params: data
  });
}

