// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create an instance of an Express application
const app = express();
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.set("views",  path.join(__dirname, 'src/views'));

// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
    const title = "Home Page";
    const content = "<h1>Welcome to the Home Page</h1><p>This is the main content.</p>";
    res.render("index", { title, content, NODE_ENV });
});
app.get('/about', (req, res) => {
    const title = "About Page";
    const content = "<h1>About Us</h1><p>This is the about page content.</p>";
    res.render("index", { title, content, NODE_ENV });
}
);

app.get('/products', (req, res) => {
    const title = 'Product Page';
    const content = "<h1>Products</h1>";
    res.render("index", {title, content, NODE_ENV});

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
        stack: err.stack,
        mode,
        port
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
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

