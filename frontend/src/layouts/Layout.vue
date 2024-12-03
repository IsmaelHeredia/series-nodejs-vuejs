<script setup lang="ts">
import { ref } from "vue";
import { useTheme } from "vuetify";

import { VSonner } from 'vuetify-sonner';
import 'vuetify-sonner/style.css';

import { mdiWhiteBalanceSunny, mdiWeatherNight } from '@mdi/js';

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
      <slot />
    </v-responsive>
    <div className="botones-theme">
      <v-btn :icon="mdiWhiteBalanceSunny" @click="changeTheme()" v-if="store.mode == 2"></v-btn>
      <v-btn :icon="mdiWeatherNight" @click="changeTheme()" v-if="store.mode == 1"></v-btn>
    </div>

  </v-container>

</template>

<style scoped lang="scss"></style>