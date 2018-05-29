<template>
    <div class="quote">
        <h2>Random Quote Machine</h2>
        <button @click="getQuote()">Get a random quote</button>

        <div class="quote-text">
            {{quote}}
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'Quote',
        data () {
            return {
                quote: '',
            }
        },
        methods: {
            getQuote: function () {
                var self = this;

                axios.get("http://fucking-great-advice.ru/api/random/censored").then(function (response) {
                    console.log('response',response);
                    self.quote = response.text;
                }.bind(this));
            }
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
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
