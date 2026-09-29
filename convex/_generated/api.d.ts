/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as academicAiImporter from "../academicAiImporter.js";
import type * as academicAlerts from "../academicAlerts.js";
import type * as academicManagement from "../academicManagement.js";
import type * as applications from "../applications.js";
import type * as auth from "../auth.js";
import type * as campusLife from "../campusLife.js";
import type * as credentials from "../credentials.js";
import type * as discussions from "../discussions.js";
import type * as emails from "../emails.js";
import type * as examSeating from "../examSeating.js";
import type * as finance from "../finance.js";
import type * as lms from "../lms.js";
import type * as notifications from "../notifications.js";
import type * as programs from "../programs.js";
import type * as storage from "../storage.js";
import type * as users from "../users.js";
import type * as videos from "../videos.js";
import type * as website from "../website.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  academicAiImporter: typeof academicAiImporter;
  academicAlerts: typeof academicAlerts;
  academicManagement: typeof academicManagement;
  applications: typeof applications;
  auth: typeof auth;
  campusLife: typeof campusLife;
  credentials: typeof credentials;
  discussions: typeof discussions;
  emails: typeof emails;
  examSeating: typeof examSeating;
  finance: typeof finance;
  lms: typeof lms;
  notifications: typeof notifications;
  programs: typeof programs;
  storage: typeof storage;
  users: typeof users;
  videos: typeof videos;
  website: typeof website;
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
