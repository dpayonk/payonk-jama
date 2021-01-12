import Loadable from "@loadable/component"
// these two libraries are client-side only
const LoadableAuthForm = Loadable(() => import("./client/AuthForm"))
const LoadableFeedViewer = Loadable(() => import("./client/FeedViewer"))
const LoadableComments = Loadable(() => import("./client/Comments"))
const LoadableUserModel = Loadable(() => import("./client/UserModel"))

export { LoadableFeedViewer, LoadableAuthForm, LoadableComments, LoadableUserModel}