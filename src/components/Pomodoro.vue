<template>
    <div class="pomodoro-wrap">
        <div class="pomodoro-container">
            <h2>Pomodoro Timer</h2>

            <div class="pomodoro-times">
                <div>
                    <p>Break Length</p>
                    <input type="number" v-model="breakLength" :disabled="!isPaused">
                    <button @click="minus('break')" :disabled="!isPaused">-</button>
                    <button @click="plus('break')" :disabled="!isPaused">+</button>
                </div>

                <div>
                    <p>Session Length</p>
                    <input type="number" v-model="sessionLength" :disabled="!isPaused">
                    <button @click="minus('session')" :disabled="!isPaused">-</button>
                    <button @click="plus('session')" :disabled="!isPaused">+</button>
                </div>
            </div>

            <div class="timer" :class="{last : (inTimestamp < 60000) && !isPaused, anim : !isPaused}">
                <p v-if="sessionTimer">Session</p>
                <p v-else>Break</p>
                <p class="timer-clock">{{ timer }}</p>

                <audio ref="audio" loop autostart="false">
                    <source src="../assets/sounds/ringtone.mp3" type="audio/mpeg">
                    <source src="../assets/sounds/ringtone.wav" type="audio/wav">
                    Your browser does not support the audio element.
                </audio>
            </div>


            <div class="control-buttons">
                <button @click="startPause()" :disabled="delay">Start/Pause</button>
                <button @click="reset()">Reset</button>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: 'Pomodoro',
        data () {
            return {
                breakLength: 5,
                sessionLength: 25,
                inTimestamp: null,
                now: null,
                timer: '',
                isPaused: true,
                sessionTimer: true,
                delay: false
            }
        },
        created() {
            this.debouncedLength = _.debounce(function (type) {
                this.setLength(type);
            }, 700);
        },
        mounted() {
            this.setTimes();
        },
        methods: {
            setTimes: function () {
                if (this.sessionTimer) {
                    this.inTimestamp = this.sessionLength * 60 * 1000;
                }
                else {
                    this.inTimestamp = this.breakLength * 60 * 1000;
                }

                this.now = new Date();
                this.now.setTime(this.inTimestamp);

                var mins = ("0" + this.now.getUTCMinutes()).slice(-2);
                var second = ("0" + this.now.getUTCSeconds()).slice(-2);

                this.timer = mins + ":" + second;
            },
            startPause: function () {
                var self = this;

                self.isPaused = !self.isPaused;
                self.delay = true;

                setTimeout(function () {
                    self.delay = false;
                }, 1000);


                var intervalID = setInterval(function () {
                    if (self.inTimestamp <= 1000) {
                        var music = self.$refs.audio;
                        music.play();

                        self.isPaused = !self.isPaused;
                        clearInterval(intervalID);

                        self.sessionTimer = !self.sessionTimer;
                        self.setTimes();
                        self.startPause();

                        setTimeout(function () {
                            music.pause();
                        }, 2000);
                    }

                    if (!self.isPaused) {
                        self.inTimestamp = self.inTimestamp - 1000;
                        self.now.setTime(self.inTimestamp);

                        var mins = ("0" + self.now.getUTCMinutes()).slice(-2);
                        var second = ("0" + self.now.getUTCSeconds()).slice(-2);

                        self.timer = mins + ":" + second;
                    }
                    else {
                        clearInterval(intervalID);
                    }
                }, 1000);

            },
            reset: function () {
                this.isPaused = true;
                this.sessionTimer = true;
                this.delay = false;
                this.breakLength = 5;
                this.sessionLength = 25;
                this.setTimes();
            },
            setLength: function (type) {
                if (type == 'break') {
                    if (this.breakLength >= 59) {
                        this.breakLength = 59;
                    }
                    else if (this.breakLength < 1) {
                        this.breakLength = 1;
                    }

                    if (this.isPaused && !this.sessionTimer) {
                        this.setTimes();
                    }
                }
                else {
                    if (this.sessionLength >= 59) {
                        this.sessionLength = 59;
                    }
                    else if (this.sessionLength < 1) {
                        this.sessionLength = 1;
                    }

                    if (this.isPaused && this.sessionTimer) {
                        this.setTimes();
                    }
                }
            },
            minus: function (type) {
                if (this.isPaused) {
                    if (type == 'session' && this.sessionLength > 1) {
                        this.sessionLength--;
                    }
                    else if (type == 'break' && this.breakLength > 1) {
                        this.breakLength--;
                    }
                }
            },
            plus: function (type) {
                if (this.isPaused) {
                    if (type == 'session' && this.sessionLength < 59) {
                        this.sessionLength++;
                    }
                    else if (type == 'break' && this.breakLength < 59) {
                        this.breakLength++;
                    }
                }
            }
        },
        watch: {
            sessionLength: function () {
                this.debouncedLength('session');
            },
            breakLength: function () {
                this.debouncedLength('break');
            }
        }
    }
</script>


<style scoped>
    .pomodoro-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 50px 0;
        height: 100%;
        min-height: 100vh;
        background: #a2002c;
        transition: 2s background linear;
    }

    .pomodoro-container {
        display: block;
        position: relative;
        width: 20%;
        min-width: 300px;
        height: auto;
        padding: 20px;
        color: white;
        border-radius: 5px;
    }

    .pomodoro-times {
        display: flex;
        justify-content: space-between;
    }

    input {
        display: block;
        margin: 0 auto;
        padding: 5px;
        width: 50px;
        height: 50px;
        text-align: center;
        font-weight: bold;
        color: black;
        background: white;
        border: 3px solid #E91E63;
        border-radius: 50%;
        outline: none;
    }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input:disabled {
        opacity: 0.4;
        cursor: default;
    }

    .pomodoro-times button {
        margin-top: 20px;
        padding: 0;
        width: 30px;
        height: 30px;
        color: white;
        font-size: 25px;
        line-height: 25px;
        text-align: center;
        border: 1px solid #d00000;
        border-radius: 5px;
        background: none;
        outline: none;
    }

    .pomodoro-times button:hover {
        background: #FF5722;
        cursor: pointer;
    }

    .pomodoro-times button:disabled {
        opacity: 0.4;
        cursor: default;
    }

    .control-buttons button {
        margin: 20px;
        padding: 5px 10px;
        color: white;
        font-size: 16px;
        line-height: 16px;
        text-align: center;
        border: 1px solid #d00000;
        border-radius: 5px;
        background: none;
        outline: none;
    }

    .control-buttons button:hover {
        background: #FF5722;
        cursor: pointer;
    }

    .control-buttons button:disabled {
        opacity: 0.4;
        cursor: default;
    }

    .timer {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        width: 300px;
        height: 300px;
        color: white;
        font-size: 20px;
        text-align: center;
        background: none;
        border: 10px solid #F44336;
        border-radius: 50%;
    }

    .timer.anim {
        animation-name: anim;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-fill-mode: forwards;
    }

    @keyframes anim {
        0% {
            border-color: #F44336;
        }
        50% {
            border-color: #ffffff;
        }
        100% {
            border-color: #F44336;
        }
    }

    .timer.last {
        animation-name: color;
        animation-duration: 1s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-fill-mode: forwards;
    }

    @keyframes color {
        0% {
            border-color: #E91E63;
        }
        50% {
            border-color: #ffc600;
        }
        100% {
            border-color: #E91E63;
        }
    }

    .timer p {
        line-height: 20px;
    }

    p.timer-clock {
        font-size: 60px;
        line-height: 60px;
    }
</style>
