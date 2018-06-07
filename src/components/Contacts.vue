<template>
    <div class="contacts-wrap">
        <div class="contacts-container">
            <h2>Contact Manager</h2>

            <nav class="contacts-nav">
                <button
                        type="button"
                        :class="{active : activeGroup == ''}"
                        @click="filterContactByGroup('')"
                >
                    All contacts ({{contacts.length}})
                </button>

                <button
                        type="button"
                        v-for="group in groups"
                        :value="group.name"
                        :class="{active : activeGroup == group.name}"
                        :disabled="group.contactsLength == 0"
                        @click="filterContactByGroup(group.name)"
                >
                    {{group.name}} ({{group.contactsLength}})
                </button>


                <button @click="addContactModal()">+ Add contact</button>
            </nav>

            <div class="contacts-list">
                <div class="contact" v-for="contact in filteredContacts()">
                    <div class="contact-info">
                        <div class="contact-image">
                            <img v-if="contact.userImage" :src="contact.userImage"/>
                            <img v-else src="../assets/no-avatar.jpg"/>
                        </div>


                        <div class="contact-data">
                            <p>{{contact.name}}</p>
                            <a v-if="contact.mobileTel" :href="`tel:${contact.mobileTel}`">{{contact.mobileTel}}</a>
                            <a v-if="contact.workTel" :href="`tel:${contact.workTel}`">{{contact.workTel}}</a>
                            <a v-if="contact.homeTel" :href="`tel:${contact.homeTel}`">{{contact.homeTel}}</a>
                        </div>
                    </div>


                    <div class="control-buttons">
                        <button :class="{active : contact.isFavorite}" @click="setFavorite(contact)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/>
                            </svg>
                        </button>
                        <button @click="editContactModal(contact)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"/>
                            </svg>
                        </button>
                        <button @click="deleteContact(contact)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm416 56v324c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V140c0-6.6 5.4-12 12-12h360c6.6 0 12 5.4 12 12zm-272 68c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


            <div class="contacts-modal" v-if="addContactModalState">
                <h3>Add contact</h3>


                <div class="profile">
                    <div class="profile-left">
                        <div class="profile-image">
                            <img v-if="person.userImage" :src="person.userImage"/>
                            <img v-else src="../assets/no-avatar.jpg"/>
                        </div>

                        <div class="profile-loader">
                            <input v-if="!person.userImage" type="file" @change="onFileChange"/>

                            <button v-else class="delete-profile-image" @click="removeImage">Delete</button>
                        </div>
                    </div>

                    <div class="profile-right">
                        <input type="text" placeholder="Имя" v-model="person.name">
                        <input type="number" placeholder="Мобильный номер" v-model="person.mobileTel">
                        <input type="number" placeholder="Рабочий номер" v-model="person.workTel">
                        <input type="number" placeholder="Домашний номер" v-model="person.homeTel">

                        <div v-show="groups != ''">
                            <p>Groups list:</p>

                            <select v-model="person.groups">
                                <option v-for="group in groups" :value="group.name">
                                    {{ group.name }}
                                </option>
                            </select>
                        </div>

                        <button :disabled="notFullRequiredData" @click="addContact()">+ Add contact</button>
                        <p v-show="contactSaved">Contact saved.</p>
                    </div>
                </div>

                <button class="contacts-modal__close" @click="addContactModalState = !addContactModalState">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"/>
                    </svg>
                </button>
            </div>

            <div class="contacts-modal" v-if="editContactModalState && editableContact">
                <h3>Edit contact</h3>

                <div class="profile">
                    <div class="profile-left">
                        <div class="profile-image">
                            <img v-if="editableContact.userImage" :src="editableContact.userImage"/>
                            <img v-else src="../assets/no-avatar.jpg"/>
                        </div>

                        <div class="profile-loader">
                            <input v-if="!editableContact.userImage" type="file" @change="onFileChange"/>

                            <button v-else @click="removeImage()">Delete</button>
                        </div>
                    </div>

                    <div class="profile-right">
                        <input type="text" placeholder="Имя" v-model="editableContact.name">
                        <input type="number" placeholder="Мобильный номер" v-model="editableContact.mobileTel">
                        <input type="number" placeholder="Рабочий номер" v-model="editableContact.workTel">
                        <input type="number" placeholder="Домашний номер" v-model="editableContact.homeTel">

                        <div v-show="groups != ''">
                            <p>Groups list:</p>

                            <select v-model="editableContact.groups">
                                <option v-for="group in groups" :value="group.name">
                                    {{ group.name }}
                                </option>
                            </select>
                        </div>

                        <button :disabled="notFullRequiredData || contactSaved" @click="saveContacts()">Save contact</button>
                        <p v-show="contactSaved">Contact saved.</p>
                    </div>
                </div>

                <button class="contacts-modal__close" @click="editContactModalState = !editContactModalState">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Contacts',
        data () {
            return {
                person: {
                    name: null,
                    mobileTel: null,
                    workTel: null,
                    homeTel: null,
                    groups: null,
                    isFavorite: false,
                    userImage: ''
                },
                contacts: [],
                groups: [
                    {
                        name: 'Family',
                        contactsLength: 0,
                    },
                    {
                        name: 'Friends',
                        contactsLength: 0,
                    },
                    {
                        name: 'Coworkers',
                        contactsLength: 0,
                    },
                    {
                        name: 'Other',
                        contactsLength: 0,
                    }
                ],
                activeGroup: '',
                editableContact: null,
                addContactModalState: false,
                editContactModalState: false,
                contactSaved: false,
                storageKey: 'contacts'
            }
        },
        mounted() {
            this.fetchContacts();
        },
        computed: {
            notFullRequiredData() {
                if (
                        (this.person && this.person.name && (this.person.mobileTel || this.person.workTel || this.person.homeTel)) ||
                        (this.editableContact && this.editableContact.name && (this.editableContact.mobileTel || this.editableContact.workTel || this.editableContact.homeTel))
                ) {
                    return false;
                }
                else {
                    return true;
                }
            }
        },
        methods: {
            fetchContacts: function () {
                var tempContacts = JSON.parse(localStorage.getItem(this.storageKey));

                for (var i = 0; i < tempContacts.length; i++) {
                    if (tempContacts[i].isFavorite) {
                        this.contacts.unshift(tempContacts[i]);
                    }
                    else {
                        this.contacts.push(tempContacts[i]);
                    }
                }

                this.countLength();
            },
            countLength: function () {
                var self = this;

                for (var i = 0; i < this.groups.length; i++) {
                    this.groups[i].contactsLength = 0;

                    for (var j = 0; j < this.contacts.length; j++) {
                        if (this.groups[i].name == this.contacts[j].groups) {
                            this.groups[i].contactsLength++;
                        }
                    }
                }
            },
            addContactModal: function () {
                this.addContactModalState = !this.addContactModalState;
            },
            addContact: function () {
                this.contacts.push(this.person);
                this.saveContacts();

                this.countLength();

                this.person = {
                    name: null,
                    mobileTel: null,
                    workTel: null,
                    homeTel: null,
                    groups: null,
                    isFavorite: false,
                    userImage: ''
                };
            },
            saveContacts: function () {
                var self = this;
                this.contactSaved = true;

                localStorage.setItem(this.storageKey, JSON.stringify(this.contacts));

                setTimeout(function () {
                    self.contactSaved = false;
                    self.addContactModalState = false;
                }, 1000);
            },
            editContactModal: function (contact) {
                this.editableContact = contact;
                this.editContactModalState = !this.editContactModalState;
            },
            deleteContact: function (contact) {
                this.contacts.splice(this.contacts.indexOf(contact), 1);
                this.saveContacts();
            },
            setFavorite: function (contact) {
                var index = this.contacts.indexOf(contact);
                this.contacts[index].isFavorite = !this.contacts[index].isFavorite;
                this.saveContacts();
            },
            filteredContacts() {
                var self = this;

                return this.contacts.filter(function (contacts) {
                    if (self.activeGroup !== '') {
                        return contacts.groups == self.activeGroup
                    }
                    else {
                        return contacts
                    }

                })
            },
            filterContactByGroup: function (group) {
                this.activeGroup = group;
            },
            onFileChange(e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length) {
                    return;
                }
                this.createImage(files[0]);
            },
            createImage(file) {
                var reader = new FileReader();
                var self = this;

                reader.onload = (e) => {
                    if (self.editContactModalState) {
                        self.editableContact.userImage = e.target.result
                    }
                    else {
                        self.person.userImage = e.target.result
                    }
                };
                reader.readAsDataURL(file);
            },
            removeImage: function () {
                if (this.editContactModalState) {
                    this.editableContact.userImage = ''
                }
                else {
                    this.person.userImage = ''
                }
            }
        }
    }
</script>

<style scoped>
    .contacts-wrap {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        padding: 50px 0;
        height: 100%;
        min-height: 100vh;
        background: #8BC34A;
        color: white;
        transition: 2s background linear;
    }

    .contacts-container {
        display: block;
        position: relative;
        width: 40%;
        min-width: 300px;
        height: auto;
        padding: 20px;
        color: white;
        border-radius: 5px;
    }

    .contacts-nav {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        padding: 5px;
        background: white;
        border-radius: 5px;
    }

    .contacts-nav button {
        margin: 5px;
        padding: 5px;
        color: black;
        font-size: 16px;
        line-height: 16px;
        text-align: center;
        border: 1px solid #00BCD4;
        border-radius: 3px;
        background: none;
        outline: none;
    }

    .contacts-nav button:hover {
        background: #E6EE9C;
        cursor: pointer;
    }

    .contacts-nav button.active {
        background: #E6EE9C;
    }

    .contacts-nav button:disabled {
        opacity: 0.4;
        cursor: default;
    }

    .contacts-list {
        position: relative;
        margin-top: 10px;
        min-height: 300px;
        max-height: 50vh;
        overflow-y: auto;
        background: white;
        color: black;
        border-radius: 5px;
    }

    .contacts-list.overflow {
        overflow: hidden;
    }

    .contacts-list::-webkit-scrollbar {
        width: 7px;
    }

    .contacts-list::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    .contacts-list::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        outline: 1px solid slategrey;
    }

    .contact {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
    }

    .contact:nth-child(1n) {
        background: rgba(239, 255, 229, 0.77);
        border-radius: 5px;
    }

    .contact:nth-child(2n) {
        background: #c4c5ff36;
        border-radius: 5px;
    }

    .contact p {
        margin: 0;
    }

    .contact-image {
        position: relative;
        width: 80px;
        height: 80px;
        margin-right: 20px;
        border-radius: 50%;
        overflow: hidden;
    }

    .contact-image img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        height: auto;
    }

    .contact-info {
        display: flex;
        align-items: center;
        flex: 8;
        text-align: left;
    }

    .control-buttons {
        flex: 2;
    }

    .control-buttons button {
        margin: 5px;
        padding: 0;
        text-align: center;
        border: none;
        background: none;
        outline: none;
    }

    .control-buttons button svg {
        width: 25px;
        height: 25px;
        fill: #8BC34A;
    }

    .control-buttons button:hover svg {
        fill: #FF5722;
        cursor: pointer;
    }

    .control-buttons button.active svg {
        fill: #F44336;
    }

    .control-buttons button:disabled {
        opacity: 0.4;
        cursor: default;
    }

    .contacts-modal {
        position: absolute;
        top: 0;
        bottom: 20px;
        left: 20px;
        right: 20px;
        padding: 20px;
        color: black;
        background: white;
        border-radius: 5px;
        z-index: 1;
        overflow: auto;
    }

    .contacts-modal__close {
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 0;
        text-align: center;
        border: none;
        background: none;
        outline: none;
    }

    .contacts-modal__close svg {
        width: 30px;
        height: 30px;
        fill: #F44336;
    }

    .contacts-modal__close:hover svg {
        fill: #795548;
        cursor: pointer;
    }

    .profile {
        display: flex;
        align-items: flex-start;
        justify-content: space-around;
        margin-top: 40px;
    }

    .profile-left {
        width: 30%;
    }

    .profile-image {
        position: relative;
        padding-top: 100%;
        background: #F3F3F3;
        border-radius: 50%;
        border: 1px solid #8BC34A;
        overflow: hidden;
    }

    .profile-image img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        height: auto;
    }

    .profile-loader {
        margin-top: 20px;
    }

    .profile-loader button {
        margin: 5px;
        padding: 5px 15px;
        color: black;
        font-size: 16px;
        line-height: 16px;
        text-align: center;
        border: 1px solid #00BCD4;
        border-radius: 3px;
        background: none;
        outline: none;
    }

    .profile-loader button:hover {
        background: #E6EE9C;
        cursor: pointer;
    }

    .profile-right {
        width: 30%;
    }

    .profile-right input,
    .profile-right select {
        display: block;
        width: 100%;
        margin-bottom: 20px;
        padding: 5px 10px;
        border: 1px solid #00BCD4;
        border-radius: 3px;
        background: none;
        outline: none;
        color: black;
        font-size: 14px;
        line-height: 14px;
    }

    .profile-right button {
        width: 100%;
        padding: 5px 15px;
        color: white;
        font-size: 16px;
        line-height: 16px;
        text-align: center;
        border: 1px solid #00BCD4;
        border-radius: 3px;
        background: #9CCC65;
        outline: none;
    }

    .profile-right button:hover {
        background: #4CAF50;
        cursor: pointer;
    }

    .profile-right button:disabled {
        opacity: 0.4;
        cursor: default;
    }

    .profile-right button[disabled]:hover {
        background: #9CCC65;
    }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

</style>
