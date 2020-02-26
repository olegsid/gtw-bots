`
<template>
    <div class="page page--index">
        <button @click="add">add new</button>
        <button @click="save">save</button>
        <button @click="load">load</button>
        <button @click="clear">clear</button>
        <div>
            <div v-for="(item, index) in items" :class="{started:item.started}" class="row">
                <input type="text" v-model="item.joinUrl">
                <button @click="start(index)"> start</button>
                <button @click="stop(index)"> stop</button>
                <span>id, {{index}}</span>
            </div>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';
    import Posts from '../components/Posts.vue';

    export default {
        components: {
            Posts
        },
        data: function () {
            return {
                welcome: 'Welcome to home page!',
                items: [{
                    joinUrl: '',
                    started: true
                }]
            }
        },
        methods: {
            add() {
                this.items.push({
                    joinUrl: '',
                    started: false
                })
            },
            async start(index) {
                try {
                    const joinUrl = this.items[index].joinUrl + '?clientType=html5';
                    const resp = await axios.post('/start', {id: index, joinUrl});

                    console.log(resp.data);
                    this.items[index].started = true;

                } catch (e) {
                    console.log(e);
                }
            },
            async stop(index) {
                try {
                    const resp = await axios.post('/stop', {id: index});
                    console.log(resp.data);
                    this.items[index].started = false;

                } catch (e) {
                    console.log(e);
                    this.items[index].started = false;
                }
            },
            save() {
                const items = JSON.parse(JSON.stringify(this.items));
                items.forEach(item => item.started = false);
                localStorage.setItem('items', JSON.stringify(items))
            },
            load() {
                const items = JSON.parse(localStorage.getItem('items'))
                if (!items) return

                this.items.splice(0, this.items.length);
                console.log(items);
                items.forEach(item => {
                    this.items.push(item)
                })
            },
            clear() {
                localStorage.clear();
            }
        },
        created() {
            this.load()
        }
    }
</script>
<style scoped lang="scss">
    .row {
        width: 805px;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        margin: 5px 0;
        background: lightblue;

        input {
            width: 60%;
        }
    }

    .started {
        background: lightcoral;
    }
</style>`