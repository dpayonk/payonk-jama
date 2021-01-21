import Loadable from "@loadable/component"
// these two libraries are client-side only
const LoadableAuthForm = Loadable(() => import("./client_components/AuthForm"))
const LoadableFeedViewer = Loadable(() => import("./client_components/feed/FeedViewer"))
const LoadableDebugToolbar = Loadable(() => import("./client_components/dev_tools/DebugToolbar"))

// Third party wrappers
const LoadableFilerobotImageEditor = Loadable(() => import('filerobot-image-editor'));

export { 
    LoadableFeedViewer, 
    LoadableAuthForm, 
    LoadableFilerobotImageEditor,
    LoadableDebugToolbar
}