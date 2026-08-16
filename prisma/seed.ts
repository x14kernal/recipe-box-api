import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Users
  await prisma.users.createMany({
    data: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'alice@example.com',
        password_hash: 'demo-password-hash',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'bob@example.com',
        password_hash: 'demo-password-hash',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'charlie@example.com',
        password_hash: 'demo-password-hash',
      },
      {
        id: '4444444444-4444-44444-4444-444444444',
        email: 'ali@example.com',
        password_hash: 'demo-password-hash',
      },
    ],
  });

  // Tags
  await prisma.tags.createMany({
    data: [
      { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Italian' },
      { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Mexican' },
      { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'Breakfast' },
      { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', name: 'Healthy' },
      { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', name: 'Quick' },
      { id: 'ffffffff-ffff-ffff-ffff-ffffffffffff', name: 'Dessert' },
    ],
  });

  // Recipes
  await prisma.recipes.createMany({
    data: [
      {
        id: '10000000-0000-0000-0000-000000000001',
        title: 'Spaghetti Carbonara',
        ingredients: [
          'spaghetti',
          'eggs',
          'parmesan cheese',
          'pancetta',
          'black pepper',
        ],
        steps: [
          'Boil the spaghetti.',
          'Cook the pancetta until crispy.',
          'Mix eggs with parmesan.',
          'Combine pasta with pancetta.',
          'Remove from heat and mix in the egg mixture.',
          'Add black pepper and serve.',
        ],
        user_id: '11111111-1111-1111-1111-111111111111',
      },
      {
        id: '10000000-0000-0000-0000-000000000002',
        title: 'Margherita Pizza',
        ingredients: [
          'pizza dough',
          'tomato sauce',
          'mozzarella',
          'basil',
          'olive oil',
        ],
        steps: [
          'Prepare the pizza dough.',
          'Spread tomato sauce over the dough.',
          'Add mozzarella.',
          'Bake until golden.',
          'Add fresh basil and olive oil.',
        ],
        user_id: '11111111-1111-1111-1111-111111111111',
      },
      {
        id: '10000000-0000-0000-0000-000000000003',
        title: 'Chicken Tacos',
        ingredients: [
          'chicken breast',
          'tortillas',
          'tomato',
          'lettuce',
          'avocado',
          'lime',
        ],
        steps: [
          'Cook and season the chicken.',
          'Slice the vegetables.',
          'Warm the tortillas.',
          'Fill tortillas with chicken and vegetables.',
          'Add lime juice and serve.',
        ],
        user_id: '22222222-2222-2222-2222-222222222222',
      },
      {
        id: '10000000-0000-0000-0000-000000000004',
        title: 'Guacamole',
        ingredients: ['avocado', 'lime', 'tomato', 'onion', 'cilantro', 'salt'],
        steps: [
          'Mash the avocado.',
          'Dice tomato and onion.',
          'Mix everything together.',
          'Add lime juice and salt.',
          'Serve immediately.',
        ],
        user_id: '22222222-2222-2222-2222-222222222222',
      },
      {
        id: '10000000-0000-0000-0000-000000000005',
        title: 'Pancakes',
        ingredients: [
          'flour',
          'milk',
          'eggs',
          'sugar',
          'baking powder',
          'butter',
        ],
        steps: [
          'Mix the dry ingredients.',
          'Add milk and eggs.',
          'Whisk until combined.',
          'Cook pancakes on a hot pan.',
          'Serve with butter and syrup.',
        ],
        user_id: '33333333-3333-3333-3333-333333333333',
      },
      {
        id: '10000000-0000-0000-0000-000000000006',
        title: 'Greek Salad',
        ingredients: [
          'cucumber',
          'tomatoes',
          'red onion',
          'feta cheese',
          'olives',
          'olive oil',
        ],
        steps: [
          'Chop the vegetables.',
          'Add feta and olives.',
          'Drizzle with olive oil.',
          'Mix gently and serve.',
        ],
        user_id: '33333333-3333-3333-3333-333333333333',
      },
      {
        id: '10000000-0000-0000-0000-000000000007',
        title: 'Chocolate Brownies',
        ingredients: [
          'flour',
          'cocoa powder',
          'sugar',
          'eggs',
          'butter',
          'chocolate',
        ],
        steps: [
          'Melt the butter and chocolate.',
          'Mix in sugar and eggs.',
          'Add flour and cocoa powder.',
          'Pour into a baking pan.',
          'Bake until set.',
          'Cool before slicing.',
        ],
        user_id: '11111111-1111-1111-1111-111111111111',
      },
      {
        id: '10000000-0000-0000-0000-000000000008',
        title: 'Avocado Toast',
        ingredients: ['bread', 'avocado', 'lemon', 'salt', 'black pepper'],
        steps: [
          'Toast the bread.',
          'Mash the avocado.',
          'Add lemon juice.',
          'Spread avocado on toast.',
          'Season and serve.',
        ],
        user_id: '22222222-2222-2222-2222-222222222222',
      },
    ],
  });

  // Recipe ↔ Tag relationships
  await prisma.recipe_tags.createMany({
    data: [
      {
        recipe_id: '10000000-0000-0000-0000-000000000001',
        tag_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      },
      {
        recipe_id: '10000000-0000-0000-0000-000000000002',
        tag_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      },
      {
        recipe_id: '10000000-0000-0000-0000-000000000003',
        tag_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      },
      {
        recipe_id: '10000000-0000-0000-0000-000000000003',
        tag_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      },
      {
        recipe_id: '10000000-0000-0000-0000-000000000004',
        tag_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      },
      {
        recipe_id: '10000000-0000-0000-0000-000000000004',
        tag_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      },
      {
        recipe_id: '10000000-0000-0000-0000-000000000005',
        tag_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      },
      {
        recipe_id: '10000000-0000-0000-0000-000000000006',
        tag_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      },
      {
        recipe_id: '10000000-0000-0000-0000-000000000007',
        tag_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      },
      {
        recipe_id: '10000000-0000-0000-0000-000000000008',
        tag_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      },
      {
        recipe_id: '10000000-0000-0000-0000-000000000008',
        tag_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      },
      {
        recipe_id: '10000000-0000-0000-0000-000000000008',
        tag_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      },
    ],
  });

  console.log('🌱 Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
