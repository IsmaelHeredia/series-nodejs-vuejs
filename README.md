# Registro de Series

En este proyecto se hizo un sistema para registrar series y todos los datos necesarios para poder organizarlas, esta hecho en NodeJS con Sequelize y VueJS con Vuetify. Permite usar como base de datos MySQL y PostgreSQL.

Las funciones incorporadas son :

Inicio de sesión obligatorio para usar el sistema protegido con JWT.

Rutas protegidas para poder acceder al dashboard.

Posibilidad de cambiar usuario y contraseña.

Posibilidad de cambiar el theme completo del sistema a un modo oscuro o claro.

Se pueden agregar, editar y borrar géneros. En esta misma sección se usa Pinia para poder filtrar por nombre en el buscador y poder recordar el filtro al cambiar de página.

Se pueden agregar, editar y borrar series. En esta misma sección se usa Pinia para poder filtrar por nombre, géneros y estados.

A continuación se muestran unas imágenes del sistema en funcionamiento.

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgZat3FdcyHMWZac3EPWPxlFFP20veQG-kRH3dFR4Ssjm2HspgLAGoMlYbBiQUIVh0nv0b2tIqUjVSVUPLRGNDohWM_eV3knGvh-ZIp7Rp3xlE6ovSyd-k16XyUmHj_n4L-UKFrFdIE9WCn1ASD-IjHVyv53agcd0IWbZY1t-69Agx7GDWhDV45WzvMcAM/s1897/1.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiq7Xr3GDVvyub1La1Uk4LyDewVsLJYQ3ogxTYvjunS3F1OqPIKAHPB22wQ_9d-cl33EHDDN69tbjHP77Ba2xwbH4fljeabMEhS4VwQXYHd2valLJBSYaJBiYPT_cXMgCt2COAPb64eozUDivKHD7lfcxP29mcIq3XV99ClfoLA6XSOC_tGQyaHkqByfc0/s1903/2.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiL0uVc0qs8c3y6SLdbwaULz4JZKgO5nYxQapGPwDFtoUA9jnRbHPT9mCPsIZb5_xTrAKwSiSAxTS8PXItMxtn6b684R1Sp65pOR7jNSZK9HbQJ2mCRuBqeLevdkTxt4xYoMBSGSeUBGhk4VX1ahU6nfxcBuewrXmUjk8EsV96s49T6SiSg8bq4a9F91Uc/s1901/3.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJgTk36TLxosAQufZObA4LqwYEct_qlccviKd9THyZoqrmBjWOda5D1kwQenp4FbrH7ooNYTAHi3vtTggP2PoLj4KbapdEZkNcWHMVcOqvIYp1sHv_ZiC-n6XtB-LUXb2ltNAIeC_eezf2j2aVZA9_ybsf9zK0f6rbScObYXCTUba7iamhicTFC9rHRck/s1903/4.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjAgLxsCYFQCILjL6zxkACFCG3Lrj1nbBZoSQgKoGTnJNtyl4Yl7QhpZAB5eEo_PsbMbEVjeDY_juMnMkudZYH1KMJALa_Q6qq5hyt2qbto0QFuSp0DyFLZ6EsAJoYC9tsSLE88ogIWt4IXRsIenDPTrIYu69U7-nJMRldQ4GFFNwgBSqT4VJe0y0T3Tlc/s1899/5.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqEsYcO6C-31SlyRPlNpUYaOnbuo6T3afkBXUsfRRhOdIAzO3QdFGim9aQlYb_0zmbwtAhfISf4RJT6M4qXvaSW85cm2EtKCJLcDL-Hlbsy7iZ_FRyhwamjNMP6fYfhORvfE88FrdSEP7pk1ifDdOU8-CyWoubBeipSNlypEH1EEfbH34wbiDaLIWW_Eg/s1901/6.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjxZCID1ouKgDLYJgTIavKOArHt9ISwWix402lsyv-ziOVBdJ_kQXXUj9fQwhPyOrjhfoiEn22L2NOl8K3_M20xCXaWWVyi1EVk1vojanSCMBg97hGt8ChTNaRH-aIqxys6-4ZcswJqPbAQCwkIVyr_0Xvfs1lNlJjW4u2zsD-Cti7DMxYh72MLNs-duws/s1900/7.png)

Para la correcta instalación del sistema se deben seguir los siguiente pasos.

Desde la carpeta "backend", se debe renombrar el archivo .env.example a solo .env y editar la configuración con los datos de tu conexión a la base de datos. En el caso de la variable "DB_CONNECTION" se puede elegir entre "mysql" y "postgres" dependiendo de que motor se desee usar.

Una vez editado el archivo .env se deben ejecutar los siguiente comandos : 

```
npm install
```
```
sequelize db:migrate
```
```
sequelize db:seed:all
```

Finalmente para iniciar el servidor se debe ejecutar este comando : 

```
npm run start
```

Desde la carpeta "frontend", se debe renombrar el archivo .env.example a solo .env y editar las variables con el nombre de "VITE_API_URL" y "VITE_API_URL_IMAGES" por la URL correspondiente a su backend.

Una vez editado el archivo .env se deben ejecutar los siguiente comandos : 

```
npm install
```

Finalmente para iniciar el servidor se debe ejecutar este comando : 

```
npm run dev
```