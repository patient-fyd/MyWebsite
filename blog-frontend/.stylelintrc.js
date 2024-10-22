module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recommended-vue", // 支持 Vue 的 `<style>` 标签
  ],
  rules: {
    "color-no-invalid-hex": true,
    "declaration-block-no-duplicate-properties": true,
    "block-no-empty": true,
  },
};
