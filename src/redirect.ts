
/** Attributes of the component `Redirect` */
export interface IRedirectAttributes {
    /** Current location string, optional */
    from?: string;
    /** String representing a new location */
    to:    string;
}

/** `Redirect` component. Rendering it will navigate to a new location */
export const Redirect = (a: IRedirectAttributes): string => {
    history.replaceState(a.from || window.location.pathname, "", a.to);
    return "";
};
