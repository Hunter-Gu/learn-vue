import Home from "@/components/home";
import RenderPlainText from "@/components/render-plain-text";
import RenderHTMLElement from "@/components/render-html-element";
import RenderComp from "@/components/render-comp";
import RenderFragment from "@/components/render-fragment";
import RenderPortal from "@/components/render-portal";

export const RENDER_PLAIN_TEXT = "/text/render-plain-text";
export const RENDER_HTML_ELEMENT = "/test/render-html-element";
export const RENDER_COMP = "/test/render-comp";
export const REDNER_FRAGMENT = "/test/render-fragment";
export const REDNER_PORTAL = "/test/render-portal";

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
  },
  {
    path: RENDER_PLAIN_TEXT,
    component: RenderPlainText
  },
  {
    path: REDNER_FRAGMENT,
    component: RenderFragment
  },
  {
    path: REDNER_PORTAL,
    component: RenderPortal
  }
];
