'use strict'

module.exports = [
    {
        path: '/',
        component: resolve => {
            require(['./view/_sys/index.vue'], resolve);
        }
    },
    {
        path: '/sys',
        name: 'sys',
        component: resolve => {
            require(['./view/_sys/index.vue'], resolve);
        }
    },
    {
        path: '/entry',
        name: 'entry',
        component: resolve => {
            require(['./view/_entry/index.vue'], resolve);
        },
        beforeEnter: (to, from, next) => {
            document.body.setAttribute('class', 'entry');
            next();
        }
    },
    {
        path: '/node/',
        name: 'node',
        component: resolve => {
            require(['./view/_node/index.vue'], resolve);
        }
    },
    {
        path: '/node/:id',
        name: 'single-node',
        component: resolve => {
            require(['./view/_node/node.vue'], resolve); 
        }
    },
    {
        path: '/video',
        name: 'video',
        component: resolve => {
            require(['./view/_video/index.vue'], resolve);
        }
    },
    {
        path: '/video/:id',
        name: 'single-video',
        component: resolve => {
            require(['./view/_video/video.vue'], resolve);
        }
    },
    {
        path: '/comparison',
        name: 'comparison',
        component: resolve => {
            require(['./view/_video/comparison.vue'], resolve);
        },
        beforeEnter (to, from, next) {
            if (!store.state.shopData.length) 
                return next('/video');
            next();
        }
    },
    {
        path: '/file',
        name: 'file',
        component: resolve => {
            require(['./view/_file/index.vue'], resolve);
        }
    },
    {
        path: '/log',
        name: 'log',
        component: resolve => {
            require(['./view/_log/index.vue'], resolve);
        }
    },
    {
        path: '/rack',
        name: 'rack',
        component: resolve => {
            require(['./view/_rack/index.vue'], resolve);
        }
    }
];