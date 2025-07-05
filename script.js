
const container = getElement('main');
const score_span = getElement('score');
const time_left_span = getElement('time_left');
const last_score_span = getElement('last_score');

function events() {
    container.addEventListener('mousedown', e=> {
        if(e.target == container) {
            createParticle(e.x, e.y, true);
        }
    });
    window.addEventListener('keydown', e=> {
        if (e.key.toString().toLowerCase() == 'r' && time_left <= 0) {
            restart();
        }
    });
    last_score_span.addEventListener('click', ()=> {
        audio(CLICK_SOUND).play();
    });
    restart();
}
function restart() {
    time_left = FULL_TIME;
    current_points = 0;
    score_span.textContent = current_points;
    time_left_span.textContent = FULL_TIME;
    last_score_span.style.display = 'none';
    last_score_span.removeEventListener('click', restart);
    create_blocks();
    handle_time();
}

async function draw() {
    for(let i = 0; i < clicks.length; i++) {
        let current_click = clicks[i];
        for(current of current_click) {
            if(current.particle.time <= 0) {
                clicks[i].forEach(set => {
                    container.removeChild(set.particle.self);
                });
                
                clicks.splice(i, 1);
                i--;
                break;
            }
            let angle = current.angle;
            let multiplier = current.multiplier;
            current.particle.update_pos(multiplier * Math.cos(angle * Math.PI / 180), multiplier * Math.sin(angle * Math.PI / 180));
            current.particle.time--;
            //console.log(current.particle.time, angle);
        }
    }
    await sleep(SLEEP_TIME);
    draw();
}

let current_blocks = [];
create_blocks();
function create_blocks(stop) {
    while(current_blocks.length > 0) {
        container.removeChild(current_blocks.pop().self);
    }
    if(stop) return;
    for(let i = 0; i < BLOCK_AMOUNT; i++) {
        current_blocks.push(new Block());
    }
}

async function handle_time() {
    let sound = audio(CLOCK_TICK_SOUND);
    if(time_left <= 3) {
        sound.play();
    }
    await sleep(1000);
    sound.pause();
    time_left_span.textContent = time_left-- - 1;
    if(time_left > 20) {
        time_left_span.style.color = GREEN;
    } else if(time_left > 12) {
        time_left_span.style.color = YELLOW;
    } else if(time_left > 5) {
        time_left_span.style.color = ORANGE;
    } else if(time_left > 0) {
        time_left_span.style.color = RED;
    } else {
        create_blocks(true);
        handle_last_score();
        return;
    }
    handle_time();
}

function handle_points() {
    score_span.textContent = 1 + current_points++;
}
async function handle_last_score() {
    last_score_span.style.display = 'block';
    last_score_span.textContent = '';
    let p = current_points.toString();
    let sound_audio = audio(TYPING_SOUND);
    sound_audio.volume = 0.7;
    sound_audio.play();
    for(let i = 0;i < p.length; i++) {
        await sleep(200);
        last_score_span.textContent+= p[i];
    }
    sound_audio.pause();
    last_score_span.addEventListener('click', restart);
}

async function draw_aim() {
    let current_block = current_blocks[0];
    let previous_number = current_block.number;
    await sleep(aim_sleep);
    if(current_block && current_block.number == previous_number) {
        //current_block.renew_self();
        create_blocks();
    }
    draw_aim();
}

events();
draw();
//draw_aim();