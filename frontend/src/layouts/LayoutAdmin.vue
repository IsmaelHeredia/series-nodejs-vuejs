<script setup lang="ts">
import { useTheme } from "vuetify";
import { themes } from "@/stores/themes";

const store = themes()

const theme = useTheme();

const changeTheme = () => {
  store.toogle();
  theme.global.name.value = store.themeName;
};

</script>

<template>
  <VSonner />
  <v-card height="100%">
    <v-layout>
      <v-app-bar color="primary" prominent>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Registro de series</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn class="text-none" v-bind="props">
              <v-icon class="icono-boton">mdi-account-circle</v-icon> {{ username }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item to="/dashboard/cuenta" link>
              <v-list-item-title>Cuenta</v-list-item-title>
              <template v-slot:prepend>
                <v-icon>mdi-account-circle</v-icon>
              </template>
            </v-list-item>
            <v-list-item @click="cerrarSesion" link>
              <v-list-item-title>Salir</v-list-item-title>
              <template v-slot:prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>

      </v-app-bar>

      <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>

        <v-list density="compact" nav>
          <v-list-item to="/dashboard" exact link>
            <v-list-item-title>Inicio</v-list-item-title>
            <template v-slot:prepend>
              <v-icon>mdi-home</v-icon>
            </template>
          </v-list-item>
          <v-list-item to="/dashboard/series" link>
            <v-list-item-title>Series</v-list-item-title>
            <template v-slot:prepend>
              <v-icon>mdi-movie</v-icon>
            </template>
          </v-list-item>
          <v-list-item to="/dashboard/generos" link>
            <v-list-item-title>Genéros</v-list-item-title>
            <template v-slot:prepend>
              <v-icon>mdi-theater</v-icon>
            </template>
          </v-list-item>
          <v-list-item to="/dashboard/cuenta" link>
            <v-list-item-title>Cuenta</v-list-item-title>
            <template v-slot:prepend>
              <v-icon>mdi-account-circle</v-icon>
            </template>
          </v-list-item>
          <v-list-item @click="abrirModalAbout()">
            <v-list-item-title>About</v-list-item-title>
            <template v-slot:prepend>
              <v-icon>mdi-information</v-icon>
            </template>
          </v-list-item>
          <v-list-item @click="cerrarSesion">
            <v-list-item-title>Salir</v-list-item-title>
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
          </v-list-item>
        </v-list>

      </v-navigation-drawer>

      <v-main style="min-height: 100vh;">
        <router-view />
      </v-main>
    </v-layout>
  </v-card>
  <div className="botones-theme">
    <v-btn @click="changeTheme()" v-if="store.mode == 2"><v-icon>mdi-white-balance-sunny</v-icon></v-btn>
    <v-btn @click="changeTheme()" v-if="store.mode == 1"><v-icon>mdi-weather-night</v-icon></v-btn>
  </div>
  <v-dialog v-model="dialog_about" max-width="600">

    <v-card>
      <v-card-title class="headline black text-center card-title" primary-title>
        About
      </v-card-title>

      <v-card-text class="text-center">
        <p class="modal-text">Nombre : Registro de series</p>
        <p class="modal-text">Version 1.0</p>
        <p class="modal-text">Autor : Ismael Heredia</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="center-div modal-actions">
        <v-btn class="boton-medio" variant="elevated" color="primary"
          @click="cerrarModalAbout"><v-icon>mdi-close</v-icon>
          Cerrar</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script lang="ts">

import { toast, VSonner } from 'vuetify-sonner';
import 'vuetify-sonner/style.css';

import usuarioService from "@/services/usuario.service";

import { generateToast } from "@/utils/functions";

import router from "@/router";

export default {
  data: () => ({
    session_name: "",
    username: "",
    drawer: false,
    group: null,
    dialog_about: false,
  }),
  watch: {
    group() {
      this.drawer = false
    },
  },
  created: async function () {
    this.session_name = import.meta.env.VITE_SESSION_NAME;
    const token = sessionStorage.getItem(this.session_name);
    let response: any = await usuarioService.validar({ "token": token });
    this.username = response.data.datos.username;
  },
  methods: {
    async abrirModalAbout() {
      this.dialog_about = true;
    },
    async cerrarModalAbout() {
      this.dialog_about = false;
    },
    async cerrarSesion() {

      sessionStorage.setItem(this.session_name, "");

      toast.success("La sesión fue cerrada correctamente", generateToast("success"));

      setTimeout(() => {
        router.push({ name: 'home' });
      }, Number(import.meta.env.VITE_TIMEOUT_REDIRECT));
    }
  }
}
</script>