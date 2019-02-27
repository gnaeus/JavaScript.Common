import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { useFactory, useService, withProvider } from "./iocHooks";

describe("iocHooks", () => {
  const consoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = consoleError;
  });

  it("should inject factories", () => {
    function AppService() {
      return {};
    }

    function PageService(appService = useFactory(AppService)) {
      return { appService };
    }

    function WidgetService(
      appService = useFactory(AppService),
      pageService = useFactory(PageService)
    ) {
      return { appService, pageService };
    }

    let appProps: any, pageProps: any, widgetProps: any;

    let App = ({ appService = useFactory(AppService) }) => {
      if (appProps) {
        expect({ appService }).toEqual(appProps);
      } else {
        appProps = { appService };
      }

      return <Page />;
    };

    App = withProvider(AppService)(App);

    let Page = ({
      appService = useFactory(AppService),
      pageService = useFactory(PageService)
    }) => {
      if (pageProps) {
        expect({ appService, pageService }).toEqual(pageProps);
      } else {
        pageProps = { appService, pageService };
      }

      return <Widget />;
    };

    Page = withProvider(PageService)(Page);

    let Widget = ({
      appService = useFactory(AppService),
      pageService = useFactory(PageService),
      widgetService = useFactory(WidgetService)
    }) => {
      if (widgetProps) {
        expect({ appService, pageService, widgetService }).toEqual(widgetProps);
      } else {
        widgetProps = { appService, pageService, widgetService };
      }

      return null;
    };

    Widget = withProvider(WidgetService)(Widget);

    const div = document.createElement("div");

    act(() => {
      ReactDOM.render(<App />, div);
    });

    expect(appProps.appService).toBeDefined();
    expect(pageProps.appService).toBeDefined();
    expect(pageProps.pageService).toBeDefined();
    expect(widgetProps.appService).toBeDefined();
    expect(widgetProps.pageService).toBeDefined();
    expect(widgetProps.widgetService).toBeDefined();

    expect(pageProps.appService).toBe(appProps.appService);
    expect(widgetProps.appService).toBe(appProps.appService);
    expect(widgetProps.pageService).toBe(pageProps.pageService);
    expect(pageProps.pageService.appService).toBe(appProps.appService);
    expect(widgetProps.widgetService.appService).toBe(appProps.appService);
    expect(widgetProps.widgetService.pageService).toBe(pageProps.pageService);

    act(() => {
      ReactDOM.render(<App />, div);
    });

    act(() => {
      ReactDOM.unmountComponentAtNode(div);
    });
  });

  it("should inject services", () => {
    class AppService {}

    class PageService {
      constructor(public appService = useService(AppService)) {}
    }

    class WidgetService {
      constructor(
        public appService = useService(AppService),
        public pageService = useService(PageService)
      ) {}
    }

    let appProps: any, pageProps: any, widgetProps: any;

    let App = ({ appService = useService(AppService) }) => {
      if (appProps) {
        expect({ appService }).toEqual(appProps);
      } else {
        appProps = { appService };
      }

      return <Page />;
    };

    App = withProvider(AppService)(App);

    let Page = ({
      appService = useService(AppService),
      pageService = useService(PageService)
    }) => {
      if (pageProps) {
        expect({ appService, pageService }).toEqual(pageProps);
      } else {
        pageProps = { appService, pageService };
      }

      return <Widget />;
    };

    Page = withProvider(PageService)(Page);

    let Widget = ({
      appService = useService(AppService),
      pageService = useService(PageService),
      widgetService = useService(WidgetService)
    }) => {
      if (widgetProps) {
        expect({ appService, pageService, widgetService }).toEqual(widgetProps);
      } else {
        widgetProps = { appService, pageService, widgetService };
      }

      return null;
    };

    Widget = withProvider(WidgetService)(Widget);

    const div = document.createElement("div");

    act(() => {
      ReactDOM.render(<App />, div);
    });

    expect(appProps.appService).toBeDefined();
    expect(pageProps.appService).toBeDefined();
    expect(pageProps.pageService).toBeDefined();
    expect(widgetProps.appService).toBeDefined();
    expect(widgetProps.pageService).toBeDefined();
    expect(widgetProps.widgetService).toBeDefined();

    expect(pageProps.appService).toBe(appProps.appService);
    expect(widgetProps.appService).toBe(appProps.appService);
    expect(widgetProps.pageService).toBe(pageProps.pageService);
    expect(pageProps.pageService.appService).toBe(appProps.appService);
    expect(widgetProps.widgetService.appService).toBe(appProps.appService);
    expect(widgetProps.widgetService.pageService).toBe(pageProps.pageService);

    act(() => {
      ReactDOM.render(<App />, div);
    });

    act(() => {
      ReactDOM.unmountComponentAtNode(div);
    });
  });

  it("should pass explicit arguments to factory", () => {
    function AppService(foo: number, bar: string) {
      return { foo, bar };
    }

    let appService: any;

    let App = () => {
      appService = useFactory(AppService, [123, "test"]);

      return null;
    };

    App = withProvider(AppService)(App);

    const div = document.createElement("div");

    act(() => {
      ReactDOM.render(<App />, div);
    });

    expect(appService).toEqual({ foo: 123, bar: "test" });
  });

  it("should pass explicit arguments to service", () => {
    class AppService {
      constructor(public foo: number, public bar: string) {}
    }

    let appService: any;

    let App = () => {
      appService = useService(AppService, [123, "test"]);

      return null;
    };

    App = withProvider(AppService)(App);

    const div = document.createElement("div");

    act(() => {
      ReactDOM.render(<App />, div);
    });

    expect(appService).toEqual({ foo: 123, bar: "test" });
  });

  it("should throw if dependency is not registered", () => {
    class FooService {}

    // @ts-ignore
    let App = ({ fooService = useService(FooService) }) => {
      return null;
    };

    App = withProvider()(App);

    const div = document.createElement("div");

    expect(() => {
      act(() => {
        ReactDOM.render(<App />, div);
      });
    }).toThrowError(
      `Dependency ${FooService.name} is not registered in provider`
    );

    // one from JSDom and one from React
    expect(console.error).toBeCalledTimes(2);
  });

  it("should throw if internal dependency is not provided", () => {
    class FooService {}

    class BarService {
      constructor(public fooService = useService(FooService)) {}
    }

    expect(() => new BarService()).toThrowError(
      /Hooks can only be called inside the body of a function component/
    );
  });
});
