import fetch from '../interceptors'

/*
* url: '/graph/graph'
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
export function loadGraph(data) {
  return fetch({
    url: '/graph/graph',
    method: 'get',
    params: data
  });
}


/*
* url: '/graph/graph'
* method: 'post'
* Request:
* Object
* data:{
*   id: graphId,
*   gData: graphData
* }
*
* Response:
* Object
* {
*   data:null,
*   msg:responseMsg,
*   stateCode:responseCode
* }
*
* */
export function saveGraph(data) {
  return fetch({
    url: '/graph/graph',
    method: 'post',
    data: data
  });
}


/*
* url: '/graph/nodestatus'
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
*   data:[{'node_id': node_id,'node_status': node_status}..],
*   msg:responseMsg,
*   stateCode:responseCode
* }
*
* */

export function getNodesStatus(data) {
  return fetch({
    url: '/graph/nodestatus',
    method: 'get',
    params: data
  });
}

export function deleteNode(data) {
  return fetch({
    url: '/graph/node',
    method: 'delete',
    data: data
  });
}


export function getNodeOutputInfo(data) {
  return fetch({
    url: '/graph/nodeout',
    method: 'get',
    params: data
  });
}

export function downloadNodeOutput(data) {
  return fetch({
    url: '/graph/nodeoutdownload',
    method: 'get',
    params: data
  });
}
