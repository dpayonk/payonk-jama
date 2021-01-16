import Loadable from "@loadable/component"
// these two libraries are client-side only
const LoadableAuthForm = Loadable(() => import("./client/AuthForm"))
const LoadableFeedViewer = Loadable(() => import("./client/FeedViewer"))
const LoadableUserModel = Loadable(() => import("./models/UserModel"))

// Third party wrappers
const LoadableFilerobotImageEditor = Loadable(() => import('filerobot-image-editor'));

export { 
    LoadableFeedViewer, 
    LoadableAuthForm, 
    LoadableUserModel, 
    LoadableFilerobotImageEditor
}