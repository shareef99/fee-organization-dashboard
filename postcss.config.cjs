module.exports = {
  plugins: {
    "postcss-preset-mantine": {},
    "postcss-simple-vars": {
      variables: {
        "mantine-breakpoint-xs": "30em", // 480px
        "mantine-breakpoint-sm": "40em", // 640px
        "mantine-breakpoint-md": "48em", // 768px
        "mantine-breakpoint-lg": "62em", // 992px
        "mantine-breakpoint-xl": "75em", // 1200px
        "mantine-breakpoint-2xl": "88em", // 1408px
      },
    },
  },
};
