<template>
    <div class="hello">
        <img src="../assets/logo.png">
        <h2>Freecodecamp challenges (Vue.js)</h2>
        <ul>
            <li>
                <router-link to="/quote">Random Quote Machine</router-link>
            </li>
            <li>
                <router-link to="/weather">Local Weather</router-link>
            </li>
            <li>
                <router-link to="/pomodoro">Pomodoro Timer</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        data () {
            return {}
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: block;
        margin: 10px;
    }

    a {
        color: #42b983;
    }
</style>
