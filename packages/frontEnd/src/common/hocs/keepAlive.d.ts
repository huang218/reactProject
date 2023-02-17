export interface tabsType { 
  [keys: string]: {
    key?: string;
    state: any;
    pathname: string;
    search: string;
    hash: string;
  } 
}