# Hat Store E-commerce

A modern e-commerce website for selling hats, built with Next.js, React, TypeScript, Tailwind CSS, and Shadcn/UI.

## Features

- **Modern Design**: Clean black and white design with focus on product display
- **Responsive Layout**: Works seamlessly on all devices from mobile to desktop
- **Product Browsing**: Browse products by collection or featured items
- **Product Details**: View detailed product information, select size, and add to cart
- **Shopping Cart**: Simple cart management with quantity adjustment
- **Collection Pages**: View products organized by collections

## Technologies Used

- **Next.js 14**: Utilizing the App Router for optimized page rendering and routing
- **React 18**: For building interactive user interfaces
- **TypeScript**: For type-safe code and better developer experience
- **Tailwind CSS**: For utility-first styling
- **Shadcn/UI**: For accessible and customizable UI components
- **PNPM**: Fast, disk space efficient package manager

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hat-store.git
   cd hat-store
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
hat-store/
├── src/
│   ├── app/                    # App Router pages and layouts
│   │   ├── layout/             # Layout components (Navbar, Footer, etc.)
│   │   ├── home/               # Home page components
│   │   ├── product/            # Product components
│   │   ├── cart/               # Cart components
│   │   └── ui/                 # Reusable UI components
│   ├── data/                   # Mock data for development
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   └── types/                  # TypeScript types
└── public/                     # Static assets
```

## Pages

- **Home**: Features hero banner, featured collections, and product grids
- **Collections**: Browse all available collections
- **Collection Detail**: View products in a specific collection
- **Product Detail**: View product information and options
- **Cart**: Manage items in the shopping cart

## Future Enhancements

- User authentication
- Wishlist functionality
- Product reviews
- Advanced filtering and search
- Payment processing integration
- Admin dashboard for product management

## License

MIT

## Credits

- Images from [Unsplash](https://unsplash.com/)
