import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";

const Subscribe = () => {
    const [permission, setPermission] = useState(false);
    let sw;

    useEffect(() => {
        const checkPermission = async () => {
            sw = await navigator.serviceWorker.ready;
            const subscription = await sw.pushManager.getSubscription();
            subscription === null ? setPermission(false) : setPermission(true);
        }
        checkPermission().catch(err => console.log(err));
    });



    const subscribeHandler = async () => {
        if ('PushManager' in window) {
            const push = await sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'BLu-niPp_sPIzQyEYCyv-nncF824MjY0UPMaGXwm-8PH1FnAiOoQePUshBFogdIA7YYaxnjg8bd2JG8iTJwTSwI'
            });

            if (!permission) {
                await fetch("/api/subscribers", {
                    method: 'POST',
                    credentials: 'omit',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Request-Headers': '*'
                    },
                    body: JSON.stringify(push)
                }).catch((error) => {
                    console.error('Error:', error);
                });
            }
            setPermission(true)
        }
    }

    return (
        <div>
            {permission ? <p>You are subscribed!</p> : <Button variant="primary" onClick={subscribeHandler}>Subscribe</Button>}
        </div>
    );
}

export default Subscribe;
