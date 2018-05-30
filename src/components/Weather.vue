<template>
    <div class="weather-wrap">
        <div class="loader" v-show="loading">
            <div class="loader-icon"></div>
        </div>

        <nav class="weather-nav">
            <ul>
                <li @click="setDuration('Now')">Сейчас</li>
                <li @click="setDuration('5')">На 5 дней</li>
            </ul>

            <input type="text" placeholder="Введите город" v-model="searchCity">
            <div class="search-list">
                <p v-for="city in cityList" @click="setNewCity(city)">{{city.LocalizedName}}, {{city.AdministrativeArea.LocalizedName}}, {{city.Country.LocalizedName}}</p>
            </div>
        </nav>


        <div class="weather-container">
            <h2>Weather App</h2>

            <p v-if="errorMessage">Geolocation is not supported by this browser or you need give permissions</p>
            <p v-if="errorApiMessage">Errors with AccuWeather API</p>


            <div class="weather-today" v-show="duration == 'Now'">
                <div v-if="currentCity !='' ">
                    <p>{{currentCity.LocalizedName}}, {{currentCity.AdministrativeArea.LocalizedName}}, {{currentCity.Country.LocalizedName}}</p>
                </div>


                <div v-if="currentWeather !='' ">
                    <p>
                        <span v-if="temperatureType == 'Imperial'">{{currentWeather.Temperature.Imperial.Value}}</span>
                        <span v-else>{{currentWeather.Temperature.Metric.Value}}</span>

                        <span class="weather-toggle" @click="toggleType()">
                        <span v-if="temperatureType == 'Imperial'"> °F</span>
                        <span v-else> °C</span>
                    </span>
                    </p>

                    <p>{{currentWeather.WeatherText}}</p>

                    <div class="icon" :class="'icon-' + currentWeather.WeatherIcon"></div>
                </div>
            </div>

            <div class="weather-week" v-show="duration == '5'">
                <div v-if="currentCity !='' ">
                    <p>{{currentCity.LocalizedName}}, {{currentCity.AdministrativeArea.LocalizedName}}, {{currentCity.Country.LocalizedName}}</p>
                </div>

                <div class="day-list" v-if="currentWeather !='' ">
                    <div class="day" v-for="day in dailyForecasts">
                        <p>{{day.Date}}</p>

                        <p>{{day.Temperature.Minimum.Value}} ~ {{day.Temperature.Maximum.Value}} °C</p>

                        <div class="day-times">
                            <div>
                                <p>Днём: {{day.Day.IconPhrase}}</p>

                                <div class="icon" :class="'icon-' + day.Day.Icon"></div>
                            </div>

                            <div>
                                <p>Ночью: {{day.Night.IconPhrase}}</p>

                                <div class="icon" :class="'icon-' + day.Night.Icon"></div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import _ from 'lodash';

    export default {
        name: 'Weather',
        data () {
            return {
                currentCity: [],
                currentWeather: [],
                dailyForecasts: [],
                duration: 'Now',
                latitude: '',
                longitude: '',
                temperatureType: 'Metric',
                searchCity: '',
                cityList: [],
                errorMessage: false,
                errorApiMessage: false,
                loading: false
            }
        },
        created: function () {
            this.debouncedSearchCity = _.debounce(this.search, 1000)
        },
        mounted() {
            this.getGeolocation();
        },
        methods: {
            getGeolocation: function () {
                var self = this;

                function success(position) {
                    self.loading = true;

                    self.latitude = position.coords.latitude;
                    self.longitude = position.coords.longitude;

                    try {
                        axios.get("https://dataservice.accuweather.com/locations/v1/cities/geoposition/search", {
                            params: {
                                apikey: 'BeoItrTRBw7aN1kC1t9rIhJviyNGAoKe',
                                q: self.latitude + ',' + self.longitude,
                                language: 'ru-ru'
                            }
                        })
                                .then(function (response) {
                                    self.currentCity = response.data;

                                    self.getWeather();
                                })
                                .catch(function (error) {
                                    console.log(error);

                                    self.errorApiMessage = true;
                                    self.loading = false;
                                });
                    }
                    catch (err) {
                        self.errorMessage = true;
                        self.loading = false;
                    }
                }


                function error() {
                    self.errorMessage = true;
                }

                navigator.geolocation.getCurrentPosition(success, error);
            },
            getWeather: function () {
                var self = this;

                try {
                    if (self.duration == 'Now') {
                        console.log('Now');

                        var weatherLink = "http://dataservice.accuweather.com/currentconditions/v1/" + this.currentCity.Key;
                    }
                    else if (self.duration == '5') {
                        console.log('5');

                        var weatherLink = "http://dataservice.accuweather.com/forecasts/v1/daily/5day//" + this.currentCity.Key;
                    }

                    axios.get(weatherLink, {
                        params: {
                            apikey: 'BeoItrTRBw7aN1kC1t9rIhJviyNGAoKe',
                            language: 'ru-ru',
                            metric: true
                        }
                    })
                            .then(function (response) {
                                console.log(response);

                                if (self.duration == 'Now') {
                                    self.currentWeather = response.data[0];
                                }
                                else if (self.duration == '5') {
                                    console.log('response.data.DailyForecasts', response.data.DailyForecasts);
                                    self.dailyForecasts = response.data.DailyForecasts;

                                    for (var i = 0; i < self.dailyForecasts.length; i++) {
                                        var utcSeconds = self.dailyForecasts[i].EpochDate;
                                        var d = new Date(0);
                                        d.setUTCSeconds(utcSeconds);

                                        self.dailyForecasts[i].Date = ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2);
                                        console.log('time', self.dailyForecasts[i].Date);
                                    }

                                    console.log('self.dailyForecasts', self.dailyForecasts);
                                }


                                self.loading = false;
                            })
                            .catch(function (error) {
                                console.log(error);

                                self.errorApiMessage = true;
                                self.loading = false;
                            });
                }
                catch (err) {
                    self.errorMessage = true;
                    self.loading = false;
                }
            },
            toggleType: function () {
                if (this.temperatureType != 'Imperial') {
                    this.temperatureType = 'Imperial'
                } else {
                    this.temperatureType = 'Metric'
                }
            },
            setDuration: function (type) {
                this.duration = type;

                this.getWeather();
            },
            search: function () {
                var self = this;

                try {
                    axios.get("http://dataservice.accuweather.com/locations/v1/cities/autocomplete", {
                        params: {
                            apikey: 'BeoItrTRBw7aN1kC1t9rIhJviyNGAoKe',
                            q: self.searchCity,
                            language: 'ru-ru'
                        }
                    })
                            .then(function (response) {
                                self.cityList = response.data;
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                }
                catch (err) {
                    self.errorMessage = true;
                    self.loading = false;
                }
            },
            setNewCity: function (city) {
                this.currentCity = city;

                this.getWeather();
            }
        },
        watch: {
            searchCity: function () {
                this.debouncedSearchCity()
            }
        },
    }
</script>

<style scoped>
    .weather-wrap {
        position: relative;
        display: flex;
        justify-content: space-between;
        padding: 50px 0;
        height: 100%;
        min-height: 100vh;
        background: black;
    }

    .weather-nav {
        width: 20%;
        color:white;
    }

    .weather-nav ul {
        padding: 0;
        list-style: none;
    }

    .weather-nav li:hover,
    .search-list p:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    .weather-container {
        display: block;
        position: relative;
        width: 80%;
        min-width: 300px;
        height: auto;
        padding: 20px;
        color: white;
    }

    h2 {
        margin-bottom: 30px;
    }

    .weather-toggle {
        color: #799bff;
        font-size: 18px;
        font-weight: bold;
    }

    .weather-toggle:hover {
        color: #6678cb;
        cursor: pointer;
    }

    .loader {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        z-index: 2;
    }

    .loader-icon {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        border: 5px solid #E91E63;
        border-radius: 50%;
        overflow: hidden;
    }

    .loader-icon:after {
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: #9e9e9e;
        animation-name: anim;
        animation-duration: 3s;
        animation-iteration-count: infinite;
        animation-fill-mode: forwards;
    }

    @keyframes anim {
        0% {
            transform: translateY(0%)
        }
        50% {
            transform: translateY(100%)
        }
        100% {
            transform: translateY(0%)
        }
    }

    .icon {
        display: block;
        margin: 0 auto;
        width: 240px;
        height: 200px;
        background-image: url(../assets/sprite.png);
        background-repeat: no-repeat;
    }

    .day-list {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
    }

    .day {
        display: block;
        width: 19%;
        min-width: 260px;
        margin-bottom: 30px;
        padding: 20px;
        background: #333333;
        border-radius: 5px;
    }

    .day-times {

    }

    .icon-1 {
        background-position: -20px -0px;
    }

    .icon-2 {
        background-position: -280px -0px;
    }

    .icon-3 {
        background-position: -540px -0px;
    }

    .icon-4 {
        background-position: -800px -0px;
    }

    .icon-5 {
        background-position: -1060px -0px;
    }

    .icon-6 {
        background-position: -1320px -0px;
    }

    .icon-7 {
        background-position: -20px -220px;
    }

    .icon-8 {
        background-position: -280px -220px;
    }

    .icon-11 {
        background-position: -540px -220px;
    }

    .icon-12 {
        background-position: -800px -220px;
    }

    .icon-13 {
        background-position: -1060px -220px;
    }

    .icon-14 {
        background-position: -1320px -220px;
    }

    .icon-15 {
        background-position: -20px -440px;
    }

    .icon-16 {
        background-position: -280px -440px;
    }

    .icon-17 {
        background-position: -540px -440px;
    }

    .icon-18 {
        background-position: -800px -440px;
    }

    .icon-19 {
        background-position: -1060px -440px;
    }

    .icon-20 {
        background-position: -1320px -440px;
    }

    .icon-21 {
        background-position: -20px -660px;
    }

    .icon-22 {
        background-position: -280px -660px;
    }

    .icon-23 {
        background-position: -540px -660px;
    }

    .icon-24 {
        background-position: -800px -660px;
    }

    .icon-25 {
        background-position: -1060px -660px;
    }

    .icon-26 {
        background-position: -1320px -660px;
    }

    .icon-29 {
        background-position: -20px -880px;
    }

    .icon-30 {
        background-position: -280px -880px;
    }

    .icon-31 {
        background-position: -540px -880px;
    }

    .icon-32 {
        background-position: -800px -880px;
    }

    .icon-33 {
        background-position: -1060px -880px;
    }

    .icon-34 {
        background-position: -1320px -880px;
    }

    .icon-35 {
        background-position: -20px -1100px;
    }

    .icon-36 {
        background-position: -280px -1100px;
    }

    .icon-37 {
        background-position: -540px -1100px;
    }

    .icon-38 {
        background-position: -800px -1100px;
    }

    .icon-39 {
        background-position: -1060px -1100px;
    }

    .icon-40 {
        background-position: -1320px -1100px;
    }

    .icon-41 {
        background-position: -20px -1320px;
    }

    .icon-42 {
        background-position: -280px -1320px;
    }

    .icon-43 {
        background-position: -540px -1320px;
    }

    .icon-44 {
        background-position: -800px -1320px;
    }

</style>
