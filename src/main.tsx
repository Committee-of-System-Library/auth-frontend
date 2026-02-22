import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { getRedirectToCanonicalOriginUrl } from "@/shared/utils/oauth"

const canonicalRedirect = getRedirectToCanonicalOriginUrl()
if (canonicalRedirect) {
  window.location.replace(canonicalRedirect)
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}