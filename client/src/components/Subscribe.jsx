import Button from "react-bootstrap/Button";
import {useState} from "react";

const Subscribe = () => {
    const [permission, setPermission] = useState(false);
    const [sw, setSw] = useState({});


    const registersw = async () => {
        await setSw(await navigator.serviceWorker.register('sw.js'));
        if(sw==={}) registersw().catch(err => console.log(err));
        console.log(sw);
    }
    registersw().catch(err => console.log(err));
    const checkPermission = async () => {
        await setSw(await navigator.serviceWorker.ready);
        const subscription = await sw.pushManager.getSubscription();
        subscription === null ? setPermission(false) : setPermission(true);
    }
    checkPermission().catch(err => console.log(err));


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
            {permission ? <p>You are subscribed!</p> :
                <Button variant="primary" onClick={subscribeHandler}>Subscribe</Button>}
        </div>
    );
}

export default Subscribe;
