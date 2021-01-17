import Loadable from "@loadable/component"
// these two libraries are client-side only
const LoadableAuthForm = Loadable(() => import("./client_components/AuthForm"))
const LoadableFeedViewer = Loadable(() => import("./client_components/FeedViewer"))

// Third party wrappers
const LoadableFilerobotImageEditor = Loadable(() => import('filerobot-image-editor'));

export { 
    LoadableFeedViewer, 
    LoadableAuthForm, 
    LoadableFilerobotImageEditor
}