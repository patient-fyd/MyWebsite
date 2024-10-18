import { defineStore } from 'pinia';
import axios from 'axios';

export const useStore = defineStore('main', {
    state: () => ({
        articles: [],
        categories: [],
        tags: [],
    }),
    actions: {
        async fetchArticles() {
            try {
                const response = await axios.get('/api/articles');
                this.articles = response.data;
            } catch (error) {
                console.error('Failed to fetch articles:', error);
            }
        },
        async fetchCategories() {
            try {
                const response = await axios.get('/api/categories');
                this.categories = response.data;
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        },
        async fetchTags() {
            try {
                const response = await axios.get('/api/tags');
                this.tags = response.data;
            } catch (error) {
                console.error('Failed to fetch tags:', error);
            }
        },
    },
});