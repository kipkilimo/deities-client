/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

/// <reference types="unplugin-vue-router/client" />

import type {
  // type safe route locations
  RouteLocationTypedList,
  RouteLocationResolvedTypedList,
  RouteLocationNormalizedTypedList,
  RouteLocationNormalizedLoadedTypedList,
  RouteLocationAsString,
  RouteLocationAsRelativeTypedList,
  RouteLocationAsPathTypedList,

  // helper types
  // route definitions
  RouteRecordInfo,
  ParamValue,
  ParamValueOneOrMore,
  ParamValueZeroOrMore,
  ParamValueZeroOrOne,

  // vue-router extensions
  _RouterTyped,
  RouterLinkTyped,
  RouterLinkPropsTyped,
  NavigationGuard,
  UseLinkFnTyped,

  // data fetching
  _DataLoader,
  _DefineLoaderOptions,
} from 'unplugin-vue-router/types'

declare module 'vue-router/auto/routes' {
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/[...all]': RouteRecordInfo<'/[...all]', '/:all(.*)', { all: ParamValue<true> }, { all: ParamValue<false> }>,
    '/About': RouteRecordInfo<'/About', '/About', Record<never, never>, Record<never, never>>,
    '/auth/activate': RouteRecordInfo<'/auth/activate', '/auth/activate', Record<never, never>, Record<never, never>>,
    '/auth/forgot': RouteRecordInfo<'/auth/forgot', '/auth/forgot', Record<never, never>, Record<never, never>>,
    '/auth/login': RouteRecordInfo<'/auth/login', '/auth/login', Record<never, never>, Record<never, never>>,
    '/auth/register': RouteRecordInfo<'/auth/register', '/auth/register', Record<never, never>, Record<never, never>>,
    '/auth/reset': RouteRecordInfo<'/auth/reset', '/auth/reset', Record<never, never>, Record<never, never>>,
    '/dashboard/my-account/': RouteRecordInfo<'/dashboard/my-account/', '/dashboard/my-account', Record<never, never>, Record<never, never>>,
    '/dashboard/my-account/AccountSummary': RouteRecordInfo<'/dashboard/my-account/AccountSummary', '/dashboard/my-account/AccountSummary', Record<never, never>, Record<never, never>>,
    '/dashboard/my-account/AdminDashboardItems': RouteRecordInfo<'/dashboard/my-account/AdminDashboardItems', '/dashboard/my-account/AdminDashboardItems', Record<never, never>, Record<never, never>>,
    '/dashboard/player/': RouteRecordInfo<'/dashboard/player/', '/dashboard/player', Record<never, never>, Record<never, never>>,
    '/dashboard/services/': RouteRecordInfo<'/dashboard/services/', '/dashboard/services', Record<never, never>, Record<never, never>>,
    '/dashboard/services/components/Administrative': RouteRecordInfo<'/dashboard/services/components/Administrative', '/dashboard/services/components/Administrative', Record<never, never>, Record<never, never>>,
    '/dashboard/services/components/CashOffice': RouteRecordInfo<'/dashboard/services/components/CashOffice', '/dashboard/services/components/CashOffice', Record<never, never>, Record<never, never>>,
    '/dashboard/services/components/Clinical': RouteRecordInfo<'/dashboard/services/components/Clinical', '/dashboard/services/components/Clinical', Record<never, never>, Record<never, never>>,
    '/dashboard/services/components/Laboratory': RouteRecordInfo<'/dashboard/services/components/Laboratory', '/dashboard/services/components/Laboratory', Record<never, never>, Record<never, never>>,
    '/dashboard/services/components/Nursing': RouteRecordInfo<'/dashboard/services/components/Nursing', '/dashboard/services/components/Nursing', Record<never, never>, Record<never, never>>,
    '/dashboard/services/components/Records': RouteRecordInfo<'/dashboard/services/components/Records', '/dashboard/services/components/Records', Record<never, never>, Record<never, never>>,
    '/donate/': RouteRecordInfo<'/donate/', '/donate', Record<never, never>, Record<never, never>>,
    '/terminal/': RouteRecordInfo<'/terminal/', '/terminal', Record<never, never>, Record<never, never>>,
    '/terminal/components/Terminal': RouteRecordInfo<'/terminal/components/Terminal', '/terminal/components/Terminal', Record<never, never>, Record<never, never>>,
    '/welcome/': RouteRecordInfo<'/welcome/', '/welcome', Record<never, never>, Record<never, never>>,
    '/welcome/components/Features/': RouteRecordInfo<'/welcome/components/Features/', '/welcome/components/Features', Record<never, never>, Record<never, never>>,
    '/welcome/components/Features/FeatureCard': RouteRecordInfo<'/welcome/components/Features/FeatureCard', '/welcome/components/Features/FeatureCard', Record<never, never>, Record<never, never>>,
    '/welcome/components/hero/Hero': RouteRecordInfo<'/welcome/components/hero/Hero', '/welcome/components/hero/Hero', Record<never, never>, Record<never, never>>,
  }
}

declare module 'vue-router/auto' {
  import type { RouteNamedMap } from 'vue-router/auto/routes'

  export type RouterTyped = _RouterTyped<RouteNamedMap>

  /**
   * Type safe version of `RouteLocationNormalized` (the type of `to` and `from` in navigation guards).
   * Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationNormalized<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationNormalizedTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocationNormalizedLoaded` (the return type of `useRoute()`).
   * Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationNormalizedLoaded<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationNormalizedLoadedTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocationResolved` (the returned route of `router.resolve()`).
   * Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationResolved<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationResolvedTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocation` . Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocation<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocationRaw` . Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationRaw<Name extends keyof RouteNamedMap = keyof RouteNamedMap> =
    | RouteLocationAsString<RouteNamedMap>
    | RouteLocationAsRelativeTypedList<RouteNamedMap>[Name]
    | RouteLocationAsPathTypedList<RouteNamedMap>[Name]

  /**
   * Generate a type safe params for a route location. Requires the name of the route to be passed as a generic.
   */
  export type RouteParams<Name extends keyof RouteNamedMap> = RouteNamedMap[Name]['params']
  /**
   * Generate a type safe raw params for a route location. Requires the name of the route to be passed as a generic.
   */
  export type RouteParamsRaw<Name extends keyof RouteNamedMap> = RouteNamedMap[Name]['paramsRaw']

  export function useRouter(): RouterTyped
  export function useRoute<Name extends keyof RouteNamedMap = keyof RouteNamedMap>(name?: Name): RouteLocationNormalizedLoadedTypedList<RouteNamedMap>[Name]

  export const useLink: UseLinkFnTyped<RouteNamedMap>

  export function onBeforeRouteLeave(guard: NavigationGuard<RouteNamedMap>): void
  export function onBeforeRouteUpdate(guard: NavigationGuard<RouteNamedMap>): void

  export const RouterLink: RouterLinkTyped<RouteNamedMap>
  export const RouterLinkProps: RouterLinkPropsTyped<RouteNamedMap>

  // Experimental Data Fetching

  export function defineLoader<
    P extends Promise<any>,
    Name extends keyof RouteNamedMap = keyof RouteNamedMap,
    isLazy extends boolean = false,
  >(
    name: Name,
    loader: (route: RouteLocationNormalizedLoaded<Name>) => P,
    options?: _DefineLoaderOptions<isLazy>,
  ): _DataLoader<Awaited<P>, isLazy>
  export function defineLoader<
    P extends Promise<any>,
    isLazy extends boolean = false,
  >(
    loader: (route: RouteLocationNormalizedLoaded) => P,
    options?: _DefineLoaderOptions<isLazy>,
  ): _DataLoader<Awaited<P>, isLazy>

  export {
    _definePage as definePage,
    _HasDataLoaderMeta as HasDataLoaderMeta,
    _setupDataFetchingGuard as setupDataFetchingGuard,
    _stopDataFetchingScope as stopDataFetchingScope,
  } from 'unplugin-vue-router/runtime'
}

declare module 'vue-router' {
  import type { RouteNamedMap } from 'vue-router/auto/routes'

  export interface TypesConfig {
    beforeRouteUpdate: NavigationGuard<RouteNamedMap>
    beforeRouteLeave: NavigationGuard<RouteNamedMap>

    $route: RouteLocationNormalizedLoadedTypedList<RouteNamedMap>[keyof RouteNamedMap]
    $router: _RouterTyped<RouteNamedMap>

    RouterLink: RouterLinkTyped<RouteNamedMap>
  }
}
