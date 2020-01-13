import Home from "@/components/home";
import RenderHTMLElement from "@/components/render-html-element.vue";
import RenderComp from "@/components/render-comp";

export const RENDER_HTML_ELEMENT = "/test/render-html-element";
export const RENDER_COMP = "/test/render-comp";

export default [
  {
    path: "",
    component: Home
  },
  {
    path: RENDER_HTML_ELEMENT,
    component: RenderHTMLElement
  },
  {
    path: RENDER_COMP,
    component: RenderComp
  }
];
