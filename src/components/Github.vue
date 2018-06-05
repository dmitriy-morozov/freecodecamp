<template>
    <div class="github-wrap">
        <div class="loader" v-show="loading">
            <div class="loader-icon"></div>
        </div>

        <nav class="github-nav">
            <div>
                <label>
                    <p>Repository owner:</p>
                    <input type="text" v-model="repoOwner">
                </label>
            </div>


            <div v-show="reposList != null">
                <p>Repository list:</p>

                <select v-model="repoName">
                    <option v-for="repo in reposList" :value="repo.name">
                        {{ repo.name }}
                    </option>
                </select>
            </div>


            <div v-show="branches != null">
                <p>Repository branch:</p>

                <select v-model="currentBranch">
                    <option v-for="branch in branches" :value="branch.name">
                        {{ branch.name }}
                    </option>
                </select>
            </div>
        </nav>


        <div class="github-container">
            <h2>Latest Commits</h2>

            <div v-if="errorApiMessage">
                <p>{{errorApiMessageText}}</p>
                <p>Information not refreshed now.</p>
            </div>


            <div v-if="shaList != null">
                <div class="commit" v-for="sha in shaList.slice(startOfList, endOfList)">
                    <div class="commit-message">
                        <a :href="sha.html_url" target="_blank" v-if="sha.html_url != null">
                            <span>{{sha.sha.slice(0, 7)}}</span>
                            <b>{{sha.commit.message}}</b>
                        </a>
                    </div>

                    <div class="commit-author">
                        <a class="commit-author__name" :href="sha.author.html_url" target="_blank" v-if="sha.author.html_url != null">
                            <img class="commit-author__image" :src="sha.author.avatar_url" alt="sha.commit.author.name">
                            <span>{{sha.commit.author.name}}</span>
                        </a>
                        <span class="commit-author__date">{{sha.commit.author.date | formatDate}}</span>
                    </div>
                </div>
            </div>

            <div class="pagination" v-if="shaList != ''">
                <button @click="prevPage()" :disabled="currentPage == 0">Prev page</button>
                <button @click="nextPage()" :disabled="currentPage == pageNumbers - 1">Next page</button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import _ from 'lodash';

    export default {
        name: 'Github',
        data () {
            return {
                branches: null,
                currentBranch: null,
                shaList: null,
                reposList: null,
                repoOwner: 'vuejs',
                repoName: null,
                pagination: false,
                itemsPerPage: 5,
                currentPage: 0,
                errorApiMessage: false,
                errorApiMessageText: '',
                loading: false
            }
        },
        created: function () {
            this.debouncedSearchRepos = _.debounce(this.getRepos, 500)
        },
        mounted() {
            this.getRepos();
        },
        computed: {
            startOfList() {
                return this.currentPage * this.itemsPerPage;
            },
            endOfList() {
                return this.currentPage * this.itemsPerPage + this.itemsPerPage;
            },
            pageNumbers() {
                return Math.ceil(this.shaList.length / this.itemsPerPage);
            }
        },
        methods: {
            getRepos: function () {
                var self = this;
                self.loading = true;

                axios.get("https://api.github.com/users/" + this.repoOwner + "/repos")
                        .then(function (response) {
                            self.reposList = response.data;

                            self.repoName = self.reposList[0].name;

                            self.getBranches();
                        })
                        .catch(function (error) {
                            console.log(error);
                            self.errorApiMessageText = error.response.data.message;

                            self.errorApiMessage = true;
                            self.loading = false;
                        });
            },
            getBranches: function () {
                var self = this;

                axios.get("https://api.github.com/repos/" + this.repoOwner + "/" + this.repoName + "/branches")
                        .then(function (response) {
                            self.branches = response.data;


                            for (var i = 0; i < self.branches.length; i++) {
                                if (self.branches[i].name == 'master') {
                                    self.currentBranch = self.branches[i].name;
                                }
                                else if ((i == self.branches.length - 1) && !self.currentBranch) {
                                    self.currentBranch = self.branches[0].name;
                                }
                            }

                            self.getCommits();
                        })
                        .catch(function (error) {
                            console.log(error);
                            self.errorApiMessageText = error.response.data.message;

                            self.errorApiMessage = true;
                            self.loading = false;
                        });
            },
            getCommits: function () {
                var self = this;
                self.loading = true;
                self.currentPage = 0;

                axios.get("https://api.github.com/repos/" + this.repoOwner + "/" + this.repoName + "/commits?sha=" + this.currentBranch)
                        .then(function (response) {
                            self.shaList = response.data;

                            self.loading = false;
                        })
                        .catch(function (error) {
                            console.log(error);
                            self.errorApiMessageText = error.response.data.message;

                            self.errorApiMessage = true;
                            self.loading = false;
                        });
            },
            prevPage: function () {
                if (this.currentPage > 0) {
                    this.currentPage--;
                }
            },
            nextPage: function () {
                if (this.currentPage < this.pageNumbers - 1) {
                    this.currentPage++;
                }
            }
        },
        watch: {
            currentBranch: function () {
                this.getCommits();
            },
            repoName: function () {
                this.getBranches();
            },
            repoOwner: function () {
                if (this.repoOwner != ''){
                    this.debouncedSearchRepos()
                }
                else {
                    this.branches = '';
                    this.shaList = '';
                    this.reposList = '';
                }
            }
        },
        filters: {
            formatDate: function (v) {
                return v.replace(/T|Z/g, ' ')
            }
        }
    }
</script>

<style scoped>
    .github-wrap {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 50px 0;
        height: 100%;
        min-height: 100vh;
        background: #009688;
    }

    .github-nav {
        width: 200px;
        margin-right: 10px;
        padding: 10px;
        background: white;
        border-radius: 5px;
        text-align: left;
    }

    .github-nav p {
        margin: 10px 0;
    }

    .github-nav input,
    .github-nav select {
        width: 100%;
        margin: 5px 0;
    }

    .github-nav button {
        display: block;
        width: 100%;
        margin: 10px 0;
        padding: 5px 10px;
        background: #03A9F4;
        color: white;
        outline: none;
        border: none;
        transition: 1s background;
    }

    .github-nav button:hover {
        background: #6c6cc6;
        cursor: pointer;
    }

    .github-container {
        display: block;
        position: relative;
        width: 30%;
        min-width: 300px;
        height: auto;
        padding: 20px;
        background: white;
        border-radius: 5px;
    }

    h2 {
        margin-bottom: 30px;
    }

    .commit {
        display: block;
        margin: 10px 0;
        padding: 10px;
    }

    .commit:nth-child(1n) {
        background: rgba(239, 255, 229, 0.77);
        border-radius: 5px;
    }

    .commit:nth-child(2n) {
        background: #c4c5ff36;
        border-radius: 5px;
    }

    .commit-message {
        text-align: left;
        font-size: 14px;
        font-weight: 600;
        color: black;
    }

    .commit-message a {
        display: flex;
        align-items: center;
        color: black;
        text-decoration: none;
    }

    .commit-message a:hover b {
        color: #0417a6;
    }

    .commit-message span {
        display: inline-block;
        min-width: 75px;
        margin-right: 10px;
        padding: 5px;
        background: white;
        border: 1px solid darkgrey;
        text-decoration: none;
        text-align: center;
    }

    .commit-author {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        justify-content: space-between;
        margin: 10px 0;
        font-size: 14px;
    }

    .commit-author__name {
        display: flex;
        align-items: center;
        margin-right: 10px;
        color: black;
        text-decoration: none;
    }

    .commit-author__name:hover {
        color: #0417a6;
    }

    .commit-author__image {
        display: inline-block;
        width: 30px;
        height: auto;
        margin-right: 10px;
        border-radius: 5px;
    }

    .loader {
        display: block;
        position: fixed;
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

    .pagination {
        display: flex;
        justify-content: space-between;
    }

    .pagination button {
        display: block;
        width: 30%;
        margin: 10px 0;
        padding: 5px 10px;
        background: #00BCD4;
        color: white;
        outline: none;
        border: none;
        transition: 1s background;
    }

    .pagination button:hover {
        background: #6c6cc6;
        cursor: pointer;
    }

    .pagination button:disabled {
        opacity: 0.4;
    }
</style>
