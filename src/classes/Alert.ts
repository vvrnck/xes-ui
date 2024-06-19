import { toast } from "sonner";
import { ALERT_ERROR, ALERT_SUCCESS, ALERT_WARNING } from "@/constants/alerts";
import { getMessages } from "@/libs/i18n/i18n-config";

export default class Alert {
    constructor() {
        this.alert = this.alert.bind(this);
    };

    async alert(type = ALERT_ERROR, key : string) : Promise<void> {
        const [_, locale] = window.location.pathname.split("/");
        
        const messages = await getMessages(locale);

        if (type === ALERT_ERROR) toast.error(messages.errors[key]);
        if (type === ALERT_WARNING) toast.warning(messages.warning[key]);
        if (type === ALERT_SUCCESS) toast.success(messages.success[key]);
    }
}