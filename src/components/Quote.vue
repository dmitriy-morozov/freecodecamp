<template>
    <div class="quote-wrap" v-bind:style="{ backgroundColor: color}">
        <div class="quote-container">
            <h2>Random Quote Machine (Bash.im)</h2>

            <p id="quote" class="quote"  v-html="quote"></p>

            <div class="quote-buttons">
                <button @click="shareTweet()">Share to twitter</button>
                <button @click="getQuote()">Get a random quote</button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'Quote',
        data () {
            return {
                quotes: '',
                quote: '',
                color:''
            }
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            fetchData: function () {
                var self = this;

                try {
                    axios.get("http://umorili.herokuapp.com/api/get?site=bash.im&name=bash&num=50")
                            .then(function (response) {
                                self.quotes = response.data;

                                self.getQuote();
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                }
                catch (err) {
                    console.log(error);
                }
            },
            getQuote: function () {
                var randomNumber = Math.floor(Math.random() * 50) + 1;
                this.quote = this.quotes[randomNumber].elementPureHtml;

                this.changeColor();
            },
            shareTweet: function () {
                var myQuote = document.getElementById('quote').innerText;

                var shareURL = "http://twitter.com/share?"; //url base

                var params = {
                    url: window.location.href,
                    text: myQuote
                };

                for (var prop in params) shareURL += '&' + prop + '=' + encodeURIComponent(params[prop]);
                window.open(shareURL, '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
            },
            changeColor: function () {
                var num = Math.round(0xffffff * Math.random());
                var r = num >> 16;
                var g = num >> 8 & 255;
                var b = num & 255;

                this.color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
            }
        }
    }
</script>


<style scoped>
   .quote-wrap {
       display: flex;
       align-items: flex-start;
       justify-content: center;
       padding: 50px 0;
       height: 100%;
       min-height: 100vh;
       transition: 2s background linear;
   }

    .quote-container {
        display: block;
        position: relative;
        width:30%;
        min-width: 200px;
        height: auto;
        padding: 20px;
        background: white;
        border-radius: 5px;
    }

    .quote {
        text-align: left;
    }

    .quote-buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width:100%;
    }

    button {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 5px;
        background: #8686ea;
        color: white;
        outline: none;
        border: none;
        transition: 1s background;
    }

   button:hover {
       background: #6c6cc6;
       cursor: pointer;
   }
</style>
