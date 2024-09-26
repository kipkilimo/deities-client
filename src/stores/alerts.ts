import { defineStore } from "pinia";

export const useAlertsStore = defineStore("alerts", {
  state: () => ({
    alertMessage: "",
    alertType: "", // e.g., 'success', 'error', 'info'
  }),
  actions: {
    setAlert(message: string, type: string) {
      this.alertMessage = message;
      this.alertType = type;
    },
  },
});
