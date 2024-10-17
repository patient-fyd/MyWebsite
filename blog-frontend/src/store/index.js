import { defineStore } from 'pinia'
import axios from 'axios'

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [],
    }),
    actions: {
        async fetchPosts() {
            const response = await axios.get('/api/posts')
            this.posts = response.data
        },
    },
})