# CANCHA 90 AXM

Tienda de camisas de fútbol construida con React + Vite.

## Ejecutar en local

```bash
npm install
npm run dev
```

Después abre la URL que muestra Vite, normalmente `http://localhost:5173`.

## Compilar para producción

```bash
npm run build
```

La salida queda en `dist/`.

## Funciones actuales

La tienda incluye una página de inicio responsive, hero editorial, catálogo, filtros por colección, favoritos visuales, fichas detalladas de producto, fotografías, descripción, materiales, tallas disponibles, stock, selector de cantidad, carrito lateral y resumen de compra.

El checkout solicita nombre, teléfono, ciudad, dirección y notas del pedido. Al pulsar **Enviar pedido a WhatsApp**, prepara un mensaje con todos los productos, tallas, cantidades, precios y datos de entrega, y lo abre en el WhatsApp de CANCHA 90 AXM: **+57 313 617 1666**.

## Pendiente para una segunda fase

Los pagos se coordinan actualmente por WhatsApp. Para automatizar la operación después habría que conectar una base de datos, inventario real, pasarela de pagos, correos automáticos, estados de pedidos y cálculo de envíos.

Las imágenes y productos incluidos son demostrativos y deben reemplazarse por el inventario real antes de publicar.
