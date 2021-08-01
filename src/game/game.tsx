import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';

import styles from './game.module.less';

interface GameState {
    size: number,
    snake: number[],
    apple: number,
    dir: number[],
    loop_id: number
}

export default class Game extends React.Component<RouteComponentProps, GameState> {
    constructor(props:RouteComponentProps) {
        super(props);

        // Parse query parameters
        let query_parameters:any = {};
        
        let params = window.location.search.substring(1).split('&');

        for (let i=0; i<params.length; i++) {
            let param = params[i].split('=');
            
            query_parameters[unescape(param[0])] = param[1];
        }

        // Validate game size parameter
        let size_t = parseInt(query_parameters['size'])

        if (isNaN(size_t) || size_t < 5 || size_t > 100) {
            this.props.history.push('/');
        }

        this.state = {
            size: size_t,
            snake: [Math.floor(size_t / 2) * size_t + Math.floor(size_t / 2) - 1 + (size_t % 2)],
            apple: (Math.floor(size_t / 2) - 1) * size_t + Math.floor(size_t / 2) - 1 + (size_t % 2),
            dir: [0, 1],
            loop_id: 0
        };

        this.loop = this.loop.bind(this);
        this.handleKeys = this.handleKeys.bind(this);
        this.getNewApplePos = this.getNewApplePos.bind(this);
        this.posToCords = this.posToCords.bind(this);
        this.cordsToPos = this.cordsToPos.bind(this);
    }

    componentDidMount() {
        this.setState({
            loop_id: window.setTimeout(this.loop, 300)
        });

        document.addEventListener('keydown', this.handleKeys);
    }

    posToCords(pos: number): number[] {
        return [
            pos % this.state.size,
            Math.floor(pos / this.state.size)
        ]
    }

    cordsToPos(x: number, y: number): number {
        return y * this.state.size + x;
    }

    getNewApplePos() {
        let t = Math.floor(Math.random() * (this.state.size**2 - this.state.snake.length))
        let i = 0;

        while (i < this.state.size**2 && t > 0) {
            i++;
            if (!this.state.snake.includes(i)) t--;
        }

        return i;
    }

    loop() {
        // Get current head position and direction
        const [x, y] = this.posToCords(this.state.snake[this.state.snake.length - 1]);
        const [dir_x, dir_y] = this.state.dir;

        let new_snake = [...this.state.snake];

        // Move head
        let new_head = this.cordsToPos(
            (x + dir_x + this.state.size) % this.state.size, 
            (y + dir_y + this.state.size) % this.state.size
        );
        new_snake.push(new_head);

        // Check we're not eating a new apple, delete a tail
        if (new_snake[new_snake.length - 1] != this.state.apple) {
            new_snake = new_snake.slice(1);
        } else {
            this.setState({
                apple: this.getNewApplePos()
            });
        }

        this.setState({
            loop_id: window.setTimeout(this.loop, 300),
            snake: new_snake
        });
    }

    handleKeys(e: KeyboardEvent) {
        switch (e.key) {
            case 'ArrowUp':
                this.setState({
                    dir: [0, -1]
                });
                break;
            case 'ArrowDown':
                this.setState({
                    dir: [0, 1]
                });
                break;
            case 'ArrowLeft':
                this.setState({
                    dir: [-1, 0]
                });
                break;
            case 'ArrowRight':
                this.setState({
                    dir: [1, 0]
                });
                break;
        }

        window.clearTimeout(this.state.loop_id);
        this.loop();
    }

    render() {
        let blocks = [];

        for (let i=0; i<this.state.size; i++) {
            let row = [];

            for (let j=0; j<this.state.size; j++) {
                let pos = i*this.state.size+j

                row.push(
                    <div 
                        key={pos} 
                        className={
                            styles.block + 
                            (this.state.snake.includes(pos) ? ` ${styles.snake}` : '') + 
                            (this.state.snake[this.state.snake.length - 1] == pos ? ` ${styles['snake-head']}` : '') +
                            (this.state.apple == pos ? ` ${styles.apple}` : '')
                        }  
                    />
                )
            }

            blocks.push(<div key={i} className={styles['blocks-row']}>{row}</div>)
        }

        return (
            <div className={styles.game}>
                <h1>Game of size {this.state.size}</h1>
                <h2>Score: {this.state.snake.length}</h2>
                <div className={styles.blocks}>
                    {blocks}
                </div>
            </div>
        )
    }
}