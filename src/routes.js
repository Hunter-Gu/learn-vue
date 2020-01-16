import Home from "@/components/home";
import RenderPlainText from "@/components/vdom/render-plain-text";
import RenderHTMLElement from "@/components/vdom/render-html-element";
import RenderComp from "@/components/vdom/render-comp";
import RenderFragment from "@/components/vdom/render-fragment";
import RenderPortal from "@/components/vdom/render-portal";
import RenderClassName from "@/components/vdom/render-classname";
import RenderAttrs from "@/components/vdom/render-attrs";
import RenderProps from "@/components/vdom/render-props";
import RenderStyle from "@/components/vdom/render-style";
import RenderEvents from "@/components/vdom/render-events";
import RenderChildren from "@/components/vdom/render-children";

export const RENDER_PLAIN_TEXT = "/example/render-plain-text";
export const RENDER_HTML_ELEMENT = "/example/render-html-element";
export const RENDER_COMP = "/example/render-comp";
export const RENDER_FRAGMENT = "/example/render-fragment";
export const RENDER_PORTAL = "/example/render-portal";
export const RENDER_CLASSNAME = "/example/render-classname";
export const RENDER_ATTRS = "/example/render-attrs";
export const RENDER_PROPS = "/example/render-props";
export const RENDER_STYLE = "/example/render-style";
export const RENDER_EVENTS = "/example/render-events";
export const RENDER_CHILDREN = "/example/render-children";

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
    path: RENDER_FRAGMENT,
    component: RenderFragment
  },
  {
    path: RENDER_PORTAL,
    component: RenderPortal
  },
  {
    path: RENDER_CLASSNAME,
    component: RenderClassName
  },
  {
    path: RENDER_ATTRS,
    component: RenderAttrs
  },
  {
    path: RENDER_PROPS,
    component: RenderProps
  },
  {
    path: RENDER_STYLE,
    component: RenderStyle
  },
  {
    path: RENDER_EVENTS,
    component: RenderEvents
  },
  {
    path: RENDER_CHILDREN,
    component: RenderChildren
  }
];
