import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data (children before parents) so this script can be
  // re-run against the same database without violating FK/unique constraints.
  await prisma.recipe_tags.deleteMany();
  await prisma.recipes.deleteMany();
  await prisma.tags.deleteMany();
  await prisma.users.deleteMany();

  // Users
  // NOTE: password_hash values are realistic-looking bcrypt-formatted
  // placeholders for local development seeding only — they are not derived
  // from real passwords and should never be used outside a dev/test DB.
  await prisma.users.createMany({
    data: [
      {
        id: '10000000-0000-4000-8000-000000000001',
        email: 'alice.nguyen@example.com',
        password_hash:
          '$2b$10$KixJ3vQeYh8LmZpNc61tRuG5aWq9Do0EsXfBj7VtHnUyOl4rPcSTa',
      },
      {
        id: '10000000-0000-4000-8000-000000000002',
        email: 'ben.martin@example.com',
        password_hash:
          '$2b$10$TmvQ8Jc2Xr6NyLoZ0aBdFeH3iKp7Sq9UwXz1CbGh5MnRt4VuYsQoLd',
      },
      {
        id: '10000000-0000-4000-8000-000000000003',
        email: 'charlie.osei@example.com',
        password_hash:
          '$2b$10$Ah7RfWq2Ns5Vy8LpXbCdEo1TgKm9ZuIj4HcQr6MtYv0BwXn3SkLoPa',
      },
      {
        id: '10000000-0000-4000-8000-000000000004',
        email: 'diana.silva@example.com',
        password_hash:
          '$2b$10$Nq3XvLp8Ry5Wc2ZbTaEo9KgMh6UjIf1DsQn4Xr7VtYo0BwCk5MzSaP',
      },
      {
        id: '10000000-0000-4000-8000-000000000005',
        email: 'ethan.park@example.com',
        password_hash:
          '$2b$10$Fw6TbNq9Xr2LmVc5ZoAe8KgSh1UjPf4DiQn7Yr0BtVc3XwMk6SzNaL',
      },
      {
        id: '10000000-0000-4000-8000-000000000006',
        email: 'fiona.brennan@example.com',
        password_hash:
          '$2b$10$Bq9XwLr3Nm6Vc8ZoTe1AgKh5UjSf7DiPn0Yr4BtQc2XwMk9SzFaLoR',
      },
      {
        id: '10000000-0000-4000-8000-000000000007',
        email: 'george.abbas@example.com',
        password_hash:
          '$2b$10$Sm4XbNr7Wq1Lc9ZoVe3AgKh6UjTf8DiPn2Yr5BtQc0XwMk3SzHaLoF',
      },
      {
        id: '10000000-0000-4000-8000-000000000008',
        email: 'hannah.kim@example.com',
        password_hash:
          '$2b$10$Rw8XbLq2Nm5Vc7ZoTe9AgKh3UjSf1DiPn4Yr6BtQc8XwMk1SzGaLoM',
      },
      {
        id: '10000000-0000-4000-8000-000000000009',
        email: 'ivan.petrov@example.com',
        password_hash:
          '$2b$10$Cq1XwNr5Wm8Vc3ZoTe6AgKh9UjSf2DiPn7Yr0BtQc4XwMk8SzJaLoT',
      },
      {
        id: '10000000-0000-4000-8000-000000000010',
        email: 'julia.moreau@example.com',
        password_hash:
          '$2b$10$Lm7XbQr1Nw4Vc9ZoTe2AgKh8UjSf5DiPn3Yr6BtQc7XwMk0SzKaLoY',
      },
    ],
  });

  // Tags
  await prisma.tags.createMany({
    data: [
      { id: '20000000-0000-4000-8000-000000000001', name: 'italian' },
      { id: '20000000-0000-4000-8000-000000000002', name: 'mexican' },
      { id: '20000000-0000-4000-8000-000000000003', name: 'indian' },
      { id: '20000000-0000-4000-8000-000000000004', name: 'japanese' },
      { id: '20000000-0000-4000-8000-000000000005', name: 'mediterranean' },
      { id: '20000000-0000-4000-8000-000000000006', name: 'french' },
      { id: '20000000-0000-4000-8000-000000000007', name: 'breakfast' },
      { id: '20000000-0000-4000-8000-000000000008', name: 'lunch' },
      { id: '20000000-0000-4000-8000-000000000009', name: 'dinner' },
      { id: '20000000-0000-4000-8000-000000000010', name: 'dessert' },
      { id: '20000000-0000-4000-8000-000000000011', name: 'appetizer' },
      { id: '20000000-0000-4000-8000-000000000012', name: 'snack' },
      { id: '20000000-0000-4000-8000-000000000013', name: 'healthy' },
      { id: '20000000-0000-4000-8000-000000000014', name: 'vegetarian' },
      { id: '20000000-0000-4000-8000-000000000015', name: 'vegan' },
      { id: '20000000-0000-4000-8000-000000000016', name: 'gluten-free' },
      { id: '20000000-0000-4000-8000-000000000017', name: 'quick' },
      { id: '20000000-0000-4000-8000-000000000018', name: 'comfort-food' },
    ],
  });

  // Recipes
  await prisma.recipes.createMany({
    data: [
      {
        id: '30000000-0000-4000-8000-000000000001',
        title: 'Spaghetti Carbonara',
        ingredients: [
          'spaghetti',
          'eggs',
          'parmesan cheese',
          'pancetta',
          'black pepper',
          'garlic',
        ],
        steps: [
          'Bring a large pot of salted water to a boil and cook the spaghetti until al dente.',
          'Cook the pancetta in a skillet until crispy.',
          'Whisk the eggs with grated parmesan and black pepper.',
          'Drain the pasta, reserving a little pasta water.',
          'Toss the hot pasta with the pancetta off the heat.',
          'Stir in the egg mixture quickly, adding pasta water as needed, until creamy.',
        ],
        user_id: '10000000-0000-4000-8000-000000000001',
      },
      {
        id: '30000000-0000-4000-8000-000000000002',
        title: 'Margherita Pizza',
        ingredients: [
          'pizza dough',
          'tomato sauce',
          'fresh mozzarella',
          'basil leaves',
          'olive oil',
          'salt',
        ],
        steps: [
          'Preheat the oven to 475°F (245°C), ideally with a pizza stone.',
          'Stretch the pizza dough into a round base.',
          'Spread a thin layer of tomato sauce over the dough.',
          'Tear the mozzarella and distribute it evenly.',
          'Bake until the crust is golden and the cheese is bubbling.',
          'Top with fresh basil and a drizzle of olive oil before serving.',
        ],
        user_id: '10000000-0000-4000-8000-000000000001',
      },
      {
        id: '30000000-0000-4000-8000-000000000003',
        title: 'Chocolate Brownies',
        ingredients: [
          'flour',
          'cocoa powder',
          'sugar',
          'eggs',
          'unsalted butter',
          'dark chocolate',
          'vanilla extract',
        ],
        steps: [
          'Preheat the oven to 350°F (175°C) and line a baking pan with parchment paper.',
          'Melt the butter and dark chocolate together.',
          'Whisk in the sugar, eggs, and vanilla extract.',
          'Fold in the flour and cocoa powder until just combined.',
          'Pour the batter into the pan and bake until set.',
          'Cool completely before slicing.',
        ],
        user_id: '10000000-0000-4000-8000-000000000001',
      },
      {
        id: '30000000-0000-4000-8000-000000000004',
        title: 'Mushroom Risotto',
        ingredients: [
          'arborio rice',
          'mushrooms',
          'vegetable stock',
          'onion',
          'white wine',
          'parmesan cheese',
          'butter',
        ],
        steps: [
          'Sauté the onion in butter until translucent.',
          'Add the mushrooms and cook until softened.',
          'Stir in the arborio rice and toast for a minute.',
          'Deglaze with white wine and let it absorb.',
          'Add warm vegetable stock a ladle at a time, stirring often, until creamy.',
          'Finish with parmesan cheese and a knob of butter.',
        ],
        user_id: '10000000-0000-4000-8000-000000000001',
      },
      {
        id: '30000000-0000-4000-8000-000000000005',
        title: 'Chicken Tacos',
        ingredients: [
          'chicken breast',
          'corn tortillas',
          'tomato',
          'lettuce',
          'avocado',
          'lime',
          'taco seasoning',
        ],
        steps: [
          'Season the chicken breast and cook until fully done.',
          'Slice the cooked chicken into strips.',
          'Warm the tortillas on a skillet.',
          'Fill the tortillas with chicken, lettuce, and tomato.',
          'Top with avocado slices and a squeeze of lime.',
        ],
        user_id: '10000000-0000-4000-8000-000000000002',
      },
      {
        id: '30000000-0000-4000-8000-000000000006',
        title: 'Guacamole',
        ingredients: [
          'avocado',
          'lime',
          'tomato',
          'red onion',
          'cilantro',
          'salt',
          'jalapeño',
        ],
        steps: [
          'Mash the avocado in a bowl.',
          'Finely dice the tomato, onion, and jalapeño.',
          'Chop the cilantro.',
          'Mix everything together with lime juice and salt.',
          'Serve immediately with tortilla chips.',
        ],
        user_id: '10000000-0000-4000-8000-000000000002',
      },
      {
        id: '30000000-0000-4000-8000-000000000007',
        title: 'Beef Burritos',
        ingredients: [
          'ground beef',
          'flour tortillas',
          'rice',
          'black beans',
          'cheddar cheese',
          'salsa',
          'sour cream',
        ],
        steps: [
          'Brown the ground beef with taco seasoning.',
          'Cook the rice according to package instructions.',
          'Warm the black beans in a saucepan.',
          'Layer beef, rice, beans, and cheese onto each tortilla.',
          'Roll tightly into burritos.',
          'Serve with salsa and sour cream.',
        ],
        user_id: '10000000-0000-4000-8000-000000000002',
      },
      {
        id: '30000000-0000-4000-8000-000000000008',
        title: 'Pancakes',
        ingredients: [
          'flour',
          'milk',
          'eggs',
          'sugar',
          'baking powder',
          'butter',
          'vanilla extract',
        ],
        steps: [
          'Mix the flour, sugar, and baking powder in a bowl.',
          'Whisk in the milk, eggs, and vanilla extract until smooth.',
          'Heat a lightly buttered pan over medium heat.',
          'Pour batter onto the pan and cook until bubbles form.',
          'Flip and cook until golden on both sides.',
          'Serve warm with butter and syrup.',
        ],
        user_id: '10000000-0000-4000-8000-000000000003',
      },
      {
        id: '30000000-0000-4000-8000-000000000009',
        title: 'Greek Salad',
        ingredients: [
          'cucumber',
          'tomatoes',
          'red onion',
          'feta cheese',
          'kalamata olives',
          'olive oil',
          'oregano',
        ],
        steps: [
          'Chop the cucumber and tomatoes into chunks.',
          'Thinly slice the red onion.',
          'Combine the vegetables with olives and feta in a bowl.',
          'Drizzle with olive oil and sprinkle with oregano.',
          'Toss gently and serve.',
        ],
        user_id: '10000000-0000-4000-8000-000000000003',
      },
      {
        id: '30000000-0000-4000-8000-000000000010',
        title: 'Butter Chicken',
        ingredients: [
          'chicken thighs',
          'yogurt',
          'tomato puree',
          'butter',
          'cream',
          'garam masala',
          'garlic',
          'ginger',
        ],
        steps: [
          'Marinate the chicken in yogurt and spices for at least an hour.',
          'Sear the chicken until browned, then set aside.',
          'Sauté garlic and ginger in butter.',
          'Add the tomato puree and simmer until thickened.',
          'Stir in the cream and garam masala.',
          'Return the chicken to the sauce and simmer until cooked through.',
        ],
        user_id: '10000000-0000-4000-8000-000000000003',
      },
      {
        id: '30000000-0000-4000-8000-000000000011',
        title: 'Avocado Toast',
        ingredients: [
          'sourdough bread',
          'avocado',
          'lemon',
          'salt',
          'black pepper',
          'chili flakes',
        ],
        steps: [
          'Toast the sourdough bread until golden.',
          'Mash the avocado with lemon juice, salt, and pepper.',
          'Spread the mashed avocado over the toast.',
          'Sprinkle with chili flakes and serve.',
        ],
        user_id: '10000000-0000-4000-8000-000000000004',
      },
      {
        id: '30000000-0000-4000-8000-000000000012',
        title: 'Chana Masala',
        ingredients: [
          'chickpeas',
          'onion',
          'tomato',
          'garlic',
          'ginger',
          'cumin',
          'coriander',
          'garam masala',
        ],
        steps: [
          'Sauté the onion until golden.',
          'Add garlic, ginger, and spices, cooking until fragrant.',
          'Stir in the tomatoes and cook until softened.',
          'Add the chickpeas and a splash of water.',
          'Simmer until the sauce thickens.',
          'Garnish with fresh cilantro before serving.',
        ],
        user_id: '10000000-0000-4000-8000-000000000004',
      },
      {
        id: '30000000-0000-4000-8000-000000000013',
        title: 'Baklava',
        ingredients: [
          'phyllo dough',
          'walnuts',
          'pistachios',
          'butter',
          'honey',
          'sugar',
          'cinnamon',
        ],
        steps: [
          'Preheat the oven to 350°F (175°C).',
          'Layer sheets of phyllo dough in a baking pan, brushing each with melted butter.',
          'Sprinkle a mixture of chopped walnuts, pistachios, and cinnamon between layers.',
          'Continue layering until the ingredients are used up.',
          'Cut into diamond shapes and bake until golden and crisp.',
          'Pour warm honey syrup over the baklava while still hot.',
        ],
        user_id: '10000000-0000-4000-8000-000000000004',
      },
      {
        id: '30000000-0000-4000-8000-000000000014',
        title: 'Chicken Teriyaki',
        ingredients: [
          'chicken thighs',
          'soy sauce',
          'mirin',
          'sugar',
          'garlic',
          'ginger',
          'sesame seeds',
        ],
        steps: [
          'Mix soy sauce, mirin, sugar, garlic, and ginger to make the teriyaki sauce.',
          'Sear the chicken thighs skin-side down until crisp.',
          'Flip and cook until nearly done.',
          'Pour the teriyaki sauce over the chicken and simmer until glazed.',
          'Slice and sprinkle with sesame seeds before serving.',
        ],
        user_id: '10000000-0000-4000-8000-000000000005',
      },
      {
        id: '30000000-0000-4000-8000-000000000015',
        title: 'Miso Soup',
        ingredients: [
          'dashi stock',
          'miso paste',
          'tofu',
          'green onion',
          'seaweed',
        ],
        steps: [
          'Heat the dashi stock in a pot without letting it boil.',
          'Dissolve the miso paste into the stock.',
          'Add cubed tofu and seaweed.',
          'Simmer gently for a few minutes.',
          'Garnish with sliced green onion and serve hot.',
        ],
        user_id: '10000000-0000-4000-8000-000000000005',
      },
      {
        id: '30000000-0000-4000-8000-000000000016',
        title: 'Vegetable Sushi Rolls',
        ingredients: [
          'sushi rice',
          'nori sheets',
          'cucumber',
          'carrot',
          'avocado',
          'rice vinegar',
          'soy sauce',
        ],
        steps: [
          'Cook the sushi rice and season it with rice vinegar.',
          'Lay a nori sheet on a bamboo mat and spread the rice evenly.',
          'Arrange cucumber, carrot, and avocado strips along the center.',
          'Roll tightly using the bamboo mat.',
          'Slice into pieces with a sharp knife.',
          'Serve with soy sauce for dipping.',
        ],
        user_id: '10000000-0000-4000-8000-000000000005',
      },
      {
        id: '30000000-0000-4000-8000-000000000017',
        title: 'Ratatouille',
        ingredients: [
          'eggplant',
          'zucchini',
          'bell pepper',
          'tomato',
          'onion',
          'garlic',
          'olive oil',
          'herbes de Provence',
        ],
        steps: [
          'Slice the eggplant, zucchini, bell pepper, and tomato.',
          'Sauté the onion and garlic in olive oil.',
          'Layer the sliced vegetables in a baking dish over the onion mixture.',
          'Sprinkle with herbes de Provence and drizzle with olive oil.',
          'Cover and bake until the vegetables are tender.',
          'Uncover and bake briefly to lightly brown the top.',
        ],
        user_id: '10000000-0000-4000-8000-000000000006',
      },
      {
        id: '30000000-0000-4000-8000-000000000018',
        title: 'Crepes',
        ingredients: [
          'flour',
          'eggs',
          'milk',
          'butter',
          'sugar',
          'vanilla extract',
          'salt',
        ],
        steps: [
          'Whisk together the flour, eggs, milk, sugar, and salt until smooth.',
          'Let the batter rest for at least 30 minutes.',
          'Melt a small amount of butter in a nonstick pan.',
          'Pour a thin layer of batter and swirl to coat the pan.',
          'Cook until the edges lift, then flip and cook briefly.',
          'Fill or top with fruit, chocolate, or syrup as desired.',
        ],
        user_id: '10000000-0000-4000-8000-000000000006',
      },
      {
        id: '30000000-0000-4000-8000-000000000019',
        title: 'French Onion Soup',
        ingredients: [
          'onions',
          'beef stock',
          'butter',
          'dry white wine',
          'baguette',
          'gruyère cheese',
          'thyme',
        ],
        steps: [
          'Slowly caramelize the onions in butter over low heat.',
          'Deglaze the pot with white wine.',
          'Add the beef stock and thyme, then simmer.',
          'Ladle the soup into oven-safe bowls.',
          'Top with a slice of baguette and grated gruyère.',
          'Broil until the cheese is melted and bubbly.',
        ],
        user_id: '10000000-0000-4000-8000-000000000006',
      },
      {
        id: '30000000-0000-4000-8000-000000000020',
        title: 'Hummus',
        ingredients: [
          'chickpeas',
          'tahini',
          'lemon',
          'garlic',
          'olive oil',
          'cumin',
          'salt',
        ],
        steps: [
          'Drain and rinse the chickpeas.',
          'Blend the chickpeas with tahini, lemon juice, and garlic.',
          'Add olive oil and cumin, blending until smooth.',
          'Season with salt to taste.',
          'Transfer to a bowl and drizzle with more olive oil before serving.',
        ],
        user_id: '10000000-0000-4000-8000-000000000007',
      },
      {
        id: '30000000-0000-4000-8000-000000000021',
        title: 'Falafel Wrap',
        ingredients: [
          'chickpeas',
          'parsley',
          'garlic',
          'cumin',
          'flatbread',
          'lettuce',
          'tahini sauce',
        ],
        steps: [
          'Blend the chickpeas with parsley, garlic, and cumin until coarse.',
          'Shape the mixture into small patties.',
          'Fry or bake the patties until golden and crisp.',
          'Warm the flatbread.',
          'Fill with falafel, lettuce, and tahini sauce, then wrap.',
        ],
        user_id: '10000000-0000-4000-8000-000000000007',
      },
      {
        id: '30000000-0000-4000-8000-000000000022',
        title: 'Shakshuka',
        ingredients: [
          'eggs',
          'tomatoes',
          'bell pepper',
          'onion',
          'garlic',
          'paprika',
          'cumin',
          'feta cheese',
        ],
        steps: [
          'Sauté the onion and bell pepper until softened.',
          'Add garlic, paprika, and cumin, cooking until fragrant.',
          'Stir in the tomatoes and simmer until thickened.',
          'Make small wells in the sauce and crack the eggs into them.',
          'Cover and cook until the eggs are set to your liking.',
          'Crumble feta on top before serving.',
        ],
        user_id: '10000000-0000-4000-8000-000000000007',
      },
      {
        id: '30000000-0000-4000-8000-000000000023',
        title: 'Overnight Oats',
        ingredients: [
          'rolled oats',
          'almond milk',
          'chia seeds',
          'maple syrup',
          'banana',
          'cinnamon',
        ],
        steps: [
          'Combine the rolled oats, almond milk, and chia seeds in a jar.',
          'Stir in the maple syrup and cinnamon.',
          'Slice the banana and layer it in the jar.',
          'Cover and refrigerate overnight.',
          'Stir before eating, adding extra toppings if desired.',
        ],
        user_id: '10000000-0000-4000-8000-000000000008',
      },
      {
        id: '30000000-0000-4000-8000-000000000024',
        title: 'Banana Bread',
        ingredients: [
          'ripe bananas',
          'flour',
          'sugar',
          'eggs',
          'butter',
          'baking soda',
          'vanilla extract',
        ],
        steps: [
          'Preheat the oven to 350°F (175°C) and grease a loaf pan.',
          'Mash the ripe bananas in a bowl.',
          'Mix in the melted butter, sugar, eggs, and vanilla extract.',
          'Fold in the flour and baking soda until just combined.',
          'Pour the batter into the loaf pan.',
          'Bake until a toothpick comes out clean, then cool before slicing.',
        ],
        user_id: '10000000-0000-4000-8000-000000000008',
      },
      {
        id: '30000000-0000-4000-8000-000000000025',
        title: 'Vegetable Biryani',
        ingredients: [
          'basmati rice',
          'mixed vegetables',
          'onion',
          'yogurt',
          'biryani masala',
          'saffron',
          'mint',
        ],
        steps: [
          'Soak the basmati rice for 30 minutes, then parboil it.',
          'Sauté the onion until golden and fragrant.',
          'Add the mixed vegetables and biryani masala, cooking until tender.',
          'Stir in the yogurt.',
          'Layer the parboiled rice over the vegetable mixture.',
          'Top with saffron-infused milk and mint, then cover and steam until fully cooked.',
        ],
        user_id: '10000000-0000-4000-8000-000000000008',
      },
      {
        id: '30000000-0000-4000-8000-000000000026',
        title: 'Palak Paneer',
        ingredients: [
          'spinach',
          'paneer',
          'onion',
          'tomato',
          'garlic',
          'ginger',
          'garam masala',
          'cream',
        ],
        steps: [
          'Blanch the spinach and blend it into a smooth puree.',
          'Sauté the onion, garlic, and ginger until golden.',
          'Add the tomato and cook until softened.',
          'Stir in the spinach puree and garam masala.',
          'Add cubed paneer and simmer gently.',
          'Finish with a swirl of cream before serving.',
        ],
        user_id: '10000000-0000-4000-8000-000000000009',
      },
      {
        id: '30000000-0000-4000-8000-000000000027',
        title: 'Samosas',
        ingredients: [
          'potatoes',
          'peas',
          'flour',
          'cumin seeds',
          'garam masala',
          'oil',
          'ginger',
        ],
        steps: [
          'Boil and mash the potatoes.',
          'Sauté cumin seeds, ginger, peas, and garam masala, then mix in the potatoes.',
          'Prepare the dough with flour, oil, and water.',
          'Roll the dough and shape it into cones.',
          'Fill each cone with the potato mixture and seal the edges.',
          'Fry the samosas until golden and crisp.',
        ],
        user_id: '10000000-0000-4000-8000-000000000009',
      },
      {
        id: '30000000-0000-4000-8000-000000000028',
        title: 'Mango Lassi',
        ingredients: ['ripe mango', 'yogurt', 'milk', 'sugar', 'cardamom'],
        steps: [
          'Peel and chop the ripe mango.',
          'Blend the mango with yogurt and milk until smooth.',
          'Add sugar and a pinch of cardamom.',
          'Blend again briefly to combine.',
          'Pour into glasses and serve chilled.',
        ],
        user_id: '10000000-0000-4000-8000-000000000009',
      },
      {
        id: '30000000-0000-4000-8000-000000000029',
        title: 'Quiche Lorraine',
        ingredients: [
          'pie crust',
          'eggs',
          'cream',
          'bacon',
          'gruyère cheese',
          'onion',
          'nutmeg',
        ],
        steps: [
          'Preheat the oven to 375°F (190°C) and blind-bake the pie crust.',
          'Cook the bacon and onion until browned.',
          'Whisk together the eggs, cream, and a pinch of nutmeg.',
          'Scatter the bacon, onion, and cheese over the crust.',
          'Pour the egg mixture on top.',
          'Bake until the filling is set and golden.',
        ],
        user_id: '10000000-0000-4000-8000-000000000010',
      },
      {
        id: '30000000-0000-4000-8000-000000000030',
        title: 'Coq au Vin',
        ingredients: [
          'chicken thighs',
          'red wine',
          'bacon',
          'mushrooms',
          'pearl onions',
          'garlic',
          'thyme',
        ],
        steps: [
          'Brown the bacon in a large pot and set aside.',
          'Sear the chicken thighs in the bacon fat until golden.',
          'Add the pearl onions, mushrooms, and garlic, cooking briefly.',
          'Pour in the red wine and add thyme.',
          'Return the bacon and chicken to the pot.',
          'Cover and simmer until the chicken is tender.',
        ],
        user_id: '10000000-0000-4000-8000-000000000010',
      },
      {
        id: '30000000-0000-4000-8000-000000000031',
        title: 'Tabbouleh',
        ingredients: [
          'parsley',
          'bulgur wheat',
          'tomato',
          'cucumber',
          'lemon',
          'olive oil',
          'mint',
        ],
        steps: [
          'Soak the bulgur wheat until tender, then drain well.',
          'Finely chop the parsley, mint, tomato, and cucumber.',
          'Combine the bulgur with the chopped vegetables and herbs.',
          'Whisk together lemon juice and olive oil, then toss with the salad.',
          'Season with salt and chill briefly before serving.',
        ],
        user_id: '10000000-0000-4000-8000-000000000010',
      },
      {
        id: '30000000-0000-4000-8000-000000000032',
        title: 'Apple Pie',
        ingredients: [
          'apples',
          'pie crust',
          'sugar',
          'cinnamon',
          'lemon juice',
          'butter',
          'flour',
        ],
        steps: [
          'Preheat the oven to 375°F (190°C).',
          'Peel and slice the apples, then toss with sugar, cinnamon, flour, and lemon juice.',
          'Line a pie dish with one layer of crust and add the apple filling.',
          'Dot the filling with small pieces of butter.',
          'Cover with the second layer of crust and crimp the edges.',
          'Bake until the crust is golden and the filling is bubbling.',
        ],
        user_id: '10000000-0000-4000-8000-000000000010',
      },
    ],
  });

  // Recipe ↔ Tag relationships
  await prisma.recipe_tags.createMany({
    data: [
      // Spaghetti Carbonara
      {
        recipe_id: '30000000-0000-4000-8000-000000000001',
        tag_id: '20000000-0000-4000-8000-000000000001',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000001',
        tag_id: '20000000-0000-4000-8000-000000000009',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000001',
        tag_id: '20000000-0000-4000-8000-000000000018',
      },
      // Margherita Pizza
      {
        recipe_id: '30000000-0000-4000-8000-000000000002',
        tag_id: '20000000-0000-4000-8000-000000000001',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000002',
        tag_id: '20000000-0000-4000-8000-000000000009',
      },
      // Chocolate Brownies
      {
        recipe_id: '30000000-0000-4000-8000-000000000003',
        tag_id: '20000000-0000-4000-8000-000000000010',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000003',
        tag_id: '20000000-0000-4000-8000-000000000018',
      },
      // Mushroom Risotto
      {
        recipe_id: '30000000-0000-4000-8000-000000000004',
        tag_id: '20000000-0000-4000-8000-000000000001',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000004',
        tag_id: '20000000-0000-4000-8000-000000000009',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000004',
        tag_id: '20000000-0000-4000-8000-000000000014',
      },
      // Chicken Tacos
      {
        recipe_id: '30000000-0000-4000-8000-000000000005',
        tag_id: '20000000-0000-4000-8000-000000000002',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000005',
        tag_id: '20000000-0000-4000-8000-000000000009',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000005',
        tag_id: '20000000-0000-4000-8000-000000000017',
      },
      // Guacamole
      {
        recipe_id: '30000000-0000-4000-8000-000000000006',
        tag_id: '20000000-0000-4000-8000-000000000002',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000006',
        tag_id: '20000000-0000-4000-8000-000000000011',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000006',
        tag_id: '20000000-0000-4000-8000-000000000015',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000006',
        tag_id: '20000000-0000-4000-8000-000000000017',
      },
      // Beef Burritos
      {
        recipe_id: '30000000-0000-4000-8000-000000000007',
        tag_id: '20000000-0000-4000-8000-000000000002',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000007',
        tag_id: '20000000-0000-4000-8000-000000000009',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000007',
        tag_id: '20000000-0000-4000-8000-000000000018',
      },
      // Pancakes
      {
        recipe_id: '30000000-0000-4000-8000-000000000008',
        tag_id: '20000000-0000-4000-8000-000000000007',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000008',
        tag_id: '20000000-0000-4000-8000-000000000018',
      },
      // Greek Salad
      {
        recipe_id: '30000000-0000-4000-8000-000000000009',
        tag_id: '20000000-0000-4000-8000-000000000005',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000009',
        tag_id: '20000000-0000-4000-8000-000000000008',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000009',
        tag_id: '20000000-0000-4000-8000-000000000013',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000009',
        tag_id: '20000000-0000-4000-8000-000000000014',
      },
      // Butter Chicken
      {
        recipe_id: '30000000-0000-4000-8000-000000000010',
        tag_id: '20000000-0000-4000-8000-000000000003',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000010',
        tag_id: '20000000-0000-4000-8000-000000000009',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000010',
        tag_id: '20000000-0000-4000-8000-000000000018',
      },
      // Avocado Toast
      {
        recipe_id: '30000000-0000-4000-8000-000000000011',
        tag_id: '20000000-0000-4000-8000-000000000007',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000011',
        tag_id: '20000000-0000-4000-8000-000000000013',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000011',
        tag_id: '20000000-0000-4000-8000-000000000014',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000011',
        tag_id: '20000000-0000-4000-8000-000000000017',
      },
      // Chana Masala
      {
        recipe_id: '30000000-0000-4000-8000-000000000012',
        tag_id: '20000000-0000-4000-8000-000000000003',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000012',
        tag_id: '20000000-0000-4000-8000-000000000009',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000012',
        tag_id: '20000000-0000-4000-8000-000000000013',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000012',
        tag_id: '20000000-0000-4000-8000-000000000015',
      },
      // Baklava
      {
        recipe_id: '30000000-0000-4000-8000-000000000013',
        tag_id: '20000000-0000-4000-8000-000000000005',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000013',
        tag_id: '20000000-0000-4000-8000-000000000010',
      },
      // Chicken Teriyaki
      {
        recipe_id: '30000000-0000-4000-8000-000000000014',
        tag_id: '20000000-0000-4000-8000-000000000004',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000014',
        tag_id: '20000000-0000-4000-8000-000000000009',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000014',
        tag_id: '20000000-0000-4000-8000-000000000017',
      },
      // Miso Soup
      {
        recipe_id: '30000000-0000-4000-8000-000000000015',
        tag_id: '20000000-0000-4000-8000-000000000004',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000015',
        tag_id: '20000000-0000-4000-8000-000000000011',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000015',
        tag_id: '20000000-0000-4000-8000-000000000013',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000015',
        tag_id: '20000000-0000-4000-8000-000000000015',
      },
      // Vegetable Sushi Rolls
      {
        recipe_id: '30000000-0000-4000-8000-000000000016',
        tag_id: '20000000-0000-4000-8000-000000000004',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000016',
        tag_id: '20000000-0000-4000-8000-000000000008',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000016',
        tag_id: '20000000-0000-4000-8000-000000000013',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000016',
        tag_id: '20000000-0000-4000-8000-000000000014',
      },
      // Ratatouille
      {
        recipe_id: '30000000-0000-4000-8000-000000000017',
        tag_id: '20000000-0000-4000-8000-000000000006',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000017',
        tag_id: '20000000-0000-4000-8000-000000000009',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000017',
        tag_id: '20000000-0000-4000-8000-000000000013',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000017',
        tag_id: '20000000-0000-4000-8000-000000000015',
      },
      // Crepes
      {
        recipe_id: '30000000-0000-4000-8000-000000000018',
        tag_id: '20000000-0000-4000-8000-000000000006',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000018',
        tag_id: '20000000-0000-4000-8000-000000000007',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000018',
        tag_id: '20000000-0000-4000-8000-000000000010',
      },
      // French Onion Soup
      {
        recipe_id: '30000000-0000-4000-8000-000000000019',
        tag_id: '20000000-0000-4000-8000-000000000006',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000019',
        tag_id: '20000000-0000-4000-8000-000000000011',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000019',
        tag_id: '20000000-0000-4000-8000-000000000018',
      },
      // Hummus
      {
        recipe_id: '30000000-0000-4000-8000-000000000020',
        tag_id: '20000000-0000-4000-8000-000000000005',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000020',
        tag_id: '20000000-0000-4000-8000-000000000012',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000020',
        tag_id: '20000000-0000-4000-8000-000000000013',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000020',
        tag_id: '20000000-0000-4000-8000-000000000015',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000020',
        tag_id: '20000000-0000-4000-8000-000000000017',
      },
      // Falafel Wrap
      {
        recipe_id: '30000000-0000-4000-8000-000000000021',
        tag_id: '20000000-0000-4000-8000-000000000005',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000021',
        tag_id: '20000000-0000-4000-8000-000000000008',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000021',
        tag_id: '20000000-0000-4000-8000-000000000014',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000021',
        tag_id: '20000000-0000-4000-8000-000000000017',
      },
      // Shakshuka
      {
        recipe_id: '30000000-0000-4000-8000-000000000022',
        tag_id: '20000000-0000-4000-8000-000000000005',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000022',
        tag_id: '20000000-0000-4000-8000-000000000007',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000022',
        tag_id: '20000000-0000-4000-8000-000000000014',
      },
      // Overnight Oats
      {
        recipe_id: '30000000-0000-4000-8000-000000000023',
        tag_id: '20000000-0000-4000-8000-000000000007',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000023',
        tag_id: '20000000-0000-4000-8000-000000000013',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000023',
        tag_id: '20000000-0000-4000-8000-000000000015',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000023',
        tag_id: '20000000-0000-4000-8000-000000000017',
      },
      // Banana Bread
      {
        recipe_id: '30000000-0000-4000-8000-000000000024',
        tag_id: '20000000-0000-4000-8000-000000000007',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000024',
        tag_id: '20000000-0000-4000-8000-000000000010',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000024',
        tag_id: '20000000-0000-4000-8000-000000000018',
      },
      // Vegetable Biryani
      {
        recipe_id: '30000000-0000-4000-8000-000000000025',
        tag_id: '20000000-0000-4000-8000-000000000003',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000025',
        tag_id: '20000000-0000-4000-8000-000000000009',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000025',
        tag_id: '20000000-0000-4000-8000-000000000014',
      },
      // Palak Paneer
      {
        recipe_id: '30000000-0000-4000-8000-000000000026',
        tag_id: '20000000-0000-4000-8000-000000000003',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000026',
        tag_id: '20000000-0000-4000-8000-000000000009',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000026',
        tag_id: '20000000-0000-4000-8000-000000000014',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000026',
        tag_id: '20000000-0000-4000-8000-000000000016',
      },
      // Samosas
      {
        recipe_id: '30000000-0000-4000-8000-000000000027',
        tag_id: '20000000-0000-4000-8000-000000000003',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000027',
        tag_id: '20000000-0000-4000-8000-000000000011',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000027',
        tag_id: '20000000-0000-4000-8000-000000000012',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000027',
        tag_id: '20000000-0000-4000-8000-000000000014',
      },
      // Mango Lassi
      {
        recipe_id: '30000000-0000-4000-8000-000000000028',
        tag_id: '20000000-0000-4000-8000-000000000003',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000028',
        tag_id: '20000000-0000-4000-8000-000000000012',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000028',
        tag_id: '20000000-0000-4000-8000-000000000014',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000028',
        tag_id: '20000000-0000-4000-8000-000000000016',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000028',
        tag_id: '20000000-0000-4000-8000-000000000017',
      },
      // Quiche Lorraine
      {
        recipe_id: '30000000-0000-4000-8000-000000000029',
        tag_id: '20000000-0000-4000-8000-000000000006',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000029',
        tag_id: '20000000-0000-4000-8000-000000000007',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000029',
        tag_id: '20000000-0000-4000-8000-000000000008',
      },
      // Coq au Vin
      {
        recipe_id: '30000000-0000-4000-8000-000000000030',
        tag_id: '20000000-0000-4000-8000-000000000006',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000030',
        tag_id: '20000000-0000-4000-8000-000000000009',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000030',
        tag_id: '20000000-0000-4000-8000-000000000018',
      },
      // Tabbouleh
      {
        recipe_id: '30000000-0000-4000-8000-000000000031',
        tag_id: '20000000-0000-4000-8000-000000000005',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000031',
        tag_id: '20000000-0000-4000-8000-000000000008',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000031',
        tag_id: '20000000-0000-4000-8000-000000000013',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000031',
        tag_id: '20000000-0000-4000-8000-000000000015',
      },
      // Apple Pie
      {
        recipe_id: '30000000-0000-4000-8000-000000000032',
        tag_id: '20000000-0000-4000-8000-000000000010',
      },
      {
        recipe_id: '30000000-0000-4000-8000-000000000032',
        tag_id: '20000000-0000-4000-8000-000000000018',
      },
    ],
  });

  console.log('🌱 Database seeded successfully!');
  console.log('   Users: 10 | Tags: 18 | Recipes: 32 | Recipe-Tag links: 107');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
