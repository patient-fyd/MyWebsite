import { defineStore } from 'pinia';
import axios from 'axios';

// 定义接口类型
interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    tags: string[];
}

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

interface State {
    articles: Article[];
    categories: Category[];
    tags: Tag[];
    popularPosts: Article[];  // 热门文章数据
}

export const useStore = defineStore('main', {
    // 定义 store 的状态类型
    state: (): State => ({
        articles: [],
        categories: [],
        tags: [],
        popularPosts: [],
    }),

    actions: {
        // 获取文章列表
        async fetchArticles() {
            try {
                const response = await axios.get<Article[]>('/api/posts');  // 使用类型推断
                this.articles = response.data;
                console.log('文章数据:', response.data);
            } catch (error) {
                console.error('获取文章数据失败:', error);
            }
        },

        // 获取分类列表
        async fetchCategories() {
            try {
                const response = await axios.get<Category[]>('/api/categories');  // 使用类型推断
                this.categories = response.data;
                console.log('分类数据:', response.data);
            } catch (error) {
                console.error('获取分类数据失败:', error);
            }
        },

        // 获取标签列表
        async fetchTags() {
            try {
                const response = await axios.get<Tag[]>('/api/tags');  // 使用类型推断
                this.tags = response.data;
                console.log('标签数据:', response.data);
            } catch (error) {
                console.error('获取标签数据失败:', error);
            }
        },

        // 获取热门文章列表
        async fetchPopularPosts() {
            try {
                const response = await axios.get<Article[]>('/api/popular-posts');  // 使用类型推断
                this.popularPosts = response.data;
                console.log('热门文章数据:', response.data);
            } catch (error) {
                console.error('获取热门文章数据失败:', error);
            }
        },
    },
});