import RenderPlainText from "@/components/vdom/render/render-plain-text";
import RenderHTMLElement from "@/components/vdom/render/render-html-element";
import RenderComp from "@/components/vdom/render/render-comp";
import RenderFunctionalComp from "@/components/vdom/render/render-functional-comp";
import RenderFragment from "@/components/vdom/render/render-fragment";
import RenderPortal from "@/components/vdom/render/render-portal";
import RenderClassName from "@/components/vdom/render/render-classname";
import RenderAttrs from "@/components/vdom/render/render-attrs";
import RenderProps from "@/components/vdom/render/render-props";
import RenderStyle from "@/components/vdom/render/render-style";
import RenderEvents from "@/components/vdom/render/render-events";
import RenderChildren from "@/components/vdom/render/render-children";

export const RENDER_PLAIN_TEXT = "render-plain-text";
export const RENDER_HTML_ELEMENT = "render-html-element";
export const RENDER_COMP = "render-comp";
export const RENDER_FUNCTIONAL_COMP = "render-functional-comp";
export const RENDER_FRAGMENT = "render-fragment";
export const RENDER_PORTAL = "render-portal";
export const RENDER_CLASSNAME = "render-classname";
export const RENDER_ATTRS = "render-attrs";
export const RENDER_PROPS = "render-props";
export const RENDER_STYLE = "render-style";
export const RENDER_EVENTS = "render-events";
export const RENDER_CHILDREN = "render-children";

export default [
  {
    path: RENDER_HTML_ELEMENT,
    component: RenderHTMLElement
  },
  {
    path: RENDER_COMP,
    component: RenderComp
  },
  {
    path: RENDER_FUNCTIONAL_COMP,
    component: RenderFunctionalComp
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
