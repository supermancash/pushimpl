import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

import {useState} from "react";
import date from "date-and-time";


const PushForm = (props) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [link, setLink] = useState("");
    const [showingLastPushes, setShowingLastPushes] = useState(false);
    const [pushesBtn, setPushesbtn] = useState("Show notification logs");
    const [cards, setCards] = useState([]);

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
                const sqldate = new Date(data[i].timestamp)
                const timestamp = date.format(sqldate, 'ddd DD MMM YYYY (HH:mm)')
                console.log(data[i].timestamp)

                cardsArray.unshift(
                    <>
                        <Col>
                            <Card bg="light">
                                <Card.Body>
                                    <Card.Title>{timestamp.toString()}</Card.Title>
                                    <Card.Text>Notification Title: <b>{data[i].msgTitle}</b></Card.Text>
                                    <Card.Text>Notification Body: {data[i].msgBody}</Card.Text>
                                    <Card.Text>Notification onClick link: <a
                                        href={data[i].msgOnClick}>{data[i].msgOnClick}</a></Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </>
                );
            }
            setCards(cardsArray);
        }))
            .catch(err => console.log(err));
    }


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
        showingLastPushes ? setPushesbtn("Show notification logs") : setPushesbtn("Back to push centre");
        getPushes();
    }

    return (
        <>
            <Stack>
                <Button variant="secondary" onClick={toggleShowing}>{pushesBtn}</Button>
            </Stack>
            <Container>
                <br/>
                {showingLastPushes ?
                    <>
                        <h3>Push log</h3><br/>
                        <Row xs={1} md={3} className="g-4">
                            {cards}
                        </Row>
                    </>
                    :
                    <>
                        <h3>Push centre</h3><br/>
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
                            <Stack>
                                <Button className="ms-auto" variant="primary" type="submit">
                                    Push to all
                                </Button>
                            </Stack>
                        </Form>
                    </>
                }
            </Container>
        </>
    );
}

export default PushForm;
