import { randomInt } from "crypto";
import { createServer, Factory, Model, Response } from "miragejs";

type User = {
  name: string;
  email: string;
  created_at: string;
};
export function makeServer() {
  const server = createServer({
    models: {
      user: Model.extend<Partial<User>>({} as User),
    },
    factories: {
      user: Factory.extend({
        name(i: number) {
          return `User ${i + 1}`;
        },
        email(i: number) {
          return `User_${i + 1}@gmail.com`;
        },
        createdAt() {
          return new Date().toString();
        },
      }),
    },
    seeds(server) {
      server.createList("user", 205);
    },
    routes() {
      this.namespace = "api";
      this.timing = 750;

      this.get("/users", function (schema, request) {
        const { page = 1, perPage = 20 } = request.queryParams;

        const total = schema.all("user").length;

        const pageStart = (Number(page) - 1) * Number(perPage);
        const pageEnd = pageStart + Number(perPage);

        const users = this.serialize(schema.all("user")).users.slice(
          pageStart,
          pageEnd
        );

        return new Response(200, { "x-total-count": String(total) }, { users });
      });
      this.post("/users");

      this.namespace = "";
      this.passthrough();
    },
  });

  return server;
}
