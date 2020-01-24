import Home from "@/components/home";
import Child from "@/components/child";
import RenderRoute from "@/routes/render.route";
import PatchRoute from "@/routes/patch.route";
import DiffRoute from "@/routes/diff.route";

export default [
  {
    path: "",
    component: Home
  },
  {
    path: "/example/render/",
    component: Child,
    children: RenderRoute
  },
  {
    path: "/example/patch/",
    component: Child,
    children: PatchRoute
  },
  {
    path: "/example/diff/",
    component: Child,
    children: DiffRoute
  }
];
