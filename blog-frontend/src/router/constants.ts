export const RoutePath = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  POSTS: {
    LIST: '/posts',
    DETAIL: '/posts/:id',
    EDIT: '/posts/:id/edit',
    CREATE: '/posts/create'
  },
  AUTH: {
    CHANGE_PASSWORD: '/change-password',
    RESET_PASSWORD: '/reset-password'
  },
  CATEGORY: '/category/:categoryId',
  SEARCH: '/search',
  STUDY: '/study-task',
  READING: {
    ROOT: '/reading',
    HOME: '/reading/home',
    BOOKS: '/reading/books',
    BOOK_DETAIL: '/reading/books/:id',
    NOTE_EDITOR: '/reading/note-editor',
    THOUGHTS: '/reading/thoughts',
    PURCHASE: '/reading/purchase-list',
    PLAN: '/reading/reading-plan',
    SHARE: '/reading/share'
  }
} as const; 