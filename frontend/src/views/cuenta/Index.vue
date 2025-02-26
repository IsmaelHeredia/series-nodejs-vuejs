<template>
    <div class="cuenta">
        <v-form ref="formCuenta" @submit.prevent="validarCuenta">
            <v-card elevation="24">
                <v-card-title class="headline black text-center card-title" primary-title>
                    Actualizar datos de cuenta
                </v-card-title>
                <v-card-text class="pa-5">
                    <v-text-field label="Usuario" v-model="usuario" :rules="usuarioRules" readonly></v-text-field>
                    <v-text-field label="Nuevo usuario" v-model="nuevo_usuario"
                        :rules="nuevoUsuarioRules"></v-text-field>
                    <v-text-field type="password" label="Clave" v-model="clave" :rules="claveRules"></v-text-field>
                    <v-text-field type="password" label="Nueva clave" v-model="nueva_clave"
                        :rules="nuevaClaveRules"></v-text-field>
                </v-card-text>
                <v-card-actions class="pa-5 center-div">
                    <v-btn variant="elevated" type="submit" color="primary" class="boton-largo"
                        :disabled=isLoading><v-icon class="icono-boton">mdi-floppy</v-icon>
                        Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </div>
</template>

<script lang="ts">

import { toast } from 'vuetify-sonner';

import usuarioService from "@/services/usuario.service";

import { generateToast } from "@/utils/functions";
import router from "@/router";

export default {
    data: () => ({
        session_name: import.meta.env.VITE_SESSION_NAME,
        usuario: '',
        usuarioRules: [
            (value: any) => {
                if (value) return true
                return 'El usuario es obligatorio'
            },
        ],
        nuevo_usuario: '',
        nuevoUsuarioRules: [
            (value: any) => {
                if (value) return true
                return 'El nuevo usuario es obligatorio'
            },
        ],
        clave: '',
        claveRules: [
            (value: any) => {
                if (value) return true
                return 'La clave es obligatoria'
            },
        ],
        nueva_clave: '',
        nuevaClaveRules: [
            (value: any) => {
                if (value) return true
                return 'La nueva clave es obligatoria'
            },
        ],
        isLoading: false
    }),
    created: async function () {

        this.session_name = import.meta.env.VITE_SESSION_NAME;

        const token = sessionStorage.getItem(this.session_name);

        let response: any = await usuarioService.validar({ "token": token });

        this.usuario = response.data.datos.username;

    },
    methods: {
        async validarCuenta() {

            const { valid } = await (this.$refs.formCuenta as any).validate();

            if (valid) {

                const datos = {
                    'usuario': this.usuario,
                    'nuevo_usuario': this.nuevo_usuario,
                    'clave': this.clave,
                    'nueva_clave': this.nueva_clave
                };

                this.isLoading = true;

                usuarioService.actualizarCuenta(datos)
                    .then(response => {

                        var data = response.data;

                        var status = data.estado;
                        var message = data.mensaje;

                        if (status == 1) {

                            sessionStorage.setItem(this.session_name, "");

                            toast.success(message, generateToast("success"));

                            setTimeout(() => {
                                this.isLoading = false;
                                router.push({ name: 'home' });
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