import axios from 'axios';

const BASE_URL = 'http://localhost:5454';
const EMAIL = 'test10@example.com';
const PASSWORD = '12345678';

const products = [
    // Men's Fashion
    {
        title: "Classic White Casual Shirt",
        description: "A timeless classic white shirt made from 100% cotton. Perfect for casual and semi-formal occasions.",
        mrpPrice: 50,
        sellingPrice: 35,
        color: "White",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60"],
        category: "men",
        category2: "clothing",
        category3: "shirt",
        size: "M"
    },
    {
        title: "Slim Fit Blue Jeans",
        description: "Comfortable slim fit jeans with a modern look. Durable denim fabric.",
        mrpPrice: 80,
        sellingPrice: 55,
        color: "Blue",
        images: ["https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&auto=format&fit=crop&q=60"],
        category: "men",
        category2: "clothing",
        category3: "jeans",
        size: "32"
    },
    {
        title: "Leather Biker Jacket",
        description: "Premium faux leather jacket with zipper details. Adds an edge to any outfit.",
        mrpPrice: 150,
        sellingPrice: 110,
        color: "Black",
        images: ["https://images.unsplash.com/photo-1551028919-ac76c90b8565?w=500&auto=format&fit=crop&q=60"],
        category: "men",
        category2: "clothing",
        category3: "jacket",
        size: "L"
    },

    // Women's Fashion
    {
        title: "Floral Summer Dress",
        description: "Lightweight and breezy floral dress, perfect for summer days.",
        mrpPrice: 70,
        sellingPrice: 45,
        color: "Red",
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60"],
        category: "women",
        category2: "clothing",
        category3: "dress",
        size: "S"
    },
    {
        title: "Elegant Leather Handbag",
        description: "Stylish and spacious handbag for everyday use. High-quality craftsmanship.",
        mrpPrice: 120,
        sellingPrice: 89,
        color: "Brown",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60"],
        category: "women",
        category2: "accessories",
        category3: "bag",
        size: "One Size"
    },
    {
        title: "Running Sports Shoes",
        description: "Lightweight running shoes with excellent cushioning and support.",
        mrpPrice: 90,
        sellingPrice: 65,
        color: "Pink",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"],
        category: "women",
        category2: "footwear",
        category3: "shoes",
        size: "7"
    },

    // Electronics
    {
        title: "Pro Wireless Headphones",
        description: "Noise-cancelling over-ear headphones with deep bass and long battery life.",
        mrpPrice: 250,
        sellingPrice: 199,
        color: "Black",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"],
        category: "electronics",
        category2: "audio",
        category3: "headphones",
        size: "One Size"
    },
    {
        title: "Smart Fitness Watch",
        description: "Track your fitness goals, heart rate, and sleep with this advanced smartwatch.",
        mrpPrice: 180,
        sellingPrice: 129,
        color: "Black",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"],
        category: "electronics",
        category2: "wearable",
        category3: "watch",
        size: "One Size"
    },
    {
        title: "Ultra-Slim Laptop",
        description: "Powerful performance in a sleek, lightweight design. Perfect for work and play.",
        mrpPrice: 1200,
        sellingPrice: 999,
        color: "Silver",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60"],
        category: "electronics",
        category2: "computer",
        category3: "laptop",
        size: "13 inch"
    },

    // Home & Living
    {
        title: "Modern Minimalist Sofa",
        description: "Comfortable 3-seater sofa with a modern minimalist design.",
        mrpPrice: 800,
        sellingPrice: 599,
        color: "Grey",
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60"],
        category: "home",
        category2: "furniture",
        category3: "sofa",
        size: "Large"
    },
    {
        title: "Ceramic Table Lamp",
        description: "Beautiful ceramic table lamp that adds a warm glow to any room.",
        mrpPrice: 60,
        sellingPrice: 40,
        color: "White",
        images: ["https://images.unsplash.com/photo-1507473888900-52e1adad5420?w=500&auto=format&fit=crop&q=60"],
        category: "home",
        category2: "lighting",
        category3: "lamp",
        size: "Medium"
    },
    {
        title: "Succulent Plant Set",
        description: "Set of 3 artificial succulent plants in ceramic pots. No maintenance required.",
        mrpPrice: 30,
        sellingPrice: 20,
        color: "Green",
        images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=60"],
        category: "home",
        category2: "decor",
        category3: "plant",
        size: "Small"
    }
];

async function seed() {
    try {
        console.log("Logging in as " + EMAIL + "...");
        const loginRes = await axios.post(`${BASE_URL}/sellers/login-password`, {
            email: EMAIL,
            password: PASSWORD
        });

        const jwt = loginRes.data.jwt;
        console.log("Logged in successfully. Token received.");

        let successCount = 0;
        for (const product of products) {
            try {
                console.log(`Creating product: ${product.title}...`);
                await axios.post(`${BASE_URL}/api/sellers/products`, product, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
                console.log(`✅ Created: ${product.title}`);
                successCount++;
            } catch (err) {
                console.error(`❌ Failed to create ${product.title}:`, err.message);
                if (err.response) {
                    console.error("Status:", err.response.status);
                    console.error("Data:", err.response.data);
                }
            }
        }

        console.log(`\nSeeding complete! Successfully created ${successCount} out of ${products.length} products.`);

    } catch (error) {
        console.error("Login failed:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

seed();
