import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useState} from "react";

const PushForm = (props) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [link, setLink] = useState("");

    const pushHandler = (e) => {
        e.preventDefault();


        fetch('/api/push', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                body: body,
                link: link
            }),
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': props.accessToken
            }
        }).catch(err => console.log(err))
    }

    return (
        <>
            <Form onSubmit={(event => pushHandler(event))}>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Body"
                        onChange={(e) => setBody(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Notification Onclick link"
                        onChange={(e) => setLink(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Push to all
                </Button>
            </Form>
        </>
    );
}

export default PushForm;
