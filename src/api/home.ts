import { LocationQueryValue } from 'vue-router';
import request from '@/utils/request';


export function getData() {
  return request({
    url: '/api/SysStatus/Get',
    method: 'GET',
  });
}
export function SetRafflePrize(data: object) {
  return request({
    url: '/api/SetData/SetRafflePrize',
    method: 'POST',
    data
  });
}
export function SysStatusStart() {
  return request({
    url: '/api/SysStatus/Start',
    method: 'POST',
  });
}
export function StartRoll(params: any) {
  return request({
    url: '/api/SysStatus/StartRoll',
    method: 'POST',
    params
  });
}
export function UploadEmployees(file: any) {
  return request({
    url: '/api/SetData/UploadEmployees',
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      file
    }
  });
}
