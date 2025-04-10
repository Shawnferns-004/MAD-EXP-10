import admin from '../utils/firebase.js'

class NotificationService {
    static async sendNotification(deviceToken, title, body){
        const message = {
            notification:{
                title, body
            },
            token: deviceToken
        }
        try {
           const response = await admin.messaging().send(message)
           return response
        } catch (error) {
            throw error
        }
    }
}

export default NotificationService