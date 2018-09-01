// Libraries
import $ from "jquery";

// My code
import Board from "./Board";
import Key from "./keyboard";
import "./arrayAugment";
import rules from "./rules";

/* Game setup */
const keys = (global.keys = {
    w: Key(87, 38),
    a: Key(65, 37),
    s: Key(83, 40),
    d: Key(68, 39),
    space: Key(32)
});

let board;
function start(dontBegin) {
    const s = () => {
        board = window.board = new Board(25, 25, rules); // Window for debugging
        board.getCell(1, 1).setState(0);
        board.getCell(1, 23).setState(9);
        board.getCell(23, 1).setState(9);
        board.getCell(23, 23).setState(9);
        setScore(0);
        setMultiplier(1);
        setTimeout(() => {
            board.getCell(1, 1).setState(1);
            if (!dontBegin) {
                board.start();
                pauseMusic(false);
            }
        });
        setMusicEnabled(musicEnabled);
        $("body .app-board-container").append(board.element);
    };
    if (board) {
        board.stop();
        board.element.find("div:not([state='9'])").attr("state", 0);
        setTimeout(() => {
            board.element.remove();
            s();
        }, 1000);
    } else {
        s();
    }
}
let deathTime = Date.now();
global.stop = function() {
    deathTime = Date.now();
    playSound(sounds.gameOver);
    setTimeout(() => {
        $(".app-dialogue").addClass("shown");
        $(".app-menu").addClass("restart");
    }, 1000);
    pauseMusic(true);
};

/* Start controls */
keys.space.press = () => {
    if ($(".app-dialogue").is(".shown")) {
        if (Date.now() - deathTime > 1000)
            $(".app-play-button").addClass("active");
    }
};
keys.space.release = () => {
    if ($(".app-dialogue").is(".shown"))
        $(".app-play-button.active")
            .removeClass("active")
            .click();
};
$(".app-play-button").click(() => {
    if ($(".app-dialogue").is(".shown")) {
        start();
        $(".app-dialogue").removeClass("shown");
    }
});

/* Audio controls */
// Sound fx
const song = $(".audio-song")[0];
const fxMultiplier = 0.5;
global.sounds = {
    blop: { sound: $(".audio-blop")[0], multiplier: 0.2 },
    hit: { sound: $(".audio-hit")[0], multiplier: 1 },
    hitSpread: { sound: $(".audio-hit-spread")[0], multiplier: 1 },
    pew: { sound: $(".audio-pew")[0], multiplier: 1 },
    gameOver: { sound: $(".audio-game-over")[0], multiplier: 1 }
};
global.playSound = function(soundData) {
    if (soundFxEnabled) {
        const sound = soundData.sound.cloneNode(true);
        sound.volume = volume * fxMultiplier * soundData.multiplier;
        sound.play();
    }
};
// Sound enable/disable
let musicEnabled = true;
let soundFxEnabled = true;
function setMusicEnabled(enabled) {
    musicEnabled = enabled;
    if (enabled) $(".app-music").removeClass("disabled");
    else $(".app-music").addClass("disabled");
    if (enabled) {
        song.play();
    } else {
        song.pause();
    }
}
function pauseMusic(pause) {
    if (pause) {
        $(song).animate({ volume: 0 }, 2000);
        song.currentTime = 0;
    } else $(song).animate({ volume: volume }, 2000);
}
$(".app-music").mousedown(e => {
    if (musicEnabled) setMusicEnabled(false);
    else setMusicEnabled(true);
    e.preventDefault();
});
function setSoundFxEnabled(enabled) {
    soundFxEnabled = enabled;
    if (enabled) $(".app-sound-fx").removeClass("disabled");
    else $(".app-sound-fx").addClass("disabled");
}
$(".app-sound-fx").mousedown(e => {
    if (soundFxEnabled) setSoundFxEnabled(false);
    else setSoundFxEnabled(true);
    e.preventDefault();
});
setMusicEnabled(musicEnabled);
setSoundFxEnabled(soundFxEnabled);
// volume
let adjustingVolume = false;
let volume = 0;
function setVolume(per) {
    per = Math.max(0, Math.min(per, 1));
    volume = per;
    volEl
        .children()
        .first()
        .width((per * 100 + "").substr(0, 4) + "%");
    song.volume = per;
}
const volEl = $(".app-volume").mousedown(e => {
    const offset = volEl.offset();
    const left = e.pageX - offset.left;
    setVolume(left / volEl.width());
    adjustingVolume = true;
    e.preventDefault();
});
$(window).mousemove(e => {
    if (adjustingVolume) {
        const offset = volEl.offset();
        const left = e.pageX - offset.left;
        setVolume(left / volEl.width());
        e.preventDefault();
    }
});
$(window).mouseup(() => {
    adjustingVolume = false;
});
setVolume(0.5);
song.volume = 0;

/* scoring */
let multiplier = 1;
let highscore = (localStorage && localStorage.getItem("highscore")) || 0;
let score = 0;
global.addScore = function(val) {
    setScore(score + val * multiplier);
};
function setScore(val) {
    score = val;
    $(".app-score-value").text(Math.floor(score));
    $(".app-final-score-value").text(Math.floor(score));
    if (score > highscore) {
        setHighScore(score);
    }
}
function setHighScore(score) {
    highscore = score;
    $(".app-highscore-value").text(Math.floor(highscore));
    if (localStorage) localStorage.setItem("highscore", Math.floor(highscore));
}
setHighScore(highscore);
global.setMultiplier = function(val) {
    multiplier = val;
    $(".app-score-multiplier-value").text(Math.floor(multiplier) + "X");
};

// Init the board
start(true);

// Show game
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        $(".app").css("display", "inline-block");
    });
} else {
    $(document).ready(() => {
        $(".app").css("display", "inline-block");
    });
}

// Disable animations for edge
if (!!window.StyleMedia) {
    $("head").append(`
        <style>
            .board-cell-inner{
                transition: none !important;
            }
        </style>
    `);
}

// Mouse controls
var prevPos = { x: null, y: null };
var move = function(event) {
    var newX = event.touches[0].pageX;
    var newY = event.touches[0].pageY;
    if (prevPos.x) {
        var deltaX = newX - prevPos.x;
        var deltaY = newY - prevPos.y;

        keys.w.isDown = false;
        keys.a.isDown = false;
        keys.s.isDown = false;
        keys.d.isDown = false;

        let dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (dist > 50) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) keys.d.isDown = true;
                else keys.a.isDown = true;
                prevPos.y += deltaY * 0.3;
            } else {
                if (deltaY > 0) keys.s.isDown = true;
                else keys.w.isDown = true;
                prevPos.x += deltaX * 0.3;
            }
        }
    } else {
        prevPos.x = newX;
        prevPos.y = newY;
    }
};
var moveEnd = function() {
    keys.w.isDown = false;
    keys.a.isDown = false;
    keys.s.isDown = false;
    keys.d.isDown = false;

    prevPos.x = null;
    prevPos.y = null;
};
$(window)
    .on("touchmove", move)
    .on("touchend", moveEnd);
