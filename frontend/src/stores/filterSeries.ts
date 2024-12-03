import { defineStore } from 'pinia';

export const filterSeriesStore = defineStore('filterSeries', {
    state: () => ({
        nombre: "",
        generos: [] as any,
        estado: 0
    }),
    actions: {
        setNombre(nombre: string) {
            this.nombre = nombre;
        },
        setGeneros(generos: any[] = []) {
            this.generos = generos;
        },
        setEstado(estado: number) {
            this.estado = estado;
        }
    }
});