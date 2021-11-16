import push from "web-push";

/*
    FILE DESCRIPTION: function for sending to all subscriptions
 */

//TODO: Check whether subscriber is still subscribed

const sendNotificationToAll = (subscribersSQLformat, title, body, link) => {
    if (!link.includes("https://") && !link.includes("http://")) link = "https://" + link;
    let options = {
        title: title,
        body: body,
        url: link
    }

    /**
     * Changing subscribers from sql format to web-push compatible format
     */

    let subscribers = [];
    for (let i = 0; i < subscribersSQLformat.length; i++) {
        const subscriber = {
            endpoint: subscribersSQLformat[i].endpoint,
            expirationTime: null,
            keys: {
                p256dh: subscribersSQLformat[i].p256dhkey,
                auth: subscribersSQLformat[i].authkey
            }
        }
        subscribers.push(subscriber)
    }

    /**
     * Pushing to all users from mysql db using web-push library
     */

    for (let i = 0; i < subscribers.length; i++) {
        push.sendNotification(subscribers[i], JSON.stringify(options));
    }
}

export default sendNotificationToAll;