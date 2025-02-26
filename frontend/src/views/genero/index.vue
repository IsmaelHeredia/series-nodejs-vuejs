<template>
  <v-btn variant="elevated" type="submit" color="primary" class="boton-largo boton-agregar-genero"
    @click="abrirModalGuardarGenero"><v-icon>mdi-plus</v-icon>
    Agregar género</v-btn>

  <v-divider class="divider-generos"></v-divider>

  <v-row class="center-div">
    <v-col cols="3">
      <v-text-field v-model="buscarNombre" label="Ingrese nombre" class="filtro-nombre" />
    </v-col>
    <v-col cols="4" style="display: inline-block;">
      <v-btn variant="elevated" type="submit" color="primary" class="boton-filtrar"
        @click="filtrarGeneros"><v-icon>mdi-magnify</v-icon>
        Filtrar</v-btn>
      <v-btn variant="elevated" type="submit" color="primary" class="boton-filtrar"
        @click="borrarFiltroGeneros"><v-icon>mdi-close</v-icon>
        Borrar</v-btn>
    </v-col>
  </v-row>

  <div class="datos-tabla">
    <v-table fixed-header class="tabla-generos">
      <thead>
        <tr>
          <th class="text-center">
            Nombre
          </th>
          <th class="text-center">
            Opción
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="genero in generos" :key="genero.id">
          <td>{{ genero.nombre }}</td>
          <td>
            <v-btn class="boton-icono-tabla" density="compact" size="x-large"
              @click="abrirModalGuardarGenero(genero.id)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn class="boton-icono-tabla" density="compact" size="x-large"
              @click="abrirModalBorrarGenero(genero.id)"><v-icon>mdi-delete</v-icon></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>

  <div class="paginas-generos">
    <div class="left-generos">
      Página {{ actual }} / {{ paginas }}
    </div>
    <div class="right-generos">
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

  <v-dialog v-model="dialog_save" max-width="600">

    <v-form ref="formGenero" @submit.prevent="guardarGenero">

      <v-card>
        <v-card-title class="headline black text-center card-title" primary-title>
          Gestion de género
        </v-card-title>

        <v-card-text>
          <v-text-field label="Nombre" v-model="nombre" :rules="nombreRules"></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="center-div modal-actions">
          <v-btn class="boton-medio" type="submit" variant="elevated" color="primary"
            :disabled=isLoading><v-icon>mdi-floppy</v-icon>
            Guardar</v-btn>
          <v-btn class="boton-medio" variant="elevated" color="primary" @click="cerrarModalGuardarGenero"
            :disabled=isLoading><v-icon>mdi-close</v-icon> Cerrar</v-btn>
        </v-card-actions>
      </v-card>

    </v-form>

  </v-dialog>

  <v-dialog v-model="dialog_delete" max-width="800">

    <v-card>
      <v-card-title class="headline black text-center card-title" primary-title>
        Confirmación de eliminación
      </v-card-title>

      <v-card-text class="text-center">
        ¿ Desea borrar el género {{ nombre }} ?
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="center-div modal-actions">
        <v-btn class="boton-medio" variant="elevated" color="primary" @click="confirmarBorrarGenero"
          :disabled=isLoading><v-icon>mdi-delete</v-icon>
          Borrar</v-btn>
        <v-btn class="boton-medio" variant="elevated" color="primary" @click="cerrarModalBorrarGenero"
          :disabled=isLoading><v-icon>mdi-close</v-icon> Cerrar</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script lang="ts">

import { toast } from 'vuetify-sonner';
import generoService from "@/services/generos.service";
import { generateToast } from "@/utils/functions";
import { filterGenerosStore } from '@/stores/filterGeneros';

interface Genero {
  id: number;
  nombre: string;
}

export default {

  data: () => ({
    buscarNombre: "",
    total: 0,
    paginas: 0,
    actual: 0,
    anterior: 0,
    siguiente: 0,
    dialog_save: false,
    dialog_delete: false,
    session_name: import.meta.env.VITE_SESSION_NAME,
    generos: [] as Genero[],
    id: 0,
    nombre: '',
    nombreRules: [
      (value: any) => {
        if (value) return true
        return 'El nombre es obligatorio'
      },
    ],
    isLoading: false
  }),
  computed: {
    store: () => filterGenerosStore()
  },
  created: async function () {
    this.buscarNombre = this.store.nombre;
    this.listarGeneros(1);
  },
  methods: {
    async listarGeneros(pagina: number) {

      generoService.filtrar(this.buscarNombre, pagina)
        .then(response => {

          var data = response.data;

          var status = data.estado;
          var message = data.mensaje;

          if (status == 1) {

            const datos = data.datos;

            const generos = datos.generos;

            this.generos = generos;

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
      this.listarGeneros(1);
    },
    async handleClickAnterior() {
      this.listarGeneros(this.anterior);
    },
    async handleClickSiguiente() {
      this.listarGeneros(this.siguiente);
    },
    async handleClickSiguienteTodo() {
      this.listarGeneros(this.paginas);
    },
    async limpiarForm() {
      this.id = 0;
      this.nombre = '';
    },
    async abrirModalGuardarGenero(id = 0) {

      if (id > 0) {

        this.isLoading = true;

        generoService.cargar(id)
          .then(response => {

            var data = response.data;

            var status = data.estado;
            var message = data.mensaje;

            if (status == 1) {

              var datos = data.datos;

              this.id = datos.id;
              this.nombre = datos.nombre;

              this.dialog_save = true;

              this.isLoading = false;

            } else {
              toast.warning(message, generateToast("warning"));
            }

          })
          .catch(e => {
            console.log(e);
          });
      } else {
        this.dialog_save = true;
      }

    },
    async cerrarModalGuardarGenero() {
      this.limpiarForm();
      this.dialog_save = false;
    },
    async abrirModalBorrarGenero(id = 0) {

      this.isLoading = true;

      generoService.cargar(id)
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
    async cerrarModalBorrarGenero() {
      this.limpiarForm();
      this.dialog_delete = false;
    },
    async confirmarBorrarGenero() {

      this.isLoading = true;

      generoService.borrar(this.id)
        .then(response => {

          console.log(response);

          var data = response.data;

          var status = data.estado;
          var message = data.mensaje;

          if (status == 1) {

            toast.success(message, generateToast("success"));

            this.listarGeneros(1);

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
    async guardarGenero() {

      const { valid } = await (this.$refs.formGenero as any).validate();

      if (valid) {

        const datos = {
          'nombre': this.nombre,
        };

        if (this.id > 0) {

          this.isLoading = true;

          generoService.editar(this.id, datos)
            .then(response => {

              var data = response.data;

              var status = data.estado;
              var message = data.mensaje;

              if (status == 1) {

                toast.success(message, generateToast("success"));

                this.listarGeneros(1);

                this.limpiarForm();

                this.dialog_save = false;

                this.isLoading = false;

              } else {
                toast.warning(message, generateToast("warning"));
              }

            })
            .catch(e => {
              console.log(e);
            });

        } else {

          this.isLoading = true;

          generoService.crear(datos)
            .then(response => {

              var data = response.data;

              var status = data.estado;
              var message = data.mensaje;

              if (status == 1) {

                toast.success(message, generateToast("success"));

                this.listarGeneros(1);

                this.limpiarForm();

                this.dialog_save = false;

                this.isLoading = false;

              } else {
                toast.warning(message, generateToast("warning"));
              }

            })
            .catch(e => {
              console.log(e);
            });
        }

      }

    },
    async filtrarGeneros() {
      this.store.setNombre(this.buscarNombre);
      this.listarGeneros(1);
    },
    async borrarFiltroGeneros() {
      this.store.setNombre("");
      this.buscarNombre = "";
      this.listarGeneros(1);
    }
  },
}
</script>

<style scoped></style>