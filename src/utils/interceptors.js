import axios from 'axios';

export default function interceptors() {
    axios.interceptors.response.use(function (response) {
        // Do something with response data

        if(Array.isArray(response.data.data) && Object.prototype.hasOwnProperty.call(response.data.data[0], 'attributes')) {
            let data = []

            response.data.data.forEach(element => {
                let entity = element.attributes;
                entity.id = element.id
                data.push(entity)
            });

            response.data.data = data       
        }
        else if (Object.prototype.hasOwnProperty.call(response.data.data, 'attributes')) {
            let data = {}

            response.data.data.forEach(element => {
                let entity = element.attributes;
                entity.id = element.id
                data.push(entity)
            });

            response.data.data = data 
        }

        return response;
    }, function (error) {
        // Do something with response error
        return Promise.reject(error);
    });
}