/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_models from "../actions/models.js";
import type * as auth from "../auth.js";
import type * as mutations_conversations from "../mutations/conversations.js";
import type * as mutations_messages from "../mutations/messages.js";
import type * as queries_conversations from "../queries/conversations.js";
import type * as queries_messages from "../queries/messages.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/models": typeof actions_models;
  auth: typeof auth;
  "mutations/conversations": typeof mutations_conversations;
  "mutations/messages": typeof mutations_messages;
  "queries/conversations": typeof queries_conversations;
  "queries/messages": typeof queries_messages;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
