export default {
  install: (app: any) => {
    app.config.globalProperties.$filters = {
      capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      toKebabCase(string: string) {
        return string
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .replace(/[\s_]+/g, "-")
          .toLowerCase();
      },
      toPascalCase(string: string) {
        return `${string}`
          .replace(new RegExp(/[-_]+/, "g"), " ")
          .replace(new RegExp(/[^\w\s]/, "g"), "")
          .replace(new RegExp(/\s+(.)(\w*)/, "g"), ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`)
          .replace(new RegExp(/\w/), (s) => s.toUpperCase());
      },
    };
  },
};
