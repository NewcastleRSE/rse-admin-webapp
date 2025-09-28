import axios from 'axios'
import * as qs from 'qs'
import { useUserStore } from '@/stores/user'

/**
 * 
 * @param {string} object the name of the object type
 * @param {number} page the starting page number
 * @param {number} pageSize the page size
 * @param {Array.<string>} populate an array of properties for Strapi to populate
 * @returns 
 */
export const fetchObjects = async function (object, page, pageSize, populate, filters) {

    let objects = []
    const store = useUserStore()
    
    const recursiveFetch = async function (object, page, pageSize, populate, filters) {

        const queryObject = {
          pagination: {
            page: page,
            pageSize: pageSize,
          }
        }

        if(populate) { queryObject.populate = populate}
        if(filters) { queryObject.filters = filters }

        const query = qs.stringify(queryObject, { encodeValuesOnly: true });

        try {

          let response = await axios.get(`${import.meta.env.VITE_API_URL}/${object}?${query}`, {
            headers: {
              Authorization: `Bearer ${store.jwt}`,
            }
          })
          
          objects = objects.concat(response.data.data)
          const pagination = response.data.meta.pagination
          

          if(pagination && pagination.page < pagination.pageCount) {
            return await recursiveFetch(object, pagination.page + 1, pageSize, populate, filters)
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
        catch(err) {
          console.error(err)
          //console.error(object, query)
        }
    }

    return await recursiveFetch(object, page, pageSize, populate, filters)
}

/**
 * 
 * @param {string} object the name of the object type
 * @param {number} documentId the unique document ID of the object
 * @param {Array.<string>} populate an array of properties for Strapi to populate
 * @returns 
 */
export const fetchObject = async function (object, documentId, populate, filters) {

  const store = useUserStore()

  const queryObject = {}

  if(populate) { queryObject.populate = populate}
  if(filters) { queryObject.filters = filters }

  const query = qs.stringify(queryObject, { encodeValuesOnly: true });

  let response = await axios.get(`${import.meta.env.VITE_API_URL}/${object}/${documentId}?${query}`, {
    headers: {
      Authorization: `Bearer ${store.jwt}`,
    }
  })

  return response.data
}

/**
 * 
 * @param {string} object the name of the object type
 * @param {number} documentId the unique document ID of the object
 * @param {object} payload an object containing the properties to update
 * @returns 
 */
export const updateObject = async function (object, documentId, payload) {

  const store = useUserStore()

  let response = await axios.put(`${import.meta.env.VITE_API_URL}/${object}/${documentId}`, 
    { 
      data: payload
    },
    {
      headers: {
        Authorization: `Bearer ${store.jwt}`,
      }
    }
  )

  return response.data.data
}

export const uploadTransactions = async function (formData) {

  const store = useUserStore()

  return axios.post(`${import.meta.env.VITE_API_URL}/transactions/upload`, formData,
    {
      headers: {
        Authorization: `Bearer ${store.jwt}`
      }
    }
  )
}