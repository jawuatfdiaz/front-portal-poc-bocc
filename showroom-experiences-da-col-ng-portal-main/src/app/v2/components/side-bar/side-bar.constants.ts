import { MenuOption } from "src/app/v2/models/menu.interface";

export const MENU_OPTIONS: MenuOption[] = [
    {
        url: "/catalogue",
        icon: "cases",
        text: "General catalogue"
    },
    {
        url: "/resource-management",
        icon: "add_circle",
        text: "Resource management",
    },
    {
        url: "/request-management",
        icon: "list_alt",
        text: "Request"
    },
    {
        url: "/inbox-management",
        icon: "inbox",
        text: "Inbox"
    },
]