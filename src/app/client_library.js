import Loadable from "@loadable/component"

// these two libraries are client-side only

const LoadableAuthForm = Loadable(() => import("./AuthForm"))
const LoadableAuthService = Loadable(() => import("./AuthService"))
const LoadableCliqueViewer = Loadable(() => import("./CliqueViewer"))


export { LoadableCliqueViewer, LoadableAuthForm, LoadableAuthService}