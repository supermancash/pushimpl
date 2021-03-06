import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import path from 'path';

const Subscribe = () => {
    const [permission, setPermission] = useState(false);
    const [sw, setSw] = useState({});

    useEffect(() => {
        registersw().then(() => {
            checkPermission().catch(err => console.log(err))
        })
    });

    const checkPermission = async () => {
        await setSw(await navigator.serviceWorker.ready);
        let subscription = null;
        console.log(sw)
        if (sw !== {}) subscription = await sw.pushManager.getSubscription();
        subscription === null ? setPermission(false) : setPermission(true);
    }

    const registersw = async () => {
        setSw(await navigator.serviceWorker.register(path.resolve('sw.js')));
    }


    const subscribeHandler = async () => {
        if ('PushManager' in window) {
            setSw(await navigator.serviceWorker.ready);
            const push = await sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'BLu-niPp_sPIzQyEYCyv-nncF824MjY0UPMaGXwm-8PH1FnAiOoQePUshBFogdIA7YYaxnjg8bd2JG8iTJwTSwI'
            });
            checkPermission().catch(err => console.log(err));
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
            setPermission(true);
        }
    }


    return (
        <div>
            {permission ? <p>You are subscribed!</p> :
                <Button variant="primary" onClick={subscribeHandler}>Subscribe</Button>}
        </div>
    );
}

export default Subscribe;
