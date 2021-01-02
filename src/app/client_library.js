import Loadable from "@loadable/component"

// these two libraries are client-side only

const LoadableCliqueViewer = Loadable(() => import("./CliqueViewer"))

const LoadableAuthForm = Loadable(() => import("./AuthForm"))

export { LoadableCliqueViewer, LoadableAuthForm}