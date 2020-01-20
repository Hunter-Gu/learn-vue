import PatchText from "@/components/vdom/patch/patch-text";
import PatchHtmlElement from "@/components/vdom/patch/patch-html-element";
import PatchChildren from "@/components/vdom/patch/patch-children";
import PatchVNodeData from "@/components/vdom/patch/patch-vnode-data";
import PatchPortal from "@/components/vdom/patch/patch-portal";

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
  },
  {
    path: "patch-vnode-data",
    component: PatchVNodeData
  },
  {
    path: "patch-portal",
    component: PatchPortal
  }
];
