import vue from "eslint-plugin-vue";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import vueParser from "vue-eslint-parser"; // 添加 vue-eslint-parser

export default [
  {
    files: ["**/*.ts", "**/*.vue"], // 指定要应用 ESLint 的文件类型
    languageOptions: {
      ecmaVersion: 2020, // ECMAScript 2020
      sourceType: "module", // 使用 ES 模块系统
      parser: vueParser, // 使用 vue-eslint-parser 解析 .vue 文件
      parserOptions: {
        parser: "@typescript-eslint/parser", // 在 .vue 文件中解析 <script> 标签部分的 TypeScript 代码
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      vue, // Vue 插件
      "@typescript-eslint": typescriptPlugin, // TypeScript 插件
      prettier, // Prettier 插件
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "vue/multi-word-component-names": "off", // Vue 单词组件名规则关闭
      "prettier/prettier": "error", // Prettier 格式规则
    },
  },
];
