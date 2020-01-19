import Home from "@/components/home";
import Child from "@/components/child";
import RenderRoute from "@/routes/render.route";

export default [
  {
    path: "",
    component: Home
  },
  {
    path: "/example/render/",
    component: Child,
    children: RenderRoute
  }
];
