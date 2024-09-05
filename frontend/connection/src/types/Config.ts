/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2024)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The lib config contains various configurations that the host platform can
 * use to configure streamlit-lib frontend behavior. This should to be treated as part of the public
 * API, and changes need to be backwards-compatible meaning that an old host configuration
 * should still work with a new frontend versions.
 */
export type LibConfig = {
  /**
   * the mapbox token that can be configured by a platform
   */
  mapboxToken?: string

  /**
   * Whether to disable the full screen mode all elements / widgets.
   */
  disableFullscreenMode?: boolean

  enforceDownloadInNewTab?: boolean
}

/**
 * The app config contains various configurations that the host platform can
 * use to configure streamlit-app frontend behavior. This should to be treated as part of the public
 * API, and changes need to be backwards-compatible meaning that an old host configuration
 * should still work with a new frontend versions.
 *
 * TODO(lukasmasuch): Potentially refactor HostCommunicationManager and move this type
 * to AppContext.tsx.
 */
export type AppConfig = {
  /**
   * A list of origins that we're allowed to receive cross-iframe messages
   * from via the browser's window.postMessage API.
   */
  allowedOrigins?: string[]
  /**
   * Whether to wait until we've received a SET_AUTH_TOKEN message before
   * resolving deferredAuthToken.promise. The WebsocketConnection class waits
   * for this promise to resolve before attempting to establish a connection
   * with the Streamlit server.
   */
  useExternalAuthToken?: boolean
  /**
   * Enables custom string messages to be sent to the host
   */
  enableCustomParentMessages?: boolean
}

/**
 * The response structure of the `_stcore/host-config` endpoint.
 * This combines streamlit-lib specific configuration options with
 * streamlit-app specific options (e.g. allowed message origins).
 */
export type IHostConfigResponse = LibConfig & AppConfig
