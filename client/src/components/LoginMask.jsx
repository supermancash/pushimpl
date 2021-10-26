import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import PushForm from "./Push";

const LoginMask = () => {
    const [user, setUser] = useState("");
    const [pw, setPw] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState("");

    const loginHandler = async (e) => {
        e.preventDefault();
        fetch('/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({
                user: user,
                password: pw
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                if (data.accessToken) {
                    setLoggedIn(true);
                    setAccessToken(data.accessToken)
                }
            });
    }

    return (
        <>
            {loggedIn ?
                <PushForm accessToken={accessToken}/>
                :
                <Form onSubmit={(event => loginHandler(event))}>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            onChange={(e) => setUser(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPw(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Form>
            }
        </>
    );
};

export default LoginMask;
