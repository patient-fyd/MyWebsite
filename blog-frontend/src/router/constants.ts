export const RoutePath = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    CHANGE_PASSWORD: '/change-password',
    RESET_PASSWORD: '/reset-password'
  },
  POSTS: {
    LIST: '/posts',
    DETAIL: '/posts/:id',
    EDIT: '/posts/:id/edit',
    CREATE: '/posts/create'
  },
  CATEGORY: {
    LIST: '/category/:categoryId'
  },
  SEARCH: '/search',
  STUDY: {
    TASK: '/study-task',
    LEARNING_ROUTE: '/learning-route'
  },
  READING_NOTES: {
    ROOT: '/readingnotes',
    HOME: '/readingnotes/home',
    BOOKS: '/readingnotes/books',
    BOOK_DETAIL: '/readingnotes/books/:id',
    NOTE_EDITOR: '/readingnotes/note-editor',
    THOUGHTS: '/readingnotes/thoughts',
    PURCHASE_LIST: '/readingnotes/purchase-list',
    READING_PLAN: '/readingnotes/reading-plan',
    SHARE: '/readingnotes/share'
  }
} as const; 