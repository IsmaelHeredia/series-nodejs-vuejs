<template>
  <v-divider class="divider-home"></v-divider>

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
      <v-btn variant="elevated" type="submit" color="primary" class="boton-filtrar"
        @click="filtrarSeries"><v-icon>mdi-magnify</v-icon>
        Filtrar</v-btn>
      <v-btn variant="elevated" type="submit" color="primary" class="boton-filtrar"
        @click="borrarFiltroSeries"><v-icon>mdi-close</v-icon>
        Borrar</v-btn>
    </v-col>
  </v-row>

  <div class="listado-registros">
    <v-container fluid grid-list-md>
      <div v-if="series.length">
        <v-row class="pa-2">
          <v-col v-for="(serie) in series" :key="serie.id && serie.nombre" class="d-flex child-flex" cols="3">
            <v-img class="align-end flash imagen-portada" :src="images_url + '/' + serie.imagen" contain
              aspect-ratio="1" height="340" @click="abrirModalPreview(serie.id)" v-tooltip:top="serie.nombre" />
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <div class="text-h6 text-md-h5 text-lg-h4 text-center">No se encontraron registros</div>
      </div>
    </v-container>
  </div>

  <div class="paginas-series">
    <div class="left-series">
      Página {{ actual }} / {{ paginas }}
    </div>
    <div class="right-series">
      <v-btn-toggle>
        <v-btn @click="handleClickAnteriorTodo" :disabled="actual == 1">
          <v-icon>mdi-arrow-collapse-left</v-icon>
        </v-btn>

        <v-btn @click="handleClickAnterior" :disabled="actual == 1">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-btn @click="handleClickSiguiente" :disabled="actual == paginas">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>

        <v-btn @click="handleClickSiguienteTodo" :disabled="actual == paginas">
          <v-icon>mdi-arrow-collapse-right</v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>
  </div>

  <v-dialog v-model="dialog_preview" max-width="600">

    <v-card>

      <v-card-text>

        <v-img class="align-end text-white imagen-portada-dialog" :src="images_url + '/' + imagen" contain
          max-height="400px" width="100%" />

        <h1 class="center preview-titulo">{{ nombre }}</h1>

        <div v-if="links.length > 0">
          <h3 class="center preview-links">Links disponibles</h3>
          <div v-for="link in links" class="center-links">
            <a :href=link target="_blank">{{ link }}</a>
          </div>
        </div>
        <div v-else>
          <h3 class="center preview-links">Sin links disponibles</h3>
        </div>

        <h3 class="center preview-progreso">Progreso : T{{ ultima_temporada }} - C{{ ultimo_capitulo }}</h3>

        <v-row dense class="center-div preview-calificacion">
          <h3 class="text-calificacion">Calificación : </h3>
          <v-rating v-model="calificacion" class="rating-form custom-rating" hover readonly :length="5" :size="32"
            active-color="primary" />
        </v-row>

        <h3 class="center preview-estado">Estado : <b :class=estado.color>{{ estado.nombre }}</b></h3>


        <v-row dense class="center-div preview-generos">
          <h3 class="text-generos">Géneros : </h3>
          <v-chip v-for="genero_chip in generos_chips" :key="genero_chip.id" class="chip-genero">
            {{ genero_chip.nombre }}
          </v-chip>
        </v-row>

      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="center-div modal-actions">
        <v-btn class="boton-medio" variant="elevated" color="primary"
          :to="{ name: 'actualizarSerie', params: { id: id } }"><v-icon>mdi-pencil</v-icon> Editar</v-btn>
        <v-btn class="boton-medio" variant="elevated" color="primary"
          @click="cerrarModalPreview"><v-icon>mdi-close</v-icon> Cerrar</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script lang="ts">

import { toast } from 'vuetify-sonner';

import serieService from "@/services/series.service";
import generoService from "@/services/generos.service";
import estadosService from "@/services/estados.service";

import { generateToast } from "@/utils/functions";

import { isProxy, toRaw } from 'vue';

import { filterSeriesStore } from '@/stores/filterSeries';

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
    dialog_preview: false,
    id: 0,
    nombre: "",
    imagen: "",
    links: "",
    ultima_temporada: "",
    ultimo_capitulo: "",
    calificacion: "",
    estado: null as any,
    generos_chips: null as any
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

      serieService.listar(24, pagina, this.buscarNombre, filtrarGeneros, this.estado_id)
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
    async abrirModalPreview(id: number) {
      if (id > 0) {
        serieService.cargar(id)
          .then(response => {
            var data = response.data;
            var status = data.estado;
            var message = data.mensaje;

            if (status == 1) {
              var datos = data.datos;
              this.id = datos.id;
              this.nombre = datos.nombre;
              this.imagen = datos.imagen;

              this.links = datos.links ? datos.links.split("\n").map((link: string) => link.trim()).filter((link: any) => link) : [];

              this.ultima_temporada = datos.ultima_temporada;
              this.ultimo_capitulo = datos.ultimo_capitulo;
              this.calificacion = datos.calificacion;
              this.estado = datos.estado;
              this.generos_chips = datos.generos;

              this.dialog_preview = true;
            } else {
              toast.warning(message, generateToast("warning"));
            }
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        this.dialog_preview = true;
      }
    },
    async cerrarModalPreview() {
      this.dialog_preview = false;
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