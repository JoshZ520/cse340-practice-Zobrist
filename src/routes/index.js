import { Router } from "express";

const router = Router();

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
    res.render("index", { title, content });
});
app.get('/about', (req, res) => {
    const title = "About Page";
    const content = "<h1>About Us</h1><p>This is the about page content.</p>";
    res.render("index", { title, content });
}
);
// Default products route (redirects to grid view)
app.get('/products', (req, res) => {
    res.redirect('/products/grid');
});
// Products page route with display mode validation
app.get('/products/:display', validateDisplayMode, (req, res) => {
    const title = "Our Products";
    const { display } = req.params;
    res.render('products', { title, products, display });
});

export default router;