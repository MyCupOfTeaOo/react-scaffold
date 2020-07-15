import { GRoute } from '@/typings';

/* eslint-disable no-undef */
declare global {
  type ToAny<T> = {
    [P in keyof T]: any;
  };
  interface RouteConfig {
    path: string;
    isMenu?: boolean;
    component?: string;
    title?: string;
    menuId?: string;
    exact?: boolean;
    params?: { [key: string]: any };
    routes?: RouteConfig[];
  }
  interface PageConfig {
    menuId: string;
    isMenu?: boolean;
    component?: string;
    exact?: boolean;
    routes?: RouteConfig[];
  }
  interface Window
    extends EventTarget,
      WindowSessionStorage,
      WindowLocalStorage,
      GlobalEventHandlers,
      AnimationFrameProvider,
      WindowOrWorkerGlobalScope,
      WindowEventHandlers {
    oldRender: Function;
    g_routes: GRoute[];
    readonly applicationCache: ApplicationCache;
    readonly caches: CacheStorage;
    readonly clientInformation: Navigator;
    readonly closed: boolean;
    readonly crypto: Crypto;
    customElements: CustomElementRegistry;
    defaultStatus: string;
    readonly devicePixelRatio: number;
    readonly doNotTrack: string;
    readonly document: Document;
    /** @deprecated */
    readonly event: Event | undefined;
    /** @deprecated */
    readonly external: External;
    readonly frameElement: Element;
    readonly frames: Window;
    readonly history: History;
    readonly innerHeight: number;
    readonly innerWidth: number;
    readonly isSecureContext: boolean;
    readonly length: number;
    location: Location;
    readonly locationbar: BarProp;
    readonly menubar: BarProp;
    readonly msContentScript: ExtensionScriptApis;
    name: string;
    readonly navigator: Navigator;
    offscreenBuffering: string | boolean;
    oncompassneedscalibration: ((this: Window, ev: Event) => any) | null;
    ondevicelight: ((this: Window, ev: DeviceLightEvent) => any) | null;
    ondevicemotion: ((this: Window, ev: DeviceMotionEvent) => any) | null;
    ondeviceorientation:
      | ((this: Window, ev: DeviceOrientationEvent) => any)
      | null;
    ondeviceorientationabsolute:
      | ((this: Window, ev: DeviceOrientationEvent) => any)
      | null;
    onmousewheel: ((this: Window, ev: Event) => any) | null;
    onmsgesturechange: ((this: Window, ev: Event) => any) | null;
    onmsgesturedoubletap: ((this: Window, ev: Event) => any) | null;
    onmsgestureend: ((this: Window, ev: Event) => any) | null;
    onmsgesturehold: ((this: Window, ev: Event) => any) | null;
    onmsgesturestart: ((this: Window, ev: Event) => any) | null;
    onmsgesturetap: ((this: Window, ev: Event) => any) | null;
    onmsinertiastart: ((this: Window, ev: Event) => any) | null;
    onmspointercancel: ((this: Window, ev: Event) => any) | null;
    onmspointerdown: ((this: Window, ev: Event) => any) | null;
    onmspointerenter: ((this: Window, ev: Event) => any) | null;
    onmspointerleave: ((this: Window, ev: Event) => any) | null;
    onmspointermove: ((this: Window, ev: Event) => any) | null;
    onmspointerout: ((this: Window, ev: Event) => any) | null;
    onmspointerover: ((this: Window, ev: Event) => any) | null;
    onmspointerup: ((this: Window, ev: Event) => any) | null;
    /** @deprecated */
    onorientationchange: ((this: Window, ev: Event) => any) | null;
    onreadystatechange:
      | ((this: Window, ev: ProgressEvent<Window>) => any)
      | null;
    onvrdisplayactivate: ((this: Window, ev: Event) => any) | null;
    onvrdisplayblur: ((this: Window, ev: Event) => any) | null;
    onvrdisplayconnect: ((this: Window, ev: Event) => any) | null;
    onvrdisplaydeactivate: ((this: Window, ev: Event) => any) | null;
    onvrdisplaydisconnect: ((this: Window, ev: Event) => any) | null;
    onvrdisplayfocus: ((this: Window, ev: Event) => any) | null;
    onvrdisplaypointerrestricted: ((this: Window, ev: Event) => any) | null;
    onvrdisplaypointerunrestricted: ((this: Window, ev: Event) => any) | null;
    onvrdisplaypresentchange: ((this: Window, ev: Event) => any) | null;
    opener: any;
    /** @deprecated */
    readonly orientation: string | number;
    readonly outerHeight: number;
    readonly outerWidth: number;
    readonly pageXOffset: number;
    readonly pageYOffset: number;
    readonly parent: Window;
    readonly performance: Performance;
    readonly personalbar: BarProp;
    readonly screen: Screen;
    readonly screenLeft: number;
    readonly screenTop: number;
    readonly screenX: number;
    readonly screenY: number;
    readonly scrollX: number;
    readonly scrollY: number;
    readonly scrollbars: BarProp;
    readonly self: Window & typeof globalThis;
    readonly speechSynthesis: SpeechSynthesis;
    status: string;
    readonly statusbar: BarProp;
    readonly styleMedia: StyleMedia;
    readonly toolbar: BarProp;
    readonly top: Window;
    readonly window: Window & typeof globalThis;
    alert(message?: any): void;
    blur(): void;
    /** @deprecated */
    captureEvents(): void;
    close(): void;
    confirm(message?: string): boolean;
    departFocus(
      navigationReason: NavigationReason,
      origin: FocusNavigationOrigin,
    ): void;
    focus(): void;
    getComputedStyle(
      elt: Element,
      pseudoElt?: string | null,
    ): CSSStyleDeclaration;
    getMatchedCSSRules(elt: Element, pseudoElt?: string | null): CSSRuleList;
    getSelection(): Selection | null;
    matchMedia(query: string): MediaQueryList;
    moveBy(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    msWriteProfilerMark(profilerMarkName: string): void;
    open(
      url?: string,
      target?: string,
      features?: string,
      replace?: boolean,
    ): Window | null;
    postMessage(
      message: any,
      targetOrigin: string,
      transfer?: Transferable[],
    ): void;
    print(): void;
    prompt(message?: string, _default?: string): string | null;
    /** @deprecated */
    releaseEvents(): void;
    resizeBy(x: number, y: number): void;
    resizeTo(x: number, y: number): void;
    scroll(options?: ScrollToOptions): void;
    scroll(x: number, y: number): void;
    scrollBy(options?: ScrollToOptions): void;
    scrollBy(x: number, y: number): void;
    scrollTo(options?: ScrollToOptions): void;
    scrollTo(x: number, y: number): void;
    stop(): void;
    webkitCancelAnimationFrame(handle: number): void;
    webkitConvertPointFromNodeToPage(node: Node, pt: WebKitPoint): WebKitPoint;
    webkitConvertPointFromPageToNode(node: Node, pt: WebKitPoint): WebKitPoint;
    webkitRequestAnimationFrame(callback: FrameRequestCallback): number;
    addEventListener<K extends keyof WindowEventMap>(
      type: K,
      listener: (this: Window, ev: WindowEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof WindowEventMap>(
      type: K,
      listener: (this: Window, ev: WindowEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void;
    [index: number]: Window;
  }
}
