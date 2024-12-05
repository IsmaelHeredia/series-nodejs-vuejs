<script setup lang="ts">

import Layout from "@/layouts/LayoutAdmin.vue";

import { toast } from 'vuetify-sonner'

import { mdiFloppy, mdiArrowLeft } from '@mdi/js'

import estadosService from "@/services/estados.service";
import generosService from "@/services/generos.service";
import seriesService from "@/services/series.service";

import { isProxy, toRaw } from 'vue';

import { generateToast } from "@/utils/functions";
import router from "@/router";

</script>

<template>

  <Layout>

    <v-btn @click="volver" variant="elevated" type="submit" color="primary" class="boton-volver"><v-icon
        :icon="mdiArrowLeft" />
      Volver</v-btn>

    <v-divider class="divider-form-serie"></v-divider>

    <div class="form-serie">
      <v-form ref="formGuardar" @submit.prevent="validarGuardar">
        <v-card elevation="24">
          <v-card-title class="headline black text-center card-title" primary-title>
            Gestion de serie
          </v-card-title>
          <v-card-text class="pa-5">

            <v-text-field label="Nombre" v-model="nombre" :rules="nombreRules"></v-text-field>

            <v-row dense>
              <v-col cols="12" md="6" sm="6">
                <v-file-input label="Seleccione una imagen" v-model="imagen" outlined dense @change="onFileChange"
                  accept="image/png, image/jpeg, image/bmp" :rules="imagenRules"></v-file-input>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-img class="imagen-preview" :src="imagePreview" v-if="imagePreview != null" />
              </v-col>
            </v-row>

            <v-textarea v-model="links" class="links-form" label="Links"></v-textarea>

            <v-row dense>
              <v-col cols="12" md="4" sm="6">
                <v-number-input v-model="ultima_temporada" label="Última temporada" :reverse="false"
                  controlVariant="default" :hideInput="false" :inset="false"></v-number-input>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-number-input v-model="ultimo_capitulo" label="Último capítulo" :reverse="false"
                  controlVariant="default" :hideInput="false" :inset="false"></v-number-input>
              </v-col>
            </v-row>

            <v-row dense class="form-input-calificacion">
              <div class="text-h6 text-calificacion">Calificación</div>
              <v-rating v-model="calificacion" :rules="calificacionRules" class="rating-form" hover :length="5"
                :size="32" active-color="primary" />
            </v-row>

            <v-select label="Estado" :items="estados" item-title='nombre' item-value='id' v-model="estado_id"
              :rules="estadoRules"></v-select>

            <v-autocomplete clearable chips label="Géneros" v-model="generos" :items="generosLista" item-title="nombre"
              item-value="id" multiple :rules="generosRules"></v-autocomplete>

          </v-card-text>
          <v-card-actions class="pa-5 center-div">
            <v-btn variant="elevated" type="submit" color="primary" class="boton-largo" :disabled=isLoading><v-icon
                :icon="mdiFloppy" class="icono-boton" />
              Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </div>
  </Layout>
</template>

<script lang="ts">
export default {
  data: () => ({
    session_name: import.meta.env.VITE_SESSION_NAME,
    api_url_imagenes: import.meta.env.VITE_API_URL_IMAGES,
    id_serie: 0,
    nombre: '',
    nombreRules: [
      (value: any) => {
        if (value) return true
        return 'El nombre es obligatorio'
      },
    ],
    imagen: null as any,
    imagenRules: [
      (value: File[] | undefined) => {
        if (value && value.length > 0) return true
        return 'La imagen es obligatoria'
      },
    ],
    imagePreview: null as any,
    links: '',
    ultima_temporada: 0,
    ultimo_capitulo: 0,
    calificacion: 3,
    calificacionRules: [
      (value: any) => {
        if (value) return true
        return 'La calificación es obligatoria'
      },
    ],
    estados: [] as any,
    estado_id: null as any,
    estadoRules: [
      (value: any) => {
        if (value) return true
        return 'El estado es obligatorio'
      },
    ],
    generosLista: [],
    generos: [] as any,
    generosRules: [
      (value: []) => {
        if (value.length > 0) return true
        return 'La calificación es obligatoria'
      },
    ],
    isLoading: false
  }),
  created: async function () {

    const params_id = this.$route.params.id;

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

    generosService.listar()

      .then(response => {

        var data = response.data;
        var status = data.estado;

        if (status == 1) {

          const generos = data.datos;
          this.generosLista = generos;

        }

      })
      .catch(e => {
        console.log(e);
      });

    if (typeof params_id !== "undefined") {

      this.id_serie = Number(params_id);

      this.isLoading = true;

      seriesService.cargar(this.id_serie)

        .then(response => {

          var data = response.data;
          var status = data.estado;

          if (status == 1) {

            const datos = data.datos;

            this.nombre = datos.nombre;
            this.links = datos.links;
            this.ultima_temporada = datos.ultima_temporada;
            this.ultimo_capitulo = datos.ultimo_capitulo;
            this.calificacion = datos.calificacion;
            this.estado_id = datos.estado_id;
            this.generos = datos.generos;

            var url_imagen = this.api_url_imagenes + "/" + datos.imagen

            fetch(url_imagen)
              .then((res) => res.blob())
              .then((myBlob) => {
                const file = new File([myBlob], datos.imagen, { type: myBlob.type });
                this.imagen = file;
                this.imagePreview = URL.createObjectURL(this.imagen);
              });

            this.isLoading = false;

          }

        })
        .catch(e => {
          console.log(e);
        });

    }

  },
  methods: {
    async volver() {
      window.history.back();
    },
    async validarGuardar() {

      const { valid } = await (this.$refs.formGuardar as any).validate();

      if (valid) {

        var generos_seleccionados: any = [];

        var lista_generos = isProxy(this.generosLista) ? toRaw(this.generosLista) : this.generosLista;
        var generos_cargados = isProxy(this.generos) ? toRaw(this.generos) : this.generos;

        generos_cargados.forEach((item: any) => {
          var id = 0;
          if (item.hasOwnProperty('id')) {
            id = item.id;
          } else {
            id = item;
          }
          var genero: any = lista_generos.find((g: any) => g.id == id);
          generos_seleccionados.push({
            "id": id,
            "nombre": genero.nombre
          });
        });

        const datos = {
          'nombre': this.nombre,
          'links': this.links,
          'ultima_temporada': this.ultima_temporada,
          'ultimo_capitulo': this.ultimo_capitulo,
          'calificacion': this.calificacion,
          'estado_id': this.estado_id,
          'generos': generos_seleccionados
        };

        if (this.id_serie > 0) {

          this.isLoading = true;

          seriesService.editar(this.id_serie, datos)
            .then(response => {

              var data = response.data;

              var status = data.estado;
              var message = data.mensaje;

              if (status == 1) {

                const id = data.datos.id;

                seriesService.subirImagen(id, this.imagen)
                  .then(responseImg => {

                    var dataImg = responseImg.data;

                    var statusImg = dataImg.estado;

                    if (statusImg == 1) {

                      toast.success(message, generateToast("success"));

                      setTimeout(() => {
                        this.isLoading = false;
                        router.push({ name: 'series' });
                      }, Number(import.meta.env.VITE_TIMEOUT_REDIRECT));

                    } else {

                      toast.warning(message, generateToast("warning"));
                    }

                  })
                  .catch(e => {
                    console.log(e);
                  });

              } else {

                toast.warning(message, generateToast("warning"));
              }

            })
            .catch(e => {
              console.log(e);
            });

        } else {

          this.isLoading = true;

          seriesService.crear(datos)
            .then(response => {

              var data = response.data;

              var status = data.estado;
              var message = data.mensaje;

              if (status == 1) {

                const id = data.datos.id;

                seriesService.subirImagen(id, this.imagen)
                  .then(responseImg => {

                    var dataImg = responseImg.data;

                    var statusImg = dataImg.estado;

                    if (statusImg == 1) {

                      toast.success(message, generateToast("success"));

                      setTimeout(() => {
                        this.isLoading = false;
                        router.push({ name: 'series' });
                      }, Number(import.meta.env.VITE_TIMEOUT_REDIRECT));

                    } else {
                      toast.warning(message, generateToast("warning"));
                    }

                  })
                  .catch(e => {
                    console.log(e);
                  });

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
    onFileChange(file: any) {
      if (!file) {
        return;
      }
      this.imagePreview = URL.createObjectURL(this.imagen);
    }
  },
}
</script>