import { defineStore } from 'pinia';
import axios from 'axios';

export const useStore = defineStore('main', {
    state: () => ({
        articles: [],
        categories: [],
        tags: [],
        popularPosts: [],  // 新增热门文章数据
    }),
    actions: {
        // 获取文章列表
        async fetchArticles() {
            try {
                const response = await axios.get('/api/posts');  // 修改为 /api/posts
                this.articles = response.data;
                console.log('文章数据:', response.data);
            } catch (error) {
                console.error('获取文章数据失败:', error);
            }
        },

        // 获取分类列表
        async fetchCategories() {
            try {
                const response = await axios.get('/api/categories');
                this.categories = response.data;
                console.log('分类数据:', response.data);
            } catch (error) {
                console.error('获取分类数据失败:', error);
            }
        },

        // 获取标签列表
        async fetchTags() {
            try {
                const response = await axios.get('/api/tags');
                this.tags = response.data;
                console.log('标签数据:', response.data);
            } catch (error) {
                console.error('获取标签数据失败:', error);
            }
        },

        // 获取热门文章列表
        async fetchPopularPosts() {
            try {
                const response = await axios.get('/api/popular-posts');  // 新增热门文章获取
                this.popularPosts = response.data;
                console.log('热门文章数据:', response.data);
            } catch (error) {
                console.error('获取热门文章数据失败:', error);
            }
        },
    },
});