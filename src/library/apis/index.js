var axios = require('axios')
var config = require('../../config/config')
var NOTIFY_CONSTANTS = require('../utils/notification-const')

var instance = axios.create({
    baseURL: config.ONE_SIGNAL_BASE_API,
    timeout: config.SERVER_TIMEOUT,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${config.ONE_SIGNAL_REST_API_KEY}`
      }
})

exports.pushNotifcation = (user_id, title, contents, subData) => {
    let notificationData = {
        app_id: config.ONE_SIGNAL_APP_ID,
        headings: { "en": `${title}` },
        contents: { "en": `${contents}` },
        included_segments: ["Active Users"],
        filters: [
            { "field": "tag", "key": "user_id", "relation": "=", "value": `${user_id}` },
        ],
        data: subData,
    }

    return instance.post('', notificationData)
    .then(res => {
        return res.data
    })
    .catch(err => {
        return err
    })
}

// function fetch(url, data, isAuth) {
//     let headers = null
//     if (isAuth) {
//         headers = {
//             Authorization: constants.PREFIX_TOKEN + Database.getUserToken()
//         }
//     }
//     return instance.get(url, {
//         params: {
//             ...data
//         },
//         headers: headers
//     }).then(response => {
//         return response.data
//     }).catch(error => {
//         return error;
//     })
// }

// function post(url, data, isAuth) {
//     let headers = null
//     if (isAuth) {
//         headers = {
//             Authorization: constants.PREFIX_TOKEN + Database.getUserToken()
//         }
//     }
//     return instance.post(url, data, {
//         headers
//     }).then(response => {
//         return response.data
//     }).catch(error => {
//         return error;
//     })
// }