import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import MainMenu from './mainmenu/mainmenu';
import Game from './game/game';

import './base.module.less';

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/game" component={Game} />
                    <Route path="/" component={MainMenu} />
                </Switch>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'))