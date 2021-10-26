import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import {login} from "../services/auth";
import PushForm from "./Push";

const LoginMask = () => {
    const [user, setUser] = useState("");
    const [pw, setPw] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState("");

    const loginHandler = async (e) => {
        e.preventDefault();
        await login(user, pw).catch(error => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            console.log(resMessage);
        });
        const item = JSON.parse(localStorage.getItem('user'));
        console.log(item)
        if (item.accessToken) {
            setLoggedIn(true);
            setAccessToken(item.accessToken)
        }
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
