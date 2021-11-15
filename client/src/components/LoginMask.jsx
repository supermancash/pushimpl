import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import {useState} from "react";

import PushForm from "./Push";

const LoginMask = () => {
    const [user, setUser] = useState("");
    const [pw, setPw] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [buttonVariant, setButtonVariant] = useState("primary");
    const [buttonText, setButtonText] = useState("Login");

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
                } if(!data.accessToken){
                    setButtonVariant("warning");
                    setButtonText("Wrong username or password, please try again");
                    setTimeout(() => {
                        setButtonVariant("primary");
                        setButtonText("Login");
                    }, 2000)
                }
            });
    }

    return (
        <>
            {loggedIn ?
                <PushForm accessToken={accessToken}/>
                :
                <Container>
                    <br/>
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
                        <Stack>
                            <Button className="ms-auto" variant={buttonVariant} type="submit">
                                {buttonText}
                            </Button>
                        </Stack>
                </Form>
                </Container>

            }
        </>
    );
};

export default LoginMask;
