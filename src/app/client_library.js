import Loadable from "@loadable/component"

// these two libraries are client-side only

const LoadableAuthForm = Loadable(() => import("./client/AuthForm"))
const LoadableAuthService = Loadable(() => import("./client/services/AuthService"))
const LoadableCliqueViewer = Loadable(() => import("./client/CliqueViewer"))


export { LoadableCliqueViewer, LoadableAuthForm, LoadableAuthService}