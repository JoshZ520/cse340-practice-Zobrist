// Import express using ESM syntax
import express from 'express';

// Create an instance of an Express application
const app = express();
app.set('view engine', 'ejs');
app.set("views",  path.join(__dirname, 'src/views'));
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
    });
    wsServer.on("listening", () => {
        console.error('WebSocket server error', error);
    });
    
}
    catch (error) {
    console.error('WebSocket server failed to start', error);
};
}
// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
    const title = "Home Page";
    const content = "<h1>Welcome to the Home Page</h1><p>This is the main content.</p>";
    res.render("index", { title, content });
});
app.get('/about', (req, res) => {
    const title = "About Page";
    const content = "<h1>About Us</h1><p>This is the about page content.</p>";
    res.render("index", { title, content });
}
);
app.get('/contact', (req, res) => {
    const title = "Contact Page";
    const content = "<h1>Contact Us</h1><ul><li>Josh</li><li>7252517881</li><li>joshuazob@gmail.com</li></ul>";
    res.render("index", { title, content });
}
); 
// Define the port number the server will listen on
const PORT = 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
 
// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

