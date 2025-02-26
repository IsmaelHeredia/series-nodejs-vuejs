<script setup lang="ts">
import { useTheme } from "vuetify";

import { VSonner } from 'vuetify-sonner';
import 'vuetify-sonner/style.css';

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

  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <router-view />
    </v-responsive>
    <div className="botones-theme">
      <v-btn @click="changeTheme()" v-if="store.mode == 2"><v-icon>mdi-white-balance-sunny</v-icon></v-btn>
      <v-btn @click="changeTheme()" v-if="store.mode == 1"><v-icon>mdi-weather-night</v-icon></v-btn>
    </div>

  </v-container>

</template>

<style scoped lang="scss"></style>