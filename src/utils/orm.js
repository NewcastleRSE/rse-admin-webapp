import axios from 'axios'
import * as qs from 'qs'
import { useAuthStore } from '@/stores/auth'

/**
 * 
 * @param {string} object the name of the object type
 * @param {number} page the starting page number
 * @param {number} pageSize the page size
 * @param {Array.<string>} populate an array of properties for Strapi to populate
 * @returns 
 */
export const fetchObjects = async function (object, page, pageSize, populate) {

    let objects = []
    const store = useAuthStore()
    
    const recursiveFetch = async function (object, page, pageSize, populate) {

        const query = qs.stringify({
            pagination: {
              page: page,
              pageSize: pageSize,
            },
            populate: populate
          },{
            encodeValuesOnly: true,
          });

        let response = await axios.get(`${import.meta.env.VITE_API_URL}/${object}?${query}`, {
          headers: {
            Authorization: `Bearer ${store.jwt}`,
          }
        })
        
        objects = objects.concat(response.data.data)
        const pagination = response.data.meta.pagination

        if(pagination && pagination.page < pagination.pageCount) {
          return await recursiveFetch(object, pagination.page + 1, pageSize, populate)
        }
        else {
          objects.forEach((object, index) => {
            const keys = Object.keys(object)
            keys.forEach(key => {
              try {
                if(object[key] !== null && typeof object[key] === 'object' && 'data' in object[key]) {
                  objects[index][key] = object[key].data
                }
            }
            catch(err) {
              console.log(keys)
              console.error(err)
            }
            })
          })
          return objects
        }
    }

    return await recursiveFetch(object, 0, 100, populate)
}

/**
 * 
 * @param {string} object the name of the object type
 * @param {number} id the unique id of the object
 * @param {Array.<string>} populate an array of properties for Strapi to populate
 * @returns 
 */
export const fetchObject = async function (object, id, populate) {

  const store = useAuthStore()

  const query = qs.stringify({
    populate: populate
  },{
    encodeValuesOnly: true,
  });

  let response = await axios.get(`${import.meta.env.VITE_API_URL}/${object}/${id}?${query}`, {
    headers: {
      Authorization: `Bearer ${store.jwt}`,
    }
  })

  return response.data.data
}