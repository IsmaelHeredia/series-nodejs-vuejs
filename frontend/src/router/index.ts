import { createRouter, createWebHistory } from 'vue-router';

import Layout from '@/layouts/Layout.vue';
import LayoutAdmin from '@/layouts/LayoutAdmin.vue';

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
      name: 'public',
      component: Layout,
      redirect: '/',
      children: [
        {
          path: '/',
          name: 'home',
          component: IngresoView
        }
      ]
    },
    {
      path: '/dashboard',
      name: 'private',
      component: LayoutAdmin,
      redirect: '/dashboard',
      children: [
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
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const token = sessionStorage.getItem(import.meta.env.VITE_SESSION_NAME);
  let response: any = await usuarioService.validar({ "token": token });
  var isAuth = 0;
  if (typeof response !== "undefined" && response != null) {
    isAuth = response.data.estado;
  } else {
    isAuth = 0;
  }
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
