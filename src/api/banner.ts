import request from '@/utils/request';

export function getCategoryPhotos(){
  return request.get('/banner/photos')
}