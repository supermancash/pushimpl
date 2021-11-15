import push from "web-push";

const sendNotificationToAll = (subscribersSQLformat, title, body, link) => {
    if (!link.includes("https://") && !link.includes("http://")) link = "https://" + link;
    let options = {
        title: title,
        body: body,
        url: link
    }
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

    for (let i = 0; i < subscribers.length; i++) {
        push.sendNotification(subscribers[i], JSON.stringify(options));
    }
}

export default sendNotificationToAll;