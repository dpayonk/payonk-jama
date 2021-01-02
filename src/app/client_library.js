import Loadable from "@loadable/component"

// these two libraries are client-side only

const LoadableCliqueViewer = Loadable(() => import("./CliqueViewer"))

export default LoadableCliqueViewer