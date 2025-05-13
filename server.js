// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;


// Create an instance of an Express application
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.set("views",  path.join(__dirname, 'src/views'));

app.use((req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    next();
});

app.use((req, res, next) => {
    console.log(`Method: ${req.method}, URL: ${req.url}`);
    next();
});
// Sample product data
const products = [
    {
        id: 1,
        name: "Kindle E-Reader",
        description: "Lightweight e-reader with a glare-free display and weeks of battery life.",
        price: 149.99,
        image: "https://picsum.photos/id/367/800/600"
    },
    {
        id: 2,
        name: "Vintage Film Camera",
        description: "Capture timeless moments with this classic vintage film camera, perfect for photography enthusiasts.",
        price: 199.99,
        image: "https://picsum.photos/id/250/800/600"
    }
];
 
// Middleware to validate display parameter
const validateDisplayMode = (req, res, next) => {
    const { display } = req.params;
    if (display !== 'grid' && display !== 'details') {
        const error = new Error('Invalid display mode: must be either "grid" or "details".');
        next(error); // Pass control to the error-handling middleware
    }
    next(); // Pass control to the next middleware or route
};
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
// Products page route with display mode validation
app.get('/products/:display', validateDisplayMode, (req, res) => {
    const title = "Our Products";
    const { display } = req.params;
    res.render('products', { title, products, display, NODE_ENV });
});
// Default products route (redirects to grid view)
app.get('/products', (req, res) => {
    res.redirect('/products/grid');
});
// New explore page handler
app.get('/explore/:category/:id', (req, res) => {
    const {category, id} = req.params;

    const { sort = 'default', filter = 'none'} = req.query;

    console.log('Route Parameters:', req.params);
    console.log('Query Parameters:', req.query);

   const title = `Exploring ${category}`;

   res.render('explore', {title, category, id, sort, filter, NODE_ENV});
    
})
// Test route that deliberately throws an error
app.get('/test-error', (req, res, next) => {
    try {
        // Intentionally trigger an error
        const nonExistentVariable = undefinedVariable;
        res.send('This will never be reached');
    } catch (err) {
        // Forward the error to the global error handler
        next(err);
    }
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
        NODE_ENV,
        PORT
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

