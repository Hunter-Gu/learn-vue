import PatchText from "@/components/vdom/patch/patch-text";
import PatchHtmlElement from "@/components/vdom/patch/patch-html-element";
import PatchChildren from "@/components/vdom/patch/patch-children";

export default [
  {
    path: "patch-text",
    component: PatchText
  },
  {
    path: "patch-html-element",
    component: PatchHtmlElement
  },
  {
    path: "patch-children",
    component: PatchChildren
  }
];
