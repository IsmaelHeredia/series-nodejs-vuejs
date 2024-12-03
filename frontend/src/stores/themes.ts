import { defineStore } from 'pinia';

export const themes = defineStore('themes', {
    state: () => ({
        mode: 2, // 1 = Light : 2 = Dark
        themeName: "customDarkTheme"
    }),
    actions: {
        toogle() {

            var newMode = 0;
            var newThemeName = "";

            if(this.mode == 1) {
                newMode = 2;
                newThemeName = "customDarkTheme";
            } else {
                newMode = 1;
                newThemeName = "light";
            }

            this.mode = newMode;
            this.themeName = newThemeName; 
        }
    }
});