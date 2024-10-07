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
    '/assignment/participant/': RouteRecordInfo<'/assignment/participant/', '/assignment/participant', Record<never, never>, Record<never, never>>,
    '/assignment/presenter/': RouteRecordInfo<'/assignment/presenter/', '/assignment/presenter', Record<never, never>, Record<never, never>>,
    '/auth/activate': RouteRecordInfo<'/auth/activate', '/auth/activate', Record<never, never>, Record<never, never>>,
    '/auth/forgot': RouteRecordInfo<'/auth/forgot', '/auth/forgot', Record<never, never>, Record<never, never>>,
    '/auth/login': RouteRecordInfo<'/auth/login', '/auth/login', Record<never, never>, Record<never, never>>,
    '/auth/register': RouteRecordInfo<'/auth/register', '/auth/register', Record<never, never>, Record<never, never>>,
    '/auth/reset': RouteRecordInfo<'/auth/reset', '/auth/reset', Record<never, never>, Record<never, never>>,
    '/dashboard/analysis/': RouteRecordInfo<'/dashboard/analysis/', '/dashboard/analysis', Record<never, never>, Record<never, never>>,
    '/dashboard/computing/': RouteRecordInfo<'/dashboard/computing/', '/dashboard/computing', Record<never, never>, Record<never, never>>,
    '/dashboard/consults/': RouteRecordInfo<'/dashboard/consults/', '/dashboard/consults', Record<never, never>, Record<never, never>>,
    '/dashboard/customers/': RouteRecordInfo<'/dashboard/customers/', '/dashboard/customers', Record<never, never>, Record<never, never>>,
    '/dashboard/events/': RouteRecordInfo<'/dashboard/events/', '/dashboard/events', Record<never, never>, Record<never, never>>,
    '/dashboard/help/': RouteRecordInfo<'/dashboard/help/', '/dashboard/help', Record<never, never>, Record<never, never>>,
    '/dashboard/inventory/': RouteRecordInfo<'/dashboard/inventory/', '/dashboard/inventory', Record<never, never>, Record<never, never>>,
    '/dashboard/library/': RouteRecordInfo<'/dashboard/library/', '/dashboard/library', Record<never, never>, Record<never, never>>,
    '/dashboard/overview/': RouteRecordInfo<'/dashboard/overview/', '/dashboard/overview', Record<never, never>, Record<never, never>>,
    '/dashboard/overview/ChartLines': RouteRecordInfo<'/dashboard/overview/ChartLines', '/dashboard/overview/ChartLines', Record<never, never>, Record<never, never>>,
    '/dashboard/paper/': RouteRecordInfo<'/dashboard/paper/', '/dashboard/paper', Record<never, never>, Record<never, never>>,
    '/dashboard/papers/': RouteRecordInfo<'/dashboard/papers/', '/dashboard/papers', Record<never, never>, Record<never, never>>,
    '/dashboard/player/': RouteRecordInfo<'/dashboard/player/', '/dashboard/player', Record<never, never>, Record<never, never>>,
    '/dashboard/poll/': RouteRecordInfo<'/dashboard/poll/', '/dashboard/poll', Record<never, never>, Record<never, never>>,
    '/dashboard/poster/': RouteRecordInfo<'/dashboard/poster/', '/dashboard/poster', Record<never, never>, Record<never, never>>,
    '/dashboard/programming/': RouteRecordInfo<'/dashboard/programming/', '/dashboard/programming', Record<never, never>, Record<never, never>>,
    '/dashboard/settings/': RouteRecordInfo<'/dashboard/settings/', '/dashboard/settings', Record<never, never>, Record<never, never>>,
    '/dashboard/task/': RouteRecordInfo<'/dashboard/task/', '/dashboard/task', Record<never, never>, Record<never, never>>,
    '/dashboard/tasks/': RouteRecordInfo<'/dashboard/tasks/', '/dashboard/tasks', Record<never, never>, Record<never, never>>,
    '/exam/participant/': RouteRecordInfo<'/exam/participant/', '/exam/participant', Record<never, never>, Record<never, never>>,
    '/exam/presenter/': RouteRecordInfo<'/exam/presenter/', '/exam/presenter', Record<never, never>, Record<never, never>>,
    '/mis_data_disp/MisStations': RouteRecordInfo<'/mis_data_disp/MisStations', '/mis_data_disp/MisStations', Record<never, never>, Record<never, never>>,
    '/paper/participant/': RouteRecordInfo<'/paper/participant/', '/paper/participant', Record<never, never>, Record<never, never>>,
    '/paper/presenter/': RouteRecordInfo<'/paper/presenter/', '/paper/presenter', Record<never, never>, Record<never, never>>,
    '/poll/participant/': RouteRecordInfo<'/poll/participant/', '/poll/participant', Record<never, never>, Record<never, never>>,
    '/poll/presenter/': RouteRecordInfo<'/poll/presenter/', '/poll/presenter', Record<never, never>, Record<never, never>>,
    '/vendors/': RouteRecordInfo<'/vendors/', '/vendors', Record<never, never>, Record<never, never>>,
    '/vendors/auth/': RouteRecordInfo<'/vendors/auth/', '/vendors/auth', Record<never, never>, Record<never, never>>,
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
