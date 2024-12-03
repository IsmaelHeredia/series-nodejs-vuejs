<script setup lang="ts">

import Layout from "@/layouts/Layout.vue";
import { toast } from 'vuetify-sonner'

import { mdiLogin } from '@mdi/js'
import usuarioService from "@/services/usuario.service";

import { generateToast } from "@/utils/functions";
import router from "@/router";
import axios from "axios";

</script>

<template>

  <Layout>
    <div class="ingreso">
      <v-form ref="formIngreso" @submit.prevent="validarIngreso">
        <v-card elevation="24">
          <v-card-title class="headline black text-center card-title" primary-title>
            Ingreso
          </v-card-title>
          <v-card-text class="pa-5">
            <v-text-field label="Usuario" v-model="nombre" :rules="nombreRules"></v-text-field>
            <v-text-field type="password" label="Clave" v-model="clave" :rules="claveRules"></v-text-field>

          </v-card-text>
          <v-card-actions class="pa-5 center-div">
            <v-btn variant="elevated" type="submit" color="primary" class="boton-pequeño" :disabled=isLoading><v-icon
                :icon="mdiLogin" />
              Ingresar</v-btn>
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
    nombre: '',
    nombreRules: [
      (value: any) => {
        if (value) return true
        return 'El usuario es obligatorio'
      },
    ],
    clave: '',
    claveRules: [
      (value: any) => {
        if (value) return true
        return 'La clave es obligatoria'
      },
    ],
    isLoading: false
  }),
  methods: {
    async validarIngreso() {

      const { valid } = await (this.$refs.formIngreso as any).validate();

      if (valid) {

        const datos = {
          'nombre': this.nombre,
          'clave': this.clave
        };

        this.isLoading = true;

        usuarioService.ingresar(datos)
          .then(response => {

            var data = response.data;

            var status = data.estado;
            var message = data.mensaje;

            if (status == 1) {

              var token = data.datos;

              sessionStorage.setItem(this.session_name, token);

              axios.defaults.headers.Authorization = `Bearer ${token}`;

              toast.success(message, generateToast("success"));

              setTimeout(() => {
                this.isLoading = false;
                router.push({ name: 'dashboard' });
              }, Number(import.meta.env.VITE_TIMEOUT_REDIRECT));

            } else {
              toast.warning(message, generateToast("warning"));
            }

          })
          .catch(e => {
            console.log(e);
          });

      }

    },
  },
}
</script>