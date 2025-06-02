// Import express using ESM syntax
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRoutes from './src/routes/index.js';
import productsRoutes from './src/routes/products/index.js';
import { addGlobalData } from './src/middleware/index.js';
import { setupDatabase, testConnection } from './src/models/setup.js';
import dashboardRoutes from './src/routes/dashboard/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;


// Create an instance of an Express application
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON data in request body
app.use(express.json());
 
// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.set("views",  path.join(__dirname, 'src/views'));

app.use(addGlobalData);

app.use('/', indexRoutes);
app.use('/products', productsRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/error', (req, res, next) => {
    const err = new Error('This is a manually triggered error');
    err.status = 500;
    next(err); // Forward to the global error handler
});

app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Internal Server Error',
        error: err.message,
        stack: err.stack
    };
    res.status(status).render(`errors/${status === 404 ? '404' : '500'}`, context);
});
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
    });
    wsServer.on("listening", (error) => {
        console.error('WebSocket server error', error);
    });

    } catch (error) {
    console.error('WebSocket server failed to start', error);
    };
}
 
// Start the server and listen on the specified port
app.listen(PORT, async () => {
    try {
        await testConnection();
        await setupDatabase();
    } catch (error) {
        console.error('Database setup faild: ', error);
        process.exit(1);
    }
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

