import axios from 'axios';
const camelcaseKeys = require('camelcase-keys');

export default function interceptors() {
    axios.interceptors.response.use(function (response) {
        // Ignore any auth routes
        if(!response.config.url.includes('https://rseadmin.azurewebsites.net/api/auth/')){

            // If data is array modify every object
            if(Array.isArray(response.data.data) && response.data.data.length > 0 && Object.prototype.hasOwnProperty.call(response.data.data[0], 'attributes')) {
                let data = []
    
                response.data.data.forEach(element => {
                    let entity = element.attributes;
                    entity.id = element.id
                    data.push(camelcaseKeys(entity))
                });
    
                response.data.data = data       
            }
            // If data is object modify instance
            else if (Object.prototype.hasOwnProperty.call(response.data.data, 'attributes')) {
                let data = {}
    
                response.data.data.forEach(element => {
                    let entity = element.attributes;
                    entity.id = element.id
                    data.push(camelcaseKeys(entity))
                });
    
                response.data.data = data 
            }
        }

        return response;
    }, function (error) {
        // Do something with response error
        return Promise.reject(error);
    });
}