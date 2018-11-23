export interface IRedirectAttributes {
    from?: string;
    to:    string;
}

export const Redirect = (a: IRedirectAttributes): string => {
    history.replaceState(a.from || window.location.pathname, "", a.to);
    return "";
};
