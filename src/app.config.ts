import { defineServer, /*defineRoom,*/ createRouter } from "colyseus";
import { playground } from "@colyseus/playground";
/**
 * Import your Room files
 */
// import { MyRoom } from "./rooms/MyRoom.js";
import { InitApi } from "./backend/core/config/config.js";
import { createAppRoutes } from "./backend/routes/default.js";

const server = defineServer({
  /**
   * Define your room handlers:
   */
  rooms: {
    // my_room: defineRoom(MyRoom),
  },

  /**
   * Experimental: Define API routes. Built-in integration with the "playground" and SDK.
   *
   * Usage from SDK:
   *   client.http.get("/api/hello").then((response) => {})
   *
   */
  routes: createRouter({
    ...playground({ prefix: "/playground" }),
  }),

  /**
   * Bind your custom express routes here:
   * Read more: https://expressjs.com/en/starter/basic-routing.html
   */
  express: (app) => {
    InitApi();

    app.disable("x-powered-by");
    app.use("/api", createAppRoutes());
  },
});

export default server;
