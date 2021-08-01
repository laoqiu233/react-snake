import * as React from 'react';
import {Link} from 'react-router-dom';

interface MainMenuState {
    game_size: number
}

export default class MainMenu extends React.Component<{}, MainMenuState> {
    constructor(props:{}) {
        super(props);
        this.state = {game_size: 15};
    }

    render() {
        return (
            <div>
                <h1>React Snake!</h1>
                <label htmlFor="size-selection">Game size: {this.state.game_size}</label>
                <br/>
                <input 
                    id="size-selection"
                    type="range"
                    min="5"
                    max="30"
                    value={this.state.game_size} 
                    onChange={(e) => this.setState({game_size: parseInt(e.target.value)})} 
                />
                <br/>
                <Link to={`/game?size=${this.state.game_size}`}>Start</Link>
            </div>
        )
    }
}