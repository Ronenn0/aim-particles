
let clicks = [];

const SIZE = 1;
const PARTICLES_AMOUNT = 360;
const SLEEP_TIME = 5;
const PARTICLE_TICK = 30;

let aim_sleep = 1000;
let current_points;
let time_left;
const TAKE_TIME = 2;
const BLOCK_SIZE = 100;
const BLOCK_AMOUNT = 3;
const GOAL_POINTS = 100;
const FULL_TIME = 30;

let number = 0;

const RED = 'var(--red)';
const GREEN = 'var(--green)';
const YELLOW = 'var(--yellow)';
const ORANGE = 'var(--orange)';

const TYPING_SOUND = 'typing.mp3';
const POP_SOUND = 'pop.wav';
const CLICK_SOUND = 'click.mp3';
const CLOCK_TICK_SOUND = 'clock_tick.mp3';


function getElement(id) {
    return document.getElementById(id);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function audio(name) {
    return new Audio(name);
}
function play_audio(audio) {
    audio.play();
}
function stop_audio(audio) {
    audio.pause();
}

function random(min_, max_) {
    let min, max;
    if(max_) {
        min = min_;
        max = max_;
    } else {
        min = 0;
        max = min_;
    }
    return Math.floor(Math.random() * (max - min) + min);
}
function random_color() {
    return `rgb(${random(100, 255)}, ${random(100, 255)}, ${random(100, 255)})`;
}

function createParticle(x, y, missed) {
    let particles = [];
    for(let i = 0; i <= PARTICLES_AMOUNT; i+=40) {
        particles.push({
            particle: new Particle(x, y, missed),
            angle: i,
            multiplier: i % 40 == 0? 1.5 : 3.2
        });
    }
    clicks.push(particles);
}

class Particle {

    constructor(x, y, missed) {
        this.x = x;
        this.y = y;
        this.time = PARTICLE_TICK;
        this.self = undefined;
        this.missed = missed;
        this.create_self();
    }
    update_pos(x_plus = 0, y_plus = 0) {
        //console.log(x_plus, y_plus);
        this.x+= x_plus;
        this.y+= y_plus;
        this.self.style.left = (this.x) + 'px';
        this.self.style.top = (this.y) + 'px';
    }
    create_self() {
        let div = document.createElement('div');
        div.className = 'particle';
        div.style.backgroundColor = this.missed? RED : random_color();
        this.self = div;
        this.update_pos();
        container.appendChild(this.self);
    }
}

class Block {
    constructor() {
        this.self = this.create_self();
        this.number = number++;
    }
    create_self() {
        this.x = random(window.innerWidth - BLOCK_SIZE);
        this.y = random(window.innerHeight - BLOCK_SIZE);
        this.size = BLOCK_SIZE;
        let block = document.createElement('div');
        block.className = 'block';
        block.style.width = `${this.size}px`;
        block.style.height = `${this.size}px`;
        block.style.left = `${this.x}px`;
        block.style.top = `${this.y}px`;
        block.style.backgroundImage = `linear-gradient(${random_color()}, ${random_color()})`;
        block.addEventListener('mousedown', async(e)=> {
            let sound = audio(POP_SOUND);
            sound.volume = 0.3;
            sound.play();
            createParticle(e.x, e.y, false);
            this.renew_self();
            handle_points();
        });
        container.appendChild(block);
        return block;
    }
    renew_self() {
        container.removeChild(this.self);
        this.self = this.create_self();
        aim_sleep-= TAKE_TIME;
    }
}