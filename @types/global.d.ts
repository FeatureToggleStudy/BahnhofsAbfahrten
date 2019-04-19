namespace NodeJS {
  interface Global {
    PROD: boolean;
    SERVER: boolean;
    smallScreen: boolean;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: Function;
    __DATA__: Object;
  }
}

type Features = {
  'google-analytics': boolean;
  routing: boolean;
  auslastungsradar: boolean;
};

type ExcludesFalse = <T>(x: T | undefined | null | false) => x is T;