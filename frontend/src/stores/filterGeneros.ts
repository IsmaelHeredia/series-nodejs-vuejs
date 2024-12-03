import { defineStore } from 'pinia';

export const filterGenerosStore = defineStore('filterGeneros', {
    state: () => ({
        nombre: ""
    }),
    actions: {
        setNombre(nombre: string) {
            this.nombre = nombre;
        }
    }
});