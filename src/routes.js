import Home from "@/components/home";
import RenderHTMLElement from "@/components/render-html-element.vue";

export const RENDER_HTML_ELEMENT = "/test/render-html-element";

export default [
  {
    path: "",
    component: Home
  },
  {
    path: RENDER_HTML_ELEMENT,
    component: RenderHTMLElement
  }
];
