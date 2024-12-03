import { createRouter, createWebHistory } from 'vue-router';

import IngresoView from '@/views/ingreso/Index.vue';
import CuentaView from '@/views/cuenta/Index.vue';
import DashboardView from '@/views/dashboard/Index.vue';
import GeneroView from '@/views/genero/index.vue';
import SerieView from '@/views/serie/Index.vue';
import SaveSerieView from '@/views/serie/Save.vue';

import usuarioService from '@/services/usuario.service';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IngresoView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/dashboard/generos',
      name: 'generos',
      component: GeneroView,
    },
    {
      path: '/dashboard/series',
      name: 'series',
      component: SerieView,
    },
    {
      path: '/dashboard/series/nuevo',
      name: 'guardarSerie',
      component: SaveSerieView,
    },
    {
      path: '/dashboard/series/:id/editar',
      name: 'actualizarSerie',
      component: SaveSerieView,
    },
    {
      path: '/dashboard/cuenta',
      name: 'cuenta',
      component: CuentaView,
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const token = sessionStorage.getItem(import.meta.env.VITE_SESSION_NAME);
  let response = await usuarioService.validar({ "token": token });
  let isAuth = response.data.estado;
  console.log('token', token);
  if (to.fullPath === '/') {
    if (isAuth == 1) {
      next('/dashboard');
    } else {
      next();
    }
  } else {
    if (isAuth == 0) {
      next('/');
    } else {
      next();
    }
  }
})

export default router
