import PatchText from "@/components/vdom/patch/patch-text";
import PatchHtmlElement from "@/components/vdom/patch/patch-html-element";
import PatchChildren from "@/components/vdom/patch/patch-children";
import PatchVNodeData from "@/components/vdom/patch/patch-vnode-data";
import PatchEvents from "@/components/vdom/patch/patch-events";
import PatchPortal from "@/components/vdom/patch/patch-portal";
import PatchFragment from "@/components/vdom/patch/patch-fragment";
import PatchComp from "@/components/vdom/patch/patch-comp";

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
    path: "patch-events",
    component: PatchEvents
  },
  {
    path: "patch-portal",
    component: PatchPortal
  },
  {
    path: "patch-fragment",
    component: PatchFragment
  },
  {
    path: "patch-comp",
    component: PatchComp
  }
];
