/**
 * Seed script for the Recipe Box database.
 *
 * Creates:
 *  - 2 users
 *  - 5 tags, 17 ingredients (each with an image_url)
 *  - 3 recipes, each with recipe_image, recipe_step (image_url added where
 *    a suitable photo was found), recipe_tag (+ tag), and
 *    recipe_ingredient (+ ingredient) rows
 *  - 2 user_bookmark rows linking the two users to each other's recipes
 *
 * Place this file at prisma/seed.ts (next to schema.prisma) so the
 * "../src/generated/prisma" import below matches the schema's
 * generator output path.
 *
 * Run with: npx prisma db seed
 * That requires this in package.json:
 *   "prisma": { "seed": "ts-node prisma/seed.ts" }
 * (swap ts-node for tsx if that's what the project uses instead)
 *
 * NOTE ON THIS REVISION: this version adds `image_url` values on the
 * `ingredient` and `recipeStep.create` calls. That assumes your
 * `ingredient` and `recipe_step` models have an `image_url String?`
 * column (matching the naming already used on `recipe_image`). If
 * those columns don't exist yet, add them to schema.prisma and run a
 * migration before seeding, or this will throw an "Unknown argument"
 * error from Prisma.
 *
 * COVERAGE: all 17 ingredients have an image. Of the 16 recipe steps,
 * 8 have one: all 5 Carbonara steps, and 3 of 6 Cake steps (dividing
 * the batter into pans, cooling, and frosting). The 5 Tacos steps and
 * the first 3 Cake steps (preheat/grease, whisk dry ingredients, beat
 * batter) are left without an image_url — I could not confirm a
 * genuine Pexels photo ID for them and didn't want to guess a URL
 * that might 404. Let me know if you'd like me to keep looking for
 * those.
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { RecipeVisibility } from '../src/generated/prisma/enums';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = 'Password123!';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Small helper so every ingredient/step image URL follows the same
// pattern already used for recipe_image ("images.pexels.com/photos/
// {id}/pexels-photo-{id}.jpeg"), built from a bare Pexels photo ID.
function pexels(id: number): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
}

async function main() {
  console.log('Cleaning existing data...');
  // Deleting users cascades to their sessions, bookmarks, recipes, and
  // (through recipes) recipe_image / recipe_step / recipe_tag /
  // recipe_ingredient rows. Tags and ingredients are independent
  // entities, so they're cleared separately, after nothing references
  // them anymore.
  await prisma.user.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.ingredient.deleteMany();

  console.log('Creating users...');
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      username: 'alice_cooks',
      display_name: 'Alice Turner',
      password_hash: passwordHash,
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      username: 'bob_bakes',
      display_name: 'Bob Martinez',
      password_hash: passwordHash,
    },
  });

  console.log('Creating tags...');
  const tagNames = ['Italian', 'Quick & Easy', 'Mexican', 'Dessert', 'Baking'];
  const tags: Record<string, { id: string }> = {};
  for (const name of tagNames) {
    tags[name] = await prisma.tag.create({
      data: { name, slug: slugify(name) },
    });
  }

  console.log('Creating ingredients...');
  // name -> Pexels photo ID
  const ingredientPhotoIds: Record<string, number> = {
    Spaghetti: 4039704,
    Egg: 1382901,
    Pancetta: 4202892,
    'Parmesan Cheese': 3693280,
    'Black Pepper': 29626033,
    'Chicken Breast': 5769376,
    'Corn Tortilla': 4958527,
    Lime: 4590488,
    Cilantro: 606540,
    'Red Onion': 7890176,
    'Chili Powder': 33440714,
    'All-Purpose Flour': 5765,
    'Cocoa Powder': 10167723,
    'Granulated Sugar': 7966490,
    'Unsalted Butter': 8188934,
    'Vanilla Extract': 14381802,
    'Baking Powder': 6996335,
  };
  const ingredients: Record<string, { id: string }> = {};
  for (const [name, photoId] of Object.entries(ingredientPhotoIds)) {
    ingredients[name] = await prisma.ingredient.create({
      data: {
        name,
        slug: slugify(name),
        image_url: pexels(photoId),
      },
    });
  }

  console.log('Creating recipe 1: Classic Spaghetti Carbonara...');
  const carbonara = await prisma.recipe.create({
    data: {
      user_id: alice.id,
      title: 'Classic Spaghetti Carbonara',
      serving_size: 4,
      visibility: RecipeVisibility.public,
      recipeImage: {
        create: [
          {
            image_url: 'https://images.pexels.com/photos/19062760/pexels-photo-19062760.jpeg',
          },
          {
            image_url: 'https://images.pexels.com/photos/3606799/pexels-photo-3606799.jpeg',
          },
        ],
      },
      recipeStep: {
        create: [
          {
            position: 1,
            description: 'Bring a large pot of salted water to a boil and cook the spaghetti until al dente.',
            image_url: pexels(10608701), // uncooked spaghetti boiling in a pot, steam rising
          },
          {
            position: 2,
            description: 'While the pasta cooks, fry the pancetta in a skillet over medium heat until crisp.',
            image_url: pexels(37238877), // diced pancetta/bacon cooking in a skillet
          },
          {
            position: 3,
            description: 'Whisk the eggs and grated Parmesan together in a bowl until smooth.',
            image_url: pexels(8798726), // hands whisking a mixture in a bowl
          },
          {
            position: 4,
            description:
              'Drain the pasta, reserving a cup of the starchy cooking water, then toss it with the pancetta off the heat.',
            image_url: pexels(6249015), // cooking pasta on the counter near the pan
          },
          {
            position: 5,
            description:
              'Quickly stir in the egg mixture, adding splashes of pasta water until creamy. Finish with cracked black pepper.',
            image_url: pexels(546945), // finished spaghetti carbonara topped with grated Parmesan
          },
        ],
      },
      recipeTag: {
        create: [
          { tag: { connect: { id: tags['Italian'].id } } },
          { tag: { connect: { id: tags['Quick & Easy'].id } } },
        ],
      },
      recipeIngredient: {
        create: [
          {
            quantity: 400,
            unit: 'g',
            ingredient: { connect: { id: ingredients['Spaghetti'].id } },
          },
          {
            quantity: 3,
            unit: 'unit',
            ingredient: { connect: { id: ingredients['Egg'].id } },
          },
          {
            quantity: 150,
            unit: 'g',
            ingredient: { connect: { id: ingredients['Pancetta'].id } },
          },
          {
            quantity: 50,
            unit: 'g',
            ingredient: { connect: { id: ingredients['Parmesan Cheese'].id } },
          },
          {
            quantity: 1,
            unit: 'tsp',
            ingredient: { connect: { id: ingredients['Black Pepper'].id } },
          },
        ],
      },
    },
  });

  console.log('Creating recipe 2: Loaded Chicken Street Tacos...');
  const tacos = await prisma.recipe.create({
    data: {
      user_id: bob.id,
      title: 'Loaded Chicken Street Tacos',
      serving_size: 4,
      visibility: RecipeVisibility.public,
      recipeImage: {
        create: [
          {
            image_url: 'https://images.pexels.com/photos/14179985/pexels-photo-14179985.jpeg',
          },
          {
            image_url: 'https://images.pexels.com/photos/14179983/pexels-photo-14179983.jpeg',
          },
        ],
      },
      recipeStep: {
        create: [
          {
            position: 1,
            description: 'Season the chicken breast with chili powder and let it marinate for 15 minutes.',
            // TODO: no confirmed Pexels image found for this step yet.
          },
          {
            position: 2,
            description: 'Sear the chicken in a hot skillet until cooked through, then let it rest before slicing.',
            // TODO: no confirmed Pexels image found for this step yet.
          },
          {
            position: 3,
            description: 'Warm the corn tortillas on a dry skillet or over an open flame until lightly charred.',
            // TODO: no confirmed Pexels image found for this step yet.
          },
          {
            position: 4,
            description: 'Dice the red onion and roughly chop the cilantro.',
            // TODO: no confirmed Pexels image found for this step yet.
          },
          {
            position: 5,
            description:
              'Assemble the tacos with sliced chicken, onion, and cilantro, and finish with a squeeze of lime.',
            // TODO: no confirmed Pexels image found for this step yet.
          },
        ],
      },
      recipeTag: {
        create: [
          { tag: { connect: { id: tags['Mexican'].id } } },
          { tag: { connect: { id: tags['Quick & Easy'].id } } },
        ],
      },
      recipeIngredient: {
        create: [
          {
            quantity: 500,
            unit: 'g',
            ingredient: { connect: { id: ingredients['Chicken Breast'].id } },
          },
          {
            quantity: 8,
            unit: 'unit',
            ingredient: { connect: { id: ingredients['Corn Tortilla'].id } },
          },
          {
            quantity: 2,
            unit: 'unit',
            ingredient: { connect: { id: ingredients['Lime'].id } },
          },
          {
            quantity: 0.25,
            unit: 'cup',
            ingredient: { connect: { id: ingredients['Cilantro'].id } },
          },
          {
            quantity: 1,
            unit: 'unit',
            ingredient: { connect: { id: ingredients['Red Onion'].id } },
          },
          {
            quantity: 2,
            unit: 'tsp',
            ingredient: { connect: { id: ingredients['Chili Powder'].id } },
          },
        ],
      },
    },
  });

  console.log('Creating recipe 3: Rich Chocolate Layer Cake...');
  const cake = await prisma.recipe.create({
    data: {
      user_id: alice.id,
      title: 'Rich Chocolate Layer Cake',
      serving_size: 10,
      visibility: RecipeVisibility.private,
      recipeImage: {
        create: [
          {
            image_url: 'https://images.pexels.com/photos/19940993/pexels-photo-19940993.png',
          },
          {
            image_url: 'https://images.pexels.com/photos/7381533/pexels-photo-7381533.jpeg',
          },
        ],
      },
      recipeStep: {
        create: [
          {
            position: 1,
            description: 'Preheat the oven to 175°C (350°F) and grease two 9-inch round cake pans.',
            // TODO: no confirmed Pexels image found for this step yet.
          },
          {
            position: 2,
            description: 'Whisk together the flour, cocoa powder, sugar, and baking powder in a large bowl.',
            // TODO: no confirmed Pexels image found for this step yet.
          },
          {
            position: 3,
            description: 'Beat in the butter, eggs, and vanilla extract until the batter is smooth.',
            // TODO: no confirmed Pexels image found for this step yet.
          },
          {
            position: 4,
            description:
              'Divide the batter evenly between the pans and bake for 30-35 minutes, until a toothpick comes out clean.',
            image_url: pexels(37823183), // chocolate cake batter being poured into a baking pan
          },
          {
            position: 5,
            description: 'Let the cakes cool completely in their pans before turning them out.',
            image_url: pexels(14043681), // homemade cake cooling in a round baking pan
          },
          {
            position: 6,
            description: 'Stack and frost the layers with your favorite chocolate frosting.',
            image_url: pexels(8478059), // a man frosting a cake with a spatula
          },
        ],
      },
      recipeTag: {
        create: [{ tag: { connect: { id: tags['Dessert'].id } } }, { tag: { connect: { id: tags['Baking'].id } } }],
      },
      recipeIngredient: {
        create: [
          {
            quantity: 250,
            unit: 'g',
            ingredient: {
              connect: { id: ingredients['All-Purpose Flour'].id },
            },
          },
          {
            quantity: 75,
            unit: 'g',
            ingredient: { connect: { id: ingredients['Cocoa Powder'].id } },
          },
          {
            quantity: 300,
            unit: 'g',
            ingredient: { connect: { id: ingredients['Granulated Sugar'].id } },
          },
          {
            quantity: 200,
            unit: 'g',
            ingredient: { connect: { id: ingredients['Unsalted Butter'].id } },
          },
          {
            quantity: 4,
            unit: 'unit',
            ingredient: { connect: { id: ingredients['Egg'].id } },
          },
          {
            quantity: 2,
            unit: 'tsp',
            ingredient: { connect: { id: ingredients['Vanilla Extract'].id } },
          },
          {
            quantity: 1.5,
            unit: 'tsp',
            ingredient: { connect: { id: ingredients['Baking Powder'].id } },
          },
        ],
      },
    },
  });

  console.log('Creating bookmarks...');
  await prisma.userBookmark.create({
    data: { user_id: bob.id, recipe_id: carbonara.id },
  });
  await prisma.userBookmark.create({
    data: { user_id: alice.id, recipe_id: tacos.id },
  });

  console.log('Seed complete:');
  console.log(`  Users: ${alice.username}, ${bob.username} (password for both: "${DEMO_PASSWORD}")`);
  console.log(`  Recipes: "${carbonara.title}" (public), "${tacos.title}" (public), "${cake.title}" (private)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
