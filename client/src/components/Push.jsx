import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import {useEffect, useState} from "react";

const PushForm = (props) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [link, setLink] = useState("");
    const [showingLastPushes, setShowingLastPushes] = useState(false);
    const [pushesBtn, setPushesbtn] = useState("Show recent pushes");
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const getPushes = () => {
            fetch('api/push/logs', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': props.accessToken
                }
            }).then(res => res.json().then(data => {
                let cardsArray = [];
                for (let i = 0; i < data.length; i++) {
                    cardsArray.unshift(
                        <Col>
                            <Card bg="light">
                                <Card.Body>
                                    <Card.Title>{data[i].timestamp}</Card.Title>
                                    <Card.Text>Notification Title: {data[i].msgTitle}</Card.Text>
                                    <Card.Text>Notification Body: {data[i].msgBody}</Card.Text>
                                    <Card.Text>Notification onClick link: {data[i].msgOnClick}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                }
                setCards(cardsArray);
            }))
                .catch(err => console.log(err));
        }
        getPushes();
    });


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
        }).catch(err => console.log(err));
    }

    const toggleShowing = () => {
        setShowingLastPushes(!showingLastPushes);
        showingLastPushes ? setPushesbtn("Show recent pushes") : setPushesbtn("Back to push form");
    }

    return (
        <>
            <Stack>
                <Button variant="secondary" onClick={toggleShowing}>{pushesBtn}</Button>
            </Stack>
            <br/>
            {showingLastPushes ?
                <Row xs={1} md={3} className="g-4">
                    {cards}
                </Row>
                :
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
            }
        </>
    );
}

export default PushForm;
