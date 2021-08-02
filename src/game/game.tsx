import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import styles from './game.module.less';

interface BlockProps {
    pos: number,
    block_type: '' | 'apple' | 'snake' | 'snake-head'
}

interface BlockState {
    anim_timeout: number
}

class Block extends React.Component<BlockProps, BlockState> {
    constructor(props: BlockProps) {
        super(props);

        this.state = {
            anim_timeout: -1
        };
    }

    componentDidUpdate(prevProps: BlockProps) {
        if (prevProps.block_type !== this.props.block_type && ['snake-head', 'apple'].includes(this.props.block_type)) {
            window.clearTimeout(this.state.anim_timeout);

            this.setState({
                anim_timeout: window.setTimeout(() => {
                    this.setState({anim_timeout: -1});
                }, 150)
            });
        }
    }

    render() {
        return (
            <div
                style={{
                    boxShadow: (this.state.anim_timeout >= 0 ? '0 0 0 1px' : '0 0 0 0')
                }}
                className={
                    styles.block +
                    (this.props.block_type !== '' ? ` ${styles[this.props.block_type]}` : '')
                }
            />
        )
    }
}

interface GameState {
    size: number,
    snake: number[],
    apple: number,
    dir: number[],
    loop_id: number,
    game_over: boolean
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
            loop_id: 0,
            game_over: false
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

        // Check for collision
        if (new_snake.slice(0, -1).includes(new_snake[new_snake.length - 1])) {
            this.setState({
                game_over: true
            });

            document.removeEventListener('keydown', this.handleKeys);

            return;
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

                let block_type:'' | 'apple' | 'snake' | 'snake-head' = '';

                if (this.state.apple == pos) block_type = 'apple';
                else if (this.state.snake[this.state.snake.length - 1] == pos) block_type = 'snake-head';
                else if (this.state.snake.includes(pos)) block_type = 'snake';

                row.push(
                    <Block 
                        key={pos}
                        pos={pos}
                        block_type={block_type}
                    />
                )
            }

            blocks.push(<div key={i} className={styles['blocks-row']}>{row}</div>)
        }

        const transitionStyles = {
            entering: {
                opacity: 1,
                top: '0'
            },
            entered: {
                opacity: 1,
                top: '0'
            },
            exiting: {
                opacity: 0,
                top: '30px'
            },
            exited: {
                opacity: 0,
                top: '30px'
            },
            unmounted: {
                opacity: 0,
                top: '30px'
            }
        }

        return (
            <div className={styles.game}>
                <h1>Game of size {this.state.size}</h1>
                <h2>Score: {this.state.snake.length}</h2>
                <div className={styles.blocks}>
                    {blocks}
                </div>
                <Transition 
                    in={this.state.game_over}
                    timeout={300}
                >
                    {
                        (state) => (
                            <div
                                style={{
                                    position: 'relative',
                                    marginTop: '10px',
                                    transition: 'all 500ms ease-out',
                                    textAlign: 'center',
                                    ...transitionStyles[state]
                                }}
                            >
                                <h2>Game over!</h2>
                                <p>pashol nahuj</p>
                            </div>
                        )
                    }
                </Transition>
            </div>
        )
    }
}