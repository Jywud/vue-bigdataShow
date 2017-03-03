<template>
    <div id="app">
        <nav-router :navList="navList"></nav-router>
        <div class="bg"></div>
        <transition name="component-fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <transition name="fall">
            <Alert v-show="show"></Alert>
        </transition>
    </div>
</template>
    
<script>

    import NavRouter from './components/nav.vue';
    import Alert from './components/alert.vue';

    export default {
        data () {
            return {
                navList: [
                    {name: 'sys', title: '系统概况'},
                    {name: 'node', title: '节点监控'},
                    {name: 'video', title: '录像管理'},
                    {name: 'file', title: '文件管理'},
                    {name: 'log', title: '系统日志'},
                    {name: 'rack', title: '机柜管理'}
                ]
            }
        },
        computed: {
            show () {
                return this.$store.state.showAlert;
            }
        },
        components: {
            NavRouter,
            Alert
        }
    }
</script>

<style lang="less">
        .component-fade-enter-active, .component-fade-leave-active {
            transition: opacity .25s ease;
        }
        .component-fade-enter, .component-fade-leave-active {
            opacity: 0;
        }
        .fall-enter-active{
            transition: all 0.3s ease;
        }
        .fall-enter {
            transform: scale(0.2);
        }
        .fall-leave-active{
            transition: all .4s ease;
        }
        .fall-leave-active{
            top: -100px !important;
        }
</style>
