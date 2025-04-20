# Recipe Manager X

A modern, user-friendly recipe management platform built with React that helps you organize recipes, plan meals, and manage shopping lists.

## 🌟 Features

### 1. Recipe Management
- Create, edit, and delete recipes
- Categorize recipes by cuisine, meal type, or dietary preferences
- Search and filter recipes
- Add favorite recipes to quick access

![Recipe Management Screenshot]
[Add a screenshot of the recipe management interface]

### 2. Recipe Details
- Detailed recipe views with ingredients and instructions
- Serving size adjustment
- Cooking time and difficulty level
- Nutritional information

![Recipe Details Screenshot]
[Add a screenshot of a recipe detail page]

### 3. Meal Planner
- Plan meals for days or weeks
- Drag and drop interface for easy planning
- Calendar view of meal plans
- Quick recipe assignment to different days
- Export meal plans to PDF for offline access or printing
- Weekly and monthly view options

![Meal Planner Screenshot]
[Add a screenshot of the meal planner interface]

#### PDF Export Feature
![Meal Planner PDF Export]
[Add a screenshot of the exported meal planner PDF]

### 4. Shopping List
- Automatic shopping list generation from meal plans
- Manual item addition
- Check off items while shopping
- Categorized items for easier shopping
- Export shopping list to PDF for offline use
- Smart categorization for efficient shopping

![Shopping List Screenshot]
[Add a screenshot of the shopping list feature]

#### PDF Export Feature
![Shopping List PDF Export]
[Add a screenshot of the exported shopping list PDF]

## 🚀 Live Demo

Check out the live application at: [https://recipemanagerx.vercel.app/](https://recipemanagerx.vercel.app/)

## 💻 Tech Stack

- React.js
- Chakra UI
- Tailwind CSS
- React Router
- Context API for state management
- Vercel for deployment
- PDF generation with html2pdf.js for exporting meal plans and shopping lists
- Axios for API requests

## ⚙️ Installation and Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/SubhanRahiman7/Recipe-Manager.git
cd Recipe-Manager/recipe-management-platform
```

2. **Install dependencies**
```bash
npm install
```

This will install all required dependencies including:
- React and React DOM
- Chakra UI for components
- Tailwind CSS for styling
- React Router for navigation
- html2pdf.js for PDF export
- Axios for API requests

3. **Development Mode**

To start the development server:
```bash
npm run dev
```
This will start the Vite development server. Your application will be available at `http://localhost:5173`

4. **Linting**

To check for linting errors:
```bash
npm run lint
```

### Production Build

1. **Create production build**
```bash
npm run build
```
This will create an optimized production build in the `dist` directory.

2. **Preview production build**
```bash
npm run preview
```
This will serve the production build locally for testing.

### Deployment

The application is configured for deployment on Vercel. The `vercel.json` configuration handles:
- Client-side routing
- API redirects
- Static file serving

To deploy to Vercel:
1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically build and deploy your application

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

![Responsive Design Screenshots]
[Add screenshots showing the app on different devices]

## 🔒 Security

- All API requests are authenticated
- Secure data storage
- Input validation and sanitization
- CORS protection
- XSS prevention

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email [subhanrahiman007@gmail.com] or open an issue in the repository.

---
Made with ❤️ by Subhan Rahiman 