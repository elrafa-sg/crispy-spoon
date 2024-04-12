import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

import TransactionController from "./routes/transaction";
import PayableController from "./routes/payables";
import { transactionWorker } from "./workers/transactionWorker";

const app = new OpenAPIHono();

app.route('/transaction', TransactionController)
app.route('/payable', PayableController)

//#region configuração do swagger & open api
app.doc("/doc", {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "Crispy Spoon API",
    },
});
app.get("/docs", swaggerUI({ url: "/doc" }));
//#endregion

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
});

async function startTransactionWorker() {
    await transactionWorker.run()
}

startTransactionWorker()
console.log('transaction worker running ?', transactionWorker.isRunning())