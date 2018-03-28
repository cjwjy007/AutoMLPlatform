import fetch from '../interceptors'

/*
* url: '/project/projectcount',
* method: 'get'
* Request:
* Object
* data:{
* }
*
* Response:
* Object
* {
*   data:projectCount,
*   msg:responseMsg,
*   stateCode:responseCode
* }
*
* */
export function countProject() {
  return fetch({
    url: '/project/projectcount',
    method: 'get'
  });
}

export function getProject(data) {
  return fetch({
    url: '/project/project',
    method: 'get',
    params: data
  });
}

export function addProject(data) {
  return fetch({
    url: '/project/project',
    method: 'post',
    data: data
  });
}

export function deleteProject(data) {
  return fetch({
    url: '/project/project',
    method: 'delete',
    data: data
  });
}

export function getProjectStatus(data) {
  return fetch({
    url: '/project/projectstatus',
    method: 'get',
    params: data
  });
}
