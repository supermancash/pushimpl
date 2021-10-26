import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect} from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom';

import LoginMask from "./components/LoginMask";
import Subscribe from "./components/Subscribe";

const App = () => {
    useEffect(() => {
        const registersw = async () => {
            const sw = await navigator.serviceWorker.register('./sw.js');
            console.log(sw);
        }
        registersw().catch(err => console.log(err));
    })

    return (
        <Router>
            <Route exact path="/" component={Subscribe}/>
            <Route path="/admin" component={LoginMask} />
        </Router>
);
}

export default App;
