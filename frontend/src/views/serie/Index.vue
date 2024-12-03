<script setup lang="ts">

import LayoutAdmin from "@/layouts/LayoutAdmin.vue";

import { toast } from 'vuetify-sonner';

import serieService from "@/services/series.service";
import generoService from "@/services/generos.service";
import estadosService from "@/services/estados.service";

import { mdiPlus, mdiPencil, mdiDelete, mdiClose, mdiMagnify } from '@mdi/js';
import { mdiArrowCollapseLeft, mdiArrowCollapseRight, mdiArrowLeft, mdiArrowRight } from '@mdi/js';

import { generateToast } from "@/utils/functions";

import { isProxy, toRaw } from 'vue';

import { filterSeriesStore } from '@/stores/filterSeries';

</script>

<template>
  <LayoutAdmin>

    <v-btn variant="elevated" type="submit" color="primary" class="boton-largo boton-agregar-serie"
      :to="{ name: 'guardarSerie' }"><v-icon :icon="mdiPlus" />
      Agregar serie</v-btn>

    <v-divider class="divider-series"></v-divider>

    <v-row class="center-div">
      <v-col cols="3">
        <v-text-field v-model="buscarNombre" label="Ingrese nombre" class="filtro-nombre" />
      </v-col>
      <v-col cols="3">
        <v-autocomplete clearable chips label="Géneros" v-model="generos" :items="generosLista" item-title="nombre"
          item-value="id" multiple>
          <template v-slot:chip="{ props, item, index }">
            <v-chip v-if="generos.length <= 3" v-bind="props" small>
              {{ item.title }}
            </v-chip>
            <span v-if="index === 1 && generos.length > 3">
              + 3 géneros seleccionados
            </span>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="2">
        <v-select label="Estado" :items="estados" item-title='nombre' item-value='id' v-model="estado_id"></v-select>
      </v-col>
      <v-col cols="4" style="display: inline-block;">
        <v-btn variant="elevated" type="submit" color="primary" class="boton-filtrar" @click="filtrarSeries"><v-icon
            :icon="mdiMagnify" />
          Filtrar</v-btn>
        <v-btn variant="elevated" type="submit" color="primary" class="boton-filtrar"
          @click="borrarFiltroSeries"><v-icon :icon="mdiClose" />
          Borrar</v-btn>
      </v-col>
    </v-row>

    <div class="datos-tabla">
      <v-table height="300px" fixed-header class="tabla-series">
        <thead>
          <tr>
            <th class="text-center">
              Nombre
            </th>
            <th class="text-center">
              Imagen
            </th>
            <th class="text-center">
              Progreso
            </th>
            <th class="text-center">
              Calificación
            </th>
            <th class="text-center">
              Estado
            </th>
            <th class="text-center">
              Géneros
            </th>
            <th class="text-center">
              Opción
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="serie in series" :key="serie.id">
            <td>{{ serie.nombre }}</td>
            <td>
              <img class="imagen" :src="images_url + '/' + serie.imagen" />
            </td>
            <td>{{ serie.ultima_temporada + ' - ' + serie.ultimo_capitulo }}</td>
            <td>
              <v-rating hover readonly :length="5" :size="32" :model-value="serie.calificacion"
                active-color="primary" />
            </td>
            <td>{{ serie.estado.nombre }}</td>
            <td>
              <v-chip v-for="genero_chip in serie.generos" :key="genero_chip.id" class="chip-genero">
                {{ genero_chip.nombre }}
              </v-chip>
            </td>
            <td>
              <v-btn class="boton-icono-tabla" density="compact" size="x-large" :icon="mdiPencil"
                :to="{ name: 'actualizarSerie', params: { id: serie.id } }"></v-btn>
              <v-btn class="boton-icono-tabla" density="compact" size="x-large" :icon="mdiDelete"
                @click="abrirModalBorrarSerie(serie.id)"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <div class="paginas-series">
      <div class="left-series">
        Página {{ actual }} / {{ paginas }}
      </div>
      <div class="right-series">
        <v-btn-toggle>
          <v-btn @click="handleClickAnteriorTodo" :disabled="actual == 1">
            <v-icon :icon="mdiArrowCollapseLeft" />
          </v-btn>

          <v-btn @click="handleClickAnterior" :disabled="actual == 1">
            <v-icon :icon="mdiArrowLeft" />
          </v-btn>

          <v-btn @click="handleClickSiguiente" :disabled="actual == paginas">
            <v-icon :icon="mdiArrowRight" />
          </v-btn>

          <v-btn @click="handleClickSiguienteTodo" :disabled="actual == paginas">
            <v-icon :icon="mdiArrowCollapseRight" />
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>

    <v-dialog v-model="dialog_delete" max-width="600">

      <v-card>
        <v-card-title class="headline black text-center" primary-title>
          Confirmación de eliminación
        </v-card-title>

        <v-card-text class="text-center">
          ¿ Desea borrar la serie {{ nombre }} ?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="center-div modal-actions">
          <v-btn class="boton-medio" variant="elevated" color="primary" @click="confirmarBorrarSerie"
            :disabled=isLoading><v-icon :icon="mdiDelete" />
            Borrar</v-btn>
          <v-btn class="boton-medio" variant="elevated" color="primary" @click="cerrarModalBorrarSerie"
            :disabled=isLoading><v-icon :icon="mdiClose" /> Cerrar</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>

  </LayoutAdmin>
</template>

<script lang="ts">

interface Serie {
  id: number;
  nombre: string;
  imagen: string;
  links: string;
  ultima_temporada: number;
  ultimo_capitulo: number;
  calificacion: number;
  estado_id: number;
  estado: any;
  generos: any;
}

export default {

  data: () => ({
    buscarNombre: "",
    total: 0,
    paginas: 0,
    actual: 0,
    anterior: 0,
    siguiente: 0,
    dialog_delete: false,
    session_name: import.meta.env.VITE_SESSION_NAME,
    images_url: import.meta.env.VITE_API_URL_IMAGES,
    generosLista: [] as any,
    series: [] as Serie[],
    generos: [] as any,
    generos_seleccionados: [] as any,
    estados: [] as any,
    estado_id: null as any,
    id: 0,
    nombre: '',
    isLoading: false
  }),
  computed: {
    store: () => filterSeriesStore()
  },
  created: async function () {
    this.buscarNombre = this.store.nombre;
    this.generos = this.store.generos;
    this.estado_id = (this.store.estado > 0) ? this.store.estado : null;
    this.listarEstados();
    this.listarGeneros();
    this.listarSeries(1);
  },
  methods: {
    async listarEstados() {
      estadosService.listar()

        .then(response => {

          var data = response.data;
          var status = data.estado;

          if (status == 1) {
            const estados = data.datos;
            this.estados = estados;
          }

        })
        .catch(e => {
          console.log(e);
        });
    },
    async listarGeneros() {
      generoService.listar()
        .then(response => {

          var data = response.data;

          var status = data.estado;
          var message = data.mensaje;

          if (status == 1) {

            const generos = data.datos;
            this.generosLista = generos;

          } else {
            toast.warning(message, generateToast("warning"));
          }

        })
        .catch(e => {
          console.log(e);
        });
    },
    async listarSeries(pagina: number) {

      const filtrarGeneros = isProxy(this.generos_seleccionados) ? toRaw(this.generos_seleccionados) : this.generos_seleccionados;

      serieService.listar(20, pagina, this.buscarNombre, filtrarGeneros, this.estado_id)
        .then(response => {

          var data = response.data;

          var status = data.estado;
          var message = data.mensaje;

          if (status == 1) {

            const datos = data.datos;

            const series = datos.series;

            this.series = series;

            const total = parseInt(datos.total);
            const paginas = parseInt(datos.ultima_pagina);
            const actual = parseInt(datos.pagina_actual);
            const anterior = (actual - 1) > 0 ? (actual - 1) : 0;
            const siguiente = (actual + 1) < total ? (actual + 1) : total;

            this.total = total;
            this.paginas = paginas;
            this.actual = actual;
            this.anterior = anterior;
            this.siguiente = siguiente;

          } else {

            toast.warning(message, generateToast("warning"));
          }

        })
        .catch(e => {
          console.log(e);
        });

    },
    async handleClickAnteriorTodo() {
      this.listarSeries(1);
    },
    async handleClickAnterior() {
      this.listarSeries(this.anterior);
    },
    async handleClickSiguiente() {
      this.listarSeries(this.siguiente);
    },
    async handleClickSiguienteTodo() {
      this.listarSeries(this.paginas);
    },
    async limpiarForm() {
      this.id = 0;
      this.nombre = '';
    },
    async abrirModalBorrarSerie(id = 0) {

      this.isLoading = true;

      serieService.cargar(id)
        .then(response => {

          var data = response.data;

          var status = data.estado;
          var message = data.mensaje;

          if (status == 1) {

            var datos = data.datos;

            this.id = datos.id;
            this.nombre = datos.nombre;

            this.dialog_delete = true;

            this.isLoading = false;

          } else {
            toast.warning(message, generateToast("warning"));
          }

        })
        .catch(e => {
          console.log(e);
        });
    },
    async cerrarModalBorrarSerie() {
      this.limpiarForm();
      this.dialog_delete = false;
    },
    async confirmarBorrarSerie() {

      this.isLoading = true;

      serieService.borrar(this.id)
        .then(response => {

          var data = response.data;

          var status = data.estado;
          var message = data.mensaje;

          if (status == 1) {

            toast.success(message, generateToast("success"));

            this.listarSeries(1);

            this.limpiarForm();

            this.dialog_delete = false;

            this.isLoading = false;

          } else {
            toast.warning(message, generateToast("warning"));
          }

        })
        .catch(e => {
          console.log(e);
        });

    },
    async filtrarSeries() {

      var generos_cargados = isProxy(this.generos) ? toRaw(this.generos) : this.generos;

      var lista_generos_seleccionados: any[] = [];

      generos_cargados.forEach((item: any) => {
        var id = 0;
        if (item.hasOwnProperty('id')) {
          id = item.id;
        } else {
          id = item;
        }
        lista_generos_seleccionados.push(id);
      });

      this.generos_seleccionados = lista_generos_seleccionados;

      this.store.setNombre(this.buscarNombre);
      this.store.setGeneros(lista_generos_seleccionados);
      this.store.setEstado(this.estado_id);

      this.listarSeries(1);
    },
    async borrarFiltroSeries() {
      this.store.setNombre("");
      this.store.setGeneros([]);
      this.store.setEstado(0);
      this.buscarNombre = "";
      this.generos = [];
      this.estado_id = null;
      this.listarSeries(1);
    },
  },
}
</script>

<style scoped></style>