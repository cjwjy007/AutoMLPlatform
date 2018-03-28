import fetch from '../interceptors'


export function countDataSet() {
  return fetch({
    url: '/data/datasetcount',
    method: 'get'
  });
}

export function getDataSet(data) {
  return fetch({
    url: '/data/data',
    method: 'get',
    params: data
  });
}

export function getAllDataSet() {
  return fetch({
    url: '/data/alldata',
    method: 'get'
  });
}

export function deleteDataSet(data) {
  return fetch({
    url: '/data/data',
    method: 'delete',
    data: data
  });
}
