import Axios from 'axios';
import foodimage from './assets/images/food.png'
import body from './assets/images/body.png'
import head from './assets/images/head.png'
import Phaser from "phaser";


//______________________________Variables__________________________________

const dev = false
const localHost = dev ? 'http://localhost:3001/' : '/'

let snake;
let food;
let cursors;
let Record;

let UP = 0;
let DOWN = 1;
let LEFT = 2;
let RIGHT = 3;


// Check for previous record
function getRecord() {
    Axios.post(`${localHost}apiroutes/getRecord`, {
        user_id: localStorage.getItem("userid"),
        game_id: localStorage.getItem("gameid"),
    }).then((response) => {
        if (response.data[0]) Record = response.data[0].record
        else Record = localStorage.getItem("snakerecord") ? localStorage.getItem("snakerecord") : 0
    })
}

class snakegame extends Phaser.Scene {

    constructor() {
        super('snakegame');
        getRecord()
    }

    //_______________________________Preload___________________________________

    preload() {
        this.load.image('food', foodimage);
        this.load.image('body', body);
        this.load.image('head', head);
    }

    //_______________________________Create___________________________________

    create() {

        this.scoreText = this.add.text(10, 10, "h", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '30px', color: 'white' });

        //Food object
        let Food = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Food(scene, x, y) {
                    Phaser.GameObjects.Image.call(this, scene)

                    this.setTexture('food');
                    this.setPosition(x * 16, y * 16);
                    this.setOrigin(0);

                    this.total = 0;

                    scene.children.add(this);
                },

            eat: function () {
                this.total++;
                
            }
            
        });
        
        //Snake object
        let Snake = new Phaser.Class({
            
            initialize:
            
            function Snake(scene, x, y) {
                this.headPosition = new Phaser.Geom.Point(x, y);
                
                this.body = scene.add.group();

                this.head = this.body.create(x * 16, y * 16, 'head').setScale(0.15).setDepth(1);
                    this.head.setOrigin(0);
                    
                    this.alive = true;
                    
                    this.speed = 100;
                    
                    this.moveTime = 0;
                    
                    this.tail = new Phaser.Geom.Point(x, y);
                    
                    this.heading = RIGHT;
                    this.direction = RIGHT;
                },
                
                update: function (time) {
                    if (time >= this.moveTime) {
                        return this.move(time);
                    }
                },
                
            faceLeft: function () {
                if (this.direction === UP || this.direction === DOWN) {
                    this.heading = LEFT;
                }
            },

            faceRight: function () {
                if (this.direction === UP || this.direction === DOWN) {
                    this.heading = RIGHT;
                }
            },

            faceUp: function () {
                if (this.direction === LEFT || this.direction === RIGHT) {
                    this.heading = UP;
                }
            },

            faceDown: function () {
                if (this.direction === LEFT || this.direction === RIGHT) {
                    this.heading = DOWN;
                }
            },

            move: function (time) {
                /**
                * Based on the heading property (which is the direction the pgroup pressed)
                * we update the headPosition value accordingly.
                * 
                * The Math.wrap call allow the snake to wrap around the screen, so when
                * it goes off any of the sides it re-appears on the other.
                */
                switch (this.heading) {
                    case LEFT:
                        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                        break;

                    case RIGHT:
                        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                        break;

                    case UP:
                        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                        break;

                    case DOWN:
                        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                        break;
                }

                this.direction = this.heading;

                //  Update the body segments and place the last coordinate into this.tail
                Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

                //  Check to see if any of the body pieces have the same x/y as the head
                //  If they do, the head ran into the body

                let hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

                if (hitBody) {
                    console.log('dead');

                    this.alive = false;

                    return false;
                }
                else {
                    //  Update the timer ready for the next movement
                    this.moveTime = time + this.speed;

                    return true;
                }
            },

            grow: function () {
                let newPart = this.body.create(this.tail.x, this.tail.y, 'body').setScale(0.15);

                newPart.setOrigin(0);
            },

            collideWithFood: function (food) {
                if (this.head.x === food.x && this.head.y === food.y) {
                    this.grow();

                    food.eat();

                    //  every 5 food (from 20), increase the snake speed
                    if (this.speed > 20 && food.total % 5 === 0) {
                        this.speed -= 5;
                    }

                    return true;
                }
                else {
                    return false;
                }
            },

            updateGrid: function (grid) {
                //  Remove all body pieces from valid positions list
                this.body.children.each(function (segment) {

                    let bx = segment.x / 16;
                    let by = segment.y / 16;

                    grid[by][bx] = false;

                });

                return grid;
            }

        });

        food = new Food(this, 25, 8).setScale(0.15);
        snake = new Snake(this, 8, 8);

        //  Create keyboard controls
        cursors = this.input.keyboard.createCursorKeys();
    }

    //_______________________________Update___________________________________

    update(time, delta) {
        this.scoreText.text = 'Score: ' + food.total + '\nRecord: ' + Record

        if (!snake.alive) {
            const record = food.total;
            localStorage.setItem("snakerecord", record)

            // POST/PUT record in database
            Axios.put(`${localHost}apiroutes/addRecord`, {
                record: record,
                user_id: localStorage.getItem("userid"),
                user_name: localStorage.getItem("username"),
                game_id: localStorage.getItem("gameid"),
                game_name: localStorage.getItem("gamename")
            }).then(() => {
                console.log("Insertion success");
            })

            this.scene.start('snakestart');
            return;
        }

        /**
        * Check which key is pressed, and then change the direction the snake
        * is heading based on that. The checks ensure you don't double-back
        * on yourself, for example if you're moving to the right and you press
        * the LEFT cursor, it ignores it, because the only valid directions you
        * can move in at that time is up and down.
        */
        if (cursors.left.isDown) {
            snake.faceLeft();
        }
        else if (cursors.right.isDown) {
            snake.faceRight();
        }
        else if (cursors.up.isDown) {
            snake.faceUp();
        }
        else if (cursors.down.isDown) {
            snake.faceDown();
        }

        if (snake.update(time)) {
            //  If the snake updated, we need to check for collision against food
            if (snake.collideWithFood(food)) {
                repositionFood();
            }
        }
    }
}

function repositionFood() {
    //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    let testGrid = [];

    for (let y = 0; y < 30; y++) {
        testGrid[y] = [];

        for (let x = 0; x < 40; x++) {
            testGrid[y][x] = true;
        }
    }

    snake.updateGrid(testGrid);

    //  Purge out false positions
    let validLocations = [];

    for (let y = 0; y < 30; y++) {
        for (let x = 0; x < 40; x++) {
            if (testGrid[y][x] === true) {
                //  Is this position valid for food? If so, add it here ...
                validLocations.push({ x: x, y: y });
            }
        }
    }

    if (validLocations.length > 0) {
        //  Use the RNG to pick a random food position
        let pos = Phaser.Math.RND.pick(validLocations);

        //  And place it
        food.setPosition(pos.x * 16, pos.y * 16);

        return true;
    }
    else {
        return false;
    }
}

export default snakegame;