// add vendor prefixes because I'm lazy
import autoprefixer from "autoprefixer";

const noImageSave = () => ({
  postcssPlugin: "no-image-save",
  Once(root, { Rule, Declaration }) {
    const rule = new Rule({ selector: "img" });
    rule.append(new Declaration({ prop: "-webkit-touch-callout", value: "none" }));
    rule.append(new Declaration({ prop: "-webkit-user-select", value: "none" }));
    rule.append(new Declaration({ prop: "user-select", value: "none" }));
    root.append(rule);
  },
});
noImageSave.postcss = true;

export default {
  plugins: [noImageSave(), autoprefixer()],
};