const { pool } = require('../../db/db.js');
const axios = require('axios');

module.exports = {

  async addRecipe(req, res) {
    const recipe_id = req.body.id;
    const recipe_name = req.body.name;
    const username = req.body.username;

    pool.query('SELECT id FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        console.error('Error retrieving user ID:', error);
      } else {
        if (results.rows.length > 0) {
          const user_id = results.rows[0].id;

          pool.query('SELECT * FROM user_recipes WHERE user_id = $1 AND recipe_id = $2', [user_id, recipe_id], (error, results)  => {
            if (error) {
              console.error('error:', error);
              res.status(500).json({ error: 'error' });
              return;
            } else {
              // don't insert new recipe if user already has it in their list
              if (results.rows.length > 0) {
                console.log('recipe already inserted');
                res.status(200).json({ message: 'recipe already inserted, not inserting again' });
                return;
              } else {
                // insert if not in the user's list
                pool.query('INSERT INTO user_recipes (recipe_id, recipe_name, user_id) VALUES ($1, $2, $3)', [recipe_id, recipe_name, user_id], (error, results)  => {
                  if (error) {
                    console.error('error:', error);
                    res.status(500).json({ error: 'error' });
                  } else {
                    console.log('recipe inserted');
                    res.status(201).json({ message: 'recipe inserted' });
                  }
                });
              }
            }
          });
        } else {
          console.error('User not found');
        }
      }
    });
  },
  async getUserRecipes(req, res) {
    const username = req.query.username;
    let user_id;

    if (username !== undefined) {
      const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

      if (userResult.rows.length > 0) {
        user_id = userResult.rows[0].id;
      } else {
        res.send("User not found");
        return;
      }
    } else {
      res.send("Username not provided");
      return;
    }

    pool.query('SELECT recipe_id, recipe_name FROM user_recipes WHERE user_id = $1', [user_id], (error, results) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error' });
      } else {
        res.status(200).send(results.rows);
      }
    });
  },
  async getRecipe(req, res) {
    const options = {
      method: 'GET',
      url: 'https://tasty.p.rapidapi.com/recipes/get-more-info',
      params: {id: `${req.query.recipeID}`},
      headers: {
        'X-RapidAPI-Key': `${process.env.TOKEN}`,
        'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
      }
    };
   axios(options)
    .then((response) => {
      res.send(response.data);
    })
    .catch ((error) => {
      console.error(error);
    });
/*
  res.send({
    "servings_noun_plural": "servings",
    "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/199808.jpg",
    "updated_at": 1692116688,
    "is_one_top": false,
    "prep_time_minutes": 0,
    "seo_title": "",
    "compilations": [],
    "brand": null,
    "total_time_tier": {
      "tier": "under_30_minutes",
      "display_tier": "Under 30 minutes"
    },
    "brand_id": null,
    "is_shoppable": true,
    "promotion": "full",
    "tags": [
      {
        "id": 64444,
        "name": "north_american",
        "display_name": "North American",
        "type": "cuisine",
        "root_tag_type": "cuisine"
      },
      {
        "id": 64463,
        "name": "dairy_free",
        "display_name": "Dairy-Free",
        "type": "dietary",
        "root_tag_type": "dietary"
      },
      {
        "display_name": "Healthy",
        "type": "healthy",
        "root_tag_type": "healthy",
        "id": 64466,
        "name": "healthy"
      },
      {
        "id": 64468,
        "name": "vegan",
        "display_name": "Vegan",
        "type": "dietary",
        "root_tag_type": "dietary"
      },
      {
        "type": "dietary",
        "root_tag_type": "dietary",
        "id": 64469,
        "name": "vegetarian",
        "display_name": "Vegetarian"
      },
      {
        "id": 64471,
        "name": "easy",
        "display_name": "Easy",
        "type": "difficulty",
        "root_tag_type": "difficulty"
      },
      {
        "display_name": "Under 30 Minutes",
        "type": "difficulty",
        "root_tag_type": "difficulty",
        "id": 64472,
        "name": "under_30_minutes"
      },
      {
        "id": 64489,
        "name": "lunch",
        "display_name": "Lunch",
        "type": "meal",
        "root_tag_type": "meal"
      },
      {
        "id": 65851,
        "name": "big_batch",
        "display_name": "Big Batch",
        "type": "cooking_style",
        "root_tag_type": "cooking_style"
      },
      {
        "name": "meal_prep",
        "display_name": "Meal Prep",
        "type": "cooking_style",
        "root_tag_type": "cooking_style",
        "id": 65853
      },
      {
        "display_name": "No Bake Desserts",
        "type": "cooking_style",
        "root_tag_type": "cooking_style",
        "id": 65854,
        "name": "no_bake_desserts"
      },
      {
        "name": "pyrex",
        "display_name": "Pyrex",
        "type": "equipment",
        "root_tag_type": "equipment",
        "id": 1247785
      },
      {
        "type": "equipment",
        "root_tag_type": "equipment",
        "id": 1247793,
        "name": "whisk",
        "display_name": "Whisk"
      },
      {
        "display_name": "Wooden Spoon",
        "type": "equipment",
        "root_tag_type": "equipment",
        "id": 1247794,
        "name": "wooden_spoon"
      },
      {
        "id": 1280501,
        "name": "chefs_knife",
        "display_name": "Chef's Knife",
        "type": "equipment",
        "root_tag_type": "equipment"
      },
      {
        "display_name": "Cutting Board",
        "type": "equipment",
        "root_tag_type": "equipment",
        "id": 1280503,
        "name": "cutting_board"
      },
      {
        "name": "liquid_measuring_cup",
        "display_name": "Liquid Measuring Cup",
        "type": "equipment",
        "root_tag_type": "equipment",
        "id": 1280506
      },
      {
        "root_tag_type": "equipment",
        "id": 1280507,
        "name": "dry_measuring_cups",
        "display_name": "Dry Measuring Cups",
        "type": "equipment"
      },
      {
        "name": "measuring_spoons",
        "display_name": "Measuring Spoons",
        "type": "equipment",
        "root_tag_type": "equipment",
        "id": 1280508
      },
      {
        "name": "mixing_bowl",
        "display_name": "Mixing Bowl",
        "type": "equipment",
        "root_tag_type": "equipment",
        "id": 1280510
      },
      {
        "display_name": "NYNM Veggie",
        "type": "feature_page",
        "root_tag_type": "feature_page",
        "id": 6543461,
        "name": "nynm_veggie"
      },
      {
        "display_name": "High-Protein",
        "type": "healthy",
        "root_tag_type": "healthy",
        "id": 8091917,
        "name": "high_protein"
      },
      {
        "root_tag_type": "healthy",
        "id": 8091918,
        "name": "low_sugar",
        "display_name": "Low-Sugar",
        "type": "healthy"
      },
      {
        "id": 8091920,
        "name": "high_fiber",
        "display_name": "High-Fiber",
        "type": "healthy",
        "root_tag_type": "healthy"
      },
      {
        "display_name": "Dietary",
        "type": "dietary",
        "root_tag_type": "dietary",
        "id": 9295814,
        "name": "dietary"
      },
      {
        "type": "lunch",
        "root_tag_type": "meal",
        "id": 9299495,
        "name": "salads",
        "display_name": "Salads"
      }
    ],
    "country": "US",
    "description": "Boring salads no more! This colorful super salad is the perfect way to start the new year off with a bang. Carrot, broccoli, kale, cabbage, red bell pepper, and creamy avocado are just a few of the many ingredients that pack in tons of various vitamins, minerals, and antioxidants to boost your health, AND they taste delicious! Crazy! This dish will be your new staple recipe to get tons of nutrients in one meal.",
    "video_id": 75545,
    "num_servings": 6,
    "seo_path": "9295813,64489,9299495",
    "servings_noun_singular": "serving",
    "sections": [
      {
        "components": [
          {
            "id": 50317,
            "raw_text": "3 tablespoons whole grain mustard",
            "extra_comment": "",
            "position": 1,
            "measurements": [
              {
                "unit": {
                  "name": "tablespoon",
                  "abbreviation": "tbsp",
                  "display_singular": "tablespoon",
                  "display_plural": "tablespoons",
                  "system": "imperial"
                },
                "id": 422039,
                "quantity": "3"
              }
            ],
            "ingredient": {
              "created_at": 1547087712,
              "updated_at": 1547087712,
              "id": 5032,
              "name": "wole grain mustard",
              "display_singular": "wole grain mustard",
              "display_plural": "wole grain mustards"
            }
          },
          {
            "id": 50318,
            "raw_text": "2 tablespoons organic maple syrup",
            "extra_comment": "",
            "position": 2,
            "measurements": [
              {
                "quantity": "2",
                "unit": {
                  "system": "imperial",
                  "name": "tablespoon",
                  "abbreviation": "tbsp",
                  "display_singular": "tablespoon",
                  "display_plural": "tablespoons"
                },
                "id": 422037
              }
            ],
            "ingredient": {
              "id": 2498,
              "name": "organic maple syrup",
              "display_singular": "organic maple syrup",
              "display_plural": "organic maple syrups",
              "created_at": 1500747450,
              "updated_at": 1509035125
            }
          },
          {
            "raw_text": "1 tablespoon grated fresh ginger",
            "extra_comment": "grated",
            "position": 3,
            "measurements": [
              {
                "id": 422040,
                "quantity": "1",
                "unit": {
                  "display_plural": "tablespoons",
                  "system": "imperial",
                  "name": "tablespoon",
                  "abbreviation": "tbsp",
                  "display_singular": "tablespoon"
                }
              }
            ],
            "ingredient": {
              "display_plural": "fresh gingers",
              "created_at": 1495677069,
              "updated_at": 1509035238,
              "id": 727,
              "name": "fresh ginger",
              "display_singular": "fresh ginger"
            },
            "id": 50319
          },
          {
            "id": 50320,
            "raw_text": "4 cloves garlic, grated",
            "extra_comment": "grated",
            "position": 4,
            "measurements": [
              {
                "id": 422041,
                "quantity": "4",
                "unit": {
                  "name": "clove",
                  "abbreviation": "clove",
                  "display_singular": "clove",
                  "display_plural": "cloves",
                  "system": "none"
                }
              }
            ],
            "ingredient": {
              "name": "garlic",
              "display_singular": "garlic",
              "display_plural": "garlics",
              "created_at": 1493744766,
              "updated_at": 1509035285,
              "id": 95
            }
          },
          {
            "id": 50321,
            "raw_text": "1 tablespoon toasted sesame seeds",
            "extra_comment": "toasted",
            "position": 5,
            "measurements": [
              {
                "id": 422063,
                "quantity": "1",
                "unit": {
                  "display_plural": "tablespoons",
                  "system": "imperial",
                  "name": "tablespoon",
                  "abbreviation": "tbsp",
                  "display_singular": "tablespoon"
                }
              }
            ],
            "ingredient": {
              "id": 1006,
              "name": "sesame seed",
              "display_singular": "sesame seed",
              "display_plural": "sesame seeds",
              "created_at": 1496186841,
              "updated_at": 1509035215
            }
          },
          {
            "id": 50322,
            "raw_text": "¼ teaspoon cayenne pepper",
            "extra_comment": "",
            "position": 6,
            "measurements": [
              {
                "id": 422038,
                "quantity": "¼",
                "unit": {
                  "display_plural": "teaspoons",
                  "system": "imperial",
                  "name": "teaspoon",
                  "abbreviation": "tsp",
                  "display_singular": "teaspoon"
                }
              }
            ],
            "ingredient": {
              "id": 10,
              "name": "cayenne pepper",
              "display_singular": "cayenne pepper",
              "display_plural": "cayenne peppers",
              "created_at": 1493307142,
              "updated_at": 1509035289
            }
          },
          {
            "measurements": [
              {
                "id": 422045,
                "quantity": "¼",
                "unit": {
                  "name": "cup",
                  "abbreviation": "c",
                  "display_singular": "cup",
                  "display_plural": "cups",
                  "system": "imperial"
                }
              },
              {
                "id": 422043,
                "quantity": "60",
                "unit": {
                  "name": "milliliter",
                  "abbreviation": "mL",
                  "display_singular": "mL",
                  "display_plural": "mL",
                  "system": "metric"
                }
              }
            ],
            "ingredient": {
              "id": 345,
              "name": "apple cider vinegar",
              "display_singular": "apple cider vinegar",
              "display_plural": "apple cider vinegars",
              "created_at": 1494882105,
              "updated_at": 1509035268
            },
            "id": 50323,
            "raw_text": "¼ cup apple cider vinegar",
            "extra_comment": "",
            "position": 7
          },
          {
            "extra_comment": "",
            "position": 8,
            "measurements": [
              {
                "id": 422049,
                "quantity": "¼",
                "unit": {
                  "name": "cup",
                  "abbreviation": "c",
                  "display_singular": "cup",
                  "display_plural": "cups",
                  "system": "imperial"
                }
              },
              {
                "quantity": "60",
                "unit": {
                  "display_plural": "mL",
                  "system": "metric",
                  "name": "milliliter",
                  "abbreviation": "mL",
                  "display_singular": "mL"
                },
                "id": 422046
              }
            ],
            "ingredient": {
              "name": "lemon juice",
              "display_singular": "lemon juice",
              "display_plural": "lemon juices",
              "created_at": 1494624947,
              "updated_at": 1509035274,
              "id": 271
            },
            "id": 50324,
            "raw_text": "¼ cup lemon juice"
          },
          {
            "id": 50325,
            "raw_text": "⅓ cup extra-virgin olive oil",
            "extra_comment": "",
            "position": 9,
            "measurements": [
              {
                "id": 422053,
                "quantity": "⅓",
                "unit": {
                  "name": "cup",
                  "abbreviation": "c",
                  "display_singular": "cup",
                  "display_plural": "cups",
                  "system": "imperial"
                }
              },
              {
                "id": 422048,
                "quantity": "80",
                "unit": {
                  "name": "milliliter",
                  "abbreviation": "mL",
                  "display_singular": "mL",
                  "display_plural": "mL",
                  "system": "metric"
                }
              }
            ],
            "ingredient": {
              "id": 452,
              "name": "extra virgin olive oil",
              "display_singular": "extra virgin olive oil",
              "display_plural": "extra virgin olive oils",
              "created_at": 1495076759,
              "updated_at": 1509035259
            }
          },
          {
            "extra_comment": "to taste",
            "position": 10,
            "measurements": [
              {
                "id": 422052,
                "quantity": "0",
                "unit": {
                  "display_singular": "",
                  "display_plural": "",
                  "system": "none",
                  "name": "",
                  "abbreviation": ""
                }
              }
            ],
            "ingredient": {
              "id": 11,
              "name": "kosher salt",
              "display_singular": "kosher salt",
              "display_plural": "kosher salts",
              "created_at": 1493307153,
              "updated_at": 1509035289
            },
            "id": 50326,
            "raw_text": "Kosher salt, to taste"
          },
          {
            "measurements": [
              {
                "id": 422047,
                "quantity": "0",
                "unit": {
                  "name": "",
                  "abbreviation": "",
                  "display_singular": "",
                  "display_plural": "",
                  "system": "none"
                }
              }
            ],
            "ingredient": {
              "display_singular": "black pepper",
              "display_plural": "black peppers",
              "created_at": 1493307183,
              "updated_at": 1509035289,
              "id": 12,
              "name": "black pepper"
            },
            "id": 50327,
            "raw_text": "Black pepper, to taste",
            "extra_comment": "to taste",
            "position": 11
          },
          {
            "id": 50328,
            "raw_text": "2 cups thinly sliced lacinato kale",
            "extra_comment": "thinly sliced",
            "position": 12,
            "measurements": [
              {
                "id": 422044,
                "quantity": "2",
                "unit": {
                  "system": "imperial",
                  "name": "cup",
                  "abbreviation": "c",
                  "display_singular": "cup",
                  "display_plural": "cups"
                }
              },
              {
                "id": 422042,
                "quantity": "135",
                "unit": {
                  "system": "metric",
                  "name": "gram",
                  "abbreviation": "g",
                  "display_singular": "g",
                  "display_plural": "g"
                }
              }
            ],
            "ingredient": {
              "id": 4852,
              "name": "lacinato kale",
              "display_singular": "lacinato kale",
              "display_plural": "lacinato kales",
              "created_at": 1540618699,
              "updated_at": 1540618699
            }
          },
          {
            "raw_text": "2 large carrots, peeled and grated",
            "extra_comment": "peeled and grated",
            "position": 13,
            "measurements": [
              {
                "quantity": "2",
                "unit": {
                  "display_singular": "",
                  "display_plural": "",
                  "system": "none",
                  "name": "",
                  "abbreviation": ""
                },
                "id": 422056
              }
            ],
            "ingredient": {
              "name": "large carrot",
              "display_singular": "large carrot",
              "display_plural": "large carrots",
              "created_at": 1495688206,
              "updated_at": 1509035236,
              "id": 755
            },
            "id": 50329
          },
          {
            "measurements": [
              {
                "id": 422055,
                "quantity": "2",
                "unit": {
                  "display_singular": "cup",
                  "display_plural": "cups",
                  "system": "imperial",
                  "name": "cup",
                  "abbreviation": "c"
                }
              },
              {
                "id": 422051,
                "quantity": "300",
                "unit": {
                  "name": "gram",
                  "abbreviation": "g",
                  "display_singular": "g",
                  "display_plural": "g",
                  "system": "metric"
                }
              }
            ],
            "ingredient": {
              "updated_at": 1509035180,
              "id": 1565,
              "name": "broccoli floret",
              "display_singular": "broccoli floret",
              "display_plural": "broccoli florets",
              "created_at": 1496854726
            },
            "id": 50330,
            "raw_text": "2 cups broccoli florets",
            "extra_comment": "",
            "position": 14
          },
          {
            "extra_comment": "thinly sliced",
            "position": 15,
            "measurements": [
              {
                "id": 422060,
                "quantity": "2",
                "unit": {
                  "abbreviation": "c",
                  "display_singular": "cup",
                  "display_plural": "cups",
                  "system": "imperial",
                  "name": "cup"
                }
              },
              {
                "id": 422058,
                "quantity": "200",
                "unit": {
                  "system": "metric",
                  "name": "gram",
                  "abbreviation": "g",
                  "display_singular": "g",
                  "display_plural": "g"
                }
              }
            ],
            "ingredient": {
              "created_at": 1495486340,
              "updated_at": 1509035247,
              "id": 613,
              "name": "red cabbage",
              "display_singular": "red cabbage",
              "display_plural": "red cabbages"
            },
            "id": 50331,
            "raw_text": "2 cups thinly sliced red cabbage"
          },
          {
            "ingredient": {
              "id": 227,
              "name": "red bell pepper",
              "display_singular": "red bell pepper",
              "display_plural": "red bell peppers",
              "created_at": 1494292131,
              "updated_at": 1509035277
            },
            "id": 50332,
            "raw_text": "1 red bell pepper, seeded and thinly sliced",
            "extra_comment": "seeded and thinly sliced",
            "position": 16,
            "measurements": [
              {
                "id": 422057,
                "quantity": "1",
                "unit": {
                  "name": "",
                  "abbreviation": "",
                  "display_singular": "",
                  "display_plural": "",
                  "system": "none"
                }
              }
            ]
          },
          {
            "measurements": [
              {
                "id": 422061,
                "quantity": "1",
                "unit": {
                  "name": "",
                  "abbreviation": "",
                  "display_singular": "",
                  "display_plural": "",
                  "system": "none"
                }
              }
            ],
            "ingredient": {
              "id": 1005,
              "name": "avocado",
              "display_singular": "avocado",
              "display_plural": "avocados",
              "created_at": 1496185911,
              "updated_at": 1509035215
            },
            "id": 50333,
            "raw_text": "1 avocado, peeled and cubed",
            "extra_comment": "peeled and cubed",
            "position": 17
          },
          {
            "extra_comment": "chopped",
            "position": 18,
            "measurements": [
              {
                "id": 422054,
                "quantity": "1",
                "unit": {
                  "name": "cup",
                  "abbreviation": "c",
                  "display_singular": "cup",
                  "display_plural": "cups",
                  "system": "imperial"
                }
              },
              {
                "id": 422050,
                "quantity": "100",
                "unit": {
                  "name": "gram",
                  "abbreviation": "g",
                  "display_singular": "g",
                  "display_plural": "g",
                  "system": "metric"
                }
              }
            ],
            "ingredient": {
              "display_singular": "walnut",
              "display_plural": "walnuts",
              "created_at": 1521080746,
              "updated_at": 1521080746,
              "id": 3869,
              "name": "walnut"
            },
            "id": 50334,
            "raw_text": "1 cup chopped walnuts"
          },
          {
            "id": 50335,
            "raw_text": "½ cup chopped fresh parsley",
            "extra_comment": "chopped",
            "position": 19,
            "measurements": [
              {
                "id": 422062,
                "quantity": "½",
                "unit": {
                  "name": "cup",
                  "abbreviation": "c",
                  "display_singular": "cup",
                  "display_plural": "cups",
                  "system": "imperial"
                }
              },
              {
                "id": 422059,
                "quantity": "20",
                "unit": {
                  "display_singular": "g",
                  "display_plural": "g",
                  "system": "metric",
                  "name": "gram",
                  "abbreviation": "g"
                }
              }
            ],
            "ingredient": {
              "display_singular": "fresh parlsey",
              "display_plural": "fresh parlseys",
              "created_at": 1519929772,
              "updated_at": 1519929772,
              "id": 3814,
              "name": "fresh parlsey"
            }
          }
        ],
        "name": null,
        "position": 1
      }
    ],
    "id": 4709,
    "inspired_by_url": "https://www.theroastedroot.net/ultimate-detox-salad/",
    "language": "eng",
    "total_time_minutes": null,
    "instructions": [
      {
        "start_time": 7000,
        "end_time": 36000,
        "temperature": null,
        "appliance": null,
        "id": 43438,
        "display_text": "In a liquid measuring cup, combine the mustard, maple syrup, ginger, garlic, sesame seeds, cayenne, apple cider vinegar, lemon juice, and olive oil. Whisk until fully incorporated. Season to taste with salt and pepper.",
        "position": 1
      },
      {
        "end_time": 55500,
        "temperature": null,
        "appliance": null,
        "id": 43439,
        "display_text": "Add the kale, carrots, red cabbage, broccoli, red cabbage, bell pepper, avocado, walnuts, and parsley to a large serving bowl.",
        "position": 2,
        "start_time": 40000
      },
      {
        "appliance": null,
        "id": 43440,
        "display_text": "Pour desired amount of dressing over the salad and toss until everything is well coated.",
        "position": 3,
        "start_time": 56000,
        "end_time": 76333,
        "temperature": null
      },
      {
        "appliance": null,
        "id": 43441,
        "display_text": "Garnish with more toasted sesame seeds",
        "position": 4,
        "start_time": 79000,
        "end_time": 83833,
        "temperature": null
      },
      {
        "end_time": 88666,
        "temperature": null,
        "appliance": null,
        "id": 43442,
        "display_text": "Enjoy!",
        "position": 5,
        "start_time": 85833
      }
    ],
    "canonical_id": "recipe:4709",
    "facebook_posts": [],
    "beauty_url": null,
    "thumbnail_alt_text": "",
    "tips_and_ratings_enabled": true,
    "credits": [
      {
        "type": "internal",
        "name": "Matthew Johnson"
      }
    ],
    "original_video_url": "https://s3.amazonaws.com/video-api-prod/assets/f18727f5e6ee49f397eec94a7b208821/OO.mp4",
    "show": {
      "id": 17,
      "name": "Tasty"
    },
    "renditions": [
      {
        "container": "mp4",
        "url": "https://vid.tasty.co/output/122089/square_720/1546987325",
        "name": "mp4_720x720",
        "height": 720,
        "file_size": 35567360,
        "bit_rate": 2823,
        "minimum_bit_rate": null,
        "aspect": "square",
        "width": 720,
        "duration": 100798,
        "maximum_bit_rate": null,
        "content_type": "video/mp4",
        "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/122089/square_720/1546987325_00001.png"
      },
      {
        "bit_rate": 972,
        "maximum_bit_rate": null,
        "content_type": "video/mp4",
        "height": 320,
        "width": 320,
        "file_size": 12239415,
        "container": "mp4",
        "url": "https://vid.tasty.co/output/122089/square_320/1546987325",
        "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/122089/square_320/1546987325_00001.png",
        "name": "mp4_320x320",
        "duration": 100798,
        "minimum_bit_rate": null,
        "aspect": "square"
      },
      {
        "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/122089/landscape_720/1546987325_00001.png",
        "width": 720,
        "file_size": 35580301,
        "minimum_bit_rate": null,
        "content_type": "video/mp4",
        "container": "mp4",
        "url": "https://vid.tasty.co/output/122089/landscape_720/1546987325",
        "name": "mp4_720x720",
        "height": 720,
        "duration": 100798,
        "bit_rate": 2824,
        "maximum_bit_rate": null,
        "aspect": "square"
      },
      {
        "height": 480,
        "duration": 100798,
        "file_size": 20879858,
        "bit_rate": 1658,
        "minimum_bit_rate": null,
        "container": "mp4",
        "url": "https://vid.tasty.co/output/122089/landscape_480/1546987325",
        "width": 480,
        "maximum_bit_rate": null,
        "content_type": "video/mp4",
        "aspect": "square",
        "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/122089/landscape_480/1546987325_00001.png",
        "name": "mp4_480x480"
      },
      {
        "height": 1080,
        "width": 1080,
        "duration": 100809,
        "maximum_bit_rate": 4545,
        "minimum_bit_rate": 273,
        "container": "ts",
        "url": "https://vid.tasty.co/output/122089/hls24_1546987325.m3u8",
        "name": "low",
        "file_size": null,
        "bit_rate": null,
        "content_type": "application/vnd.apple.mpegurl",
        "aspect": "square",
        "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/122089/1445289064805-h2exzu/1546987325_00001.png"
      }
    ],
    "nutrition": {
      "carbohydrates": 26,
      "fat": 31,
      "protein": 9,
      "sugar": 10,
      "fiber": 9,
      "updated_at": "2021-05-03T13:24:11+02:00",
      "calories": 397
    },
    "buzz_id": null,
    "keywords": "easy lunch, healthy recipe, immunity boosting, kale salad, new year meal, quick dinner, salad dressing, salad recipe, super food, tasty, tasty_vegetarian, veggie packed",
    "yields": "Servings: 6",
    "topics": [
      {
        "slug": "best-vegetarian",
        "name": "Best Vegetarian"
      },
      {
        "name": "Healthy Eating",
        "slug": "healthy"
      },
      {
        "name": "Weekend Meal Prep",
        "slug": "meal-prep"
      },
      {
        "name": "No Bake Desserts",
        "slug": "no-bake-desserts"
      },
      {
        "name": "Vegan",
        "slug": "vegan"
      },
      {
        "name": "Lunch",
        "slug": "lunch"
      },
      {
        "name": "American",
        "slug": "american"
      }
    ],
    "draft_status": "published",
    "show_id": 17,
    "slug": "nutrient-packed-colorful-super-salad",
    "video_url": "https://vid.tasty.co/output/122089/hls24_1546987325.m3u8",
    "nutrition_visibility": "auto",
    "aspect_ratio": "1:1",
    "cook_time_minutes": 0,
    "created_at": 1546987036,
    "video_ad_content": "none",
    "price": {
      "total": 4900,
      "portion": 800,
      "consumption_total": 1250,
      "consumption_portion": 200,
      "updated_at": "2023-09-14T07:02:06+02:00"
    },
    "approved_at": 1547093372,
    "name": "Nutrient-Packed Colorful Super Salad",
    "user_ratings": {
      "count_positive": 267,
      "count_negative": 17,
      "score": 0.940141
    }
  });
*/
  },
  async getRecipes(req, res) {
    const options = {
      method: 'GET',
      url: 'https://tasty.p.rapidapi.com/recipes/list',
      params: {
        from: '0',
        size: '20',
        tags: `${req.query.selectedTag}`,
        q: `${req.query.foodName}`
      },
      headers: {
        'X-RapidAPI-Key': `${process.env.TOKEN}`,
        'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
      }
    };
   axios(options)
    .then((response) => {
      res.send(response.data);
    })
    .catch ((error) => {
      console.error(error);
    });
/*
  res.send({
    "count": 1266,
    "results": [
      {
        "show_id": 34,
        "name": "Low-Carb Avocado Chicken Salad",
        "tips_and_ratings_enabled": true,
        "is_shoppable": true,
        "video_ad_content": "none",
        "seo_path": "9295813,64486,9299514",
        "slug": "low-carb-avocado-chicken-salad",
        "servings_noun_singular": "serving",
        "seo_title": "",
        "nutrition_visibility": "auto",
        "id": 4704,
        "beauty_url": null,
        "renditions": [
          {
            "duration": 217498,
            "width": 720,
            "maximum_bit_rate": null,
            "height": 720,
            "file_size": 40535808,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/121934/square_720/1546897597_00001.png",
            "url": "https://vid.tasty.co/output/121934/square_720/1546897597",
            "bit_rate": 1491,
            "content_type": "video/mp4",
            "aspect": "square",
            "minimum_bit_rate": null,
            "name": "mp4_720x720",
            "container": "mp4"
          },
          {
            "name": "mp4_320x320",
            "maximum_bit_rate": null,
            "file_size": 14280746,
            "url": "https://vid.tasty.co/output/121934/square_320/1546897597",
            "duration": 217498,
            "bit_rate": 526,
            "aspect": "square",
            "minimum_bit_rate": null,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/121934/square_320/1546897597_00001.png",
            "content_type": "video/mp4",
            "width": 320,
            "height": 320
          },
          {
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/121934/landscape_720/1546897597_00001.png",
            "url": "https://vid.tasty.co/output/121934/landscape_720/1546897597",
            "aspect": "square",
            "maximum_bit_rate": null,
            "height": 720,
            "file_size": 40496760,
            "duration": 217498,
            "bit_rate": 1490,
            "content_type": "video/mp4",
            "width": 720,
            "minimum_bit_rate": null,
            "name": "mp4_720x720"
          },
          {
            "file_size": 23426496,
            "url": "https://vid.tasty.co/output/121934/landscape_480/1546897597",
            "content_type": "video/mp4",
            "minimum_bit_rate": null,
            "name": "mp4_480x480",
            "maximum_bit_rate": null,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/121934/landscape_480/1546897597_00001.png",
            "aspect": "square",
            "width": 480,
            "height": 480,
            "duration": 217498,
            "bit_rate": 862
          },
          {
            "minimum_bit_rate": 273,
            "container": "ts",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/121934/1445289064805-h2exzu/1546897597_00001.png",
            "url": "https://vid.tasty.co/output/121934/hls24_1546897597.m3u8",
            "duration": 217509,
            "bit_rate": null,
            "aspect": "square",
            "width": 1080,
            "name": "low",
            "maximum_bit_rate": 2684,
            "height": 1080,
            "file_size": null,
            "content_type": "application/vnd.apple.mpegurl"
          }
        ],
        "total_time_tier": {
          "tier": "under_30_minutes",
          "display_tier": "Under 30 minutes"
        },
        "yields": "Servings: 4",
        "tags": [
          {
            "root_tag_type": "cuisine",
            "name": "north_american",
            "id": 64444,
            "display_name": "North American",
            "type": "cuisine"
          },
          {
            "root_tag_type": "dietary",
            "name": "gluten_free",
            "id": 64465,
            "display_name": "Gluten-Free",
            "type": "dietary"
          },
          {
            "name": "healthy",
            "id": 64466,
            "display_name": "Healthy",
            "type": "healthy",
            "root_tag_type": "healthy"
          },
          {
            "display_name": "Low-Carb",
            "type": "healthy",
            "root_tag_type": "healthy",
            "name": "low_carb",
            "id": 64467
          },
          {
            "id": 64471,
            "display_name": "Easy",
            "type": "difficulty",
            "root_tag_type": "difficulty",
            "name": "easy"
          },
          {
            "root_tag_type": "difficulty",
            "name": "under_30_minutes",
            "id": 64472,
            "display_name": "Under 30 Minutes",
            "type": "difficulty"
          },
          {
            "display_name": "Brunch",
            "type": "meal",
            "root_tag_type": "meal",
            "name": "brunch",
            "id": 64484
          },
          {
            "root_tag_type": "meal",
            "name": "snacks",
            "id": 64491,
            "display_name": "Snacks",
            "type": "meal"
          },
          {
            "id": 65842,
            "display_name": "Food Processor",
            "type": "appliance",
            "root_tag_type": "appliance",
            "name": "food_processor"
          },
          {
            "name": "meal_prep",
            "id": 65853,
            "display_name": "Meal Prep",
            "type": "cooking_style",
            "root_tag_type": "cooking_style"
          },
          {
            "root_tag_type": "equipment",
            "name": "spatula",
            "id": 1247788,
            "display_name": "Spatula",
            "type": "equipment"
          },
          {
            "name": "chefs_knife",
            "id": 1280501,
            "display_name": "Chef's Knife",
            "type": "equipment",
            "root_tag_type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "cutting_board",
            "id": 1280503,
            "display_name": "Cutting Board",
            "type": "equipment"
          },
          {
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "dry_measuring_cups",
            "id": 1280507,
            "display_name": "Dry Measuring Cups"
          },
          {
            "display_name": "Measuring Spoons",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "measuring_spoons",
            "id": 1280508
          },
          {
            "name": "mixing_bowl",
            "id": 1280510,
            "display_name": "Mixing Bowl",
            "type": "equipment",
            "root_tag_type": "equipment"
          },
          {
            "root_tag_type": "healthy",
            "name": "high_protein",
            "id": 8091917,
            "display_name": "High-Protein",
            "type": "healthy"
          },
          {
            "root_tag_type": "cuisine",
            "name": "cuisine",
            "id": 8757513,
            "display_name": "Cuisine",
            "type": "cuisine"
          },
          {
            "root_tag_type": "appliance",
            "name": "appliance",
            "id": 9295811,
            "display_name": "Appliance",
            "type": "appliance"
          },
          {
            "display_name": "Difficulty",
            "type": "difficulty",
            "root_tag_type": "difficulty",
            "name": "difficulty",
            "id": 9295816
          },
          {
            "root_tag_type": "meal",
            "name": "sandwiches",
            "id": 9299494,
            "display_name": "Sandwiches",
            "type": "lunch"
          },
          {
            "id": 9299514,
            "display_name": "Chicken",
            "type": "dinner",
            "root_tag_type": "meal",
            "name": "chicken"
          }
        ],
        "is_one_top": false,
        "servings_noun_plural": "servings",
        "total_time_minutes": null,
        "aspect_ratio": "1:1",
        "created_at": 1546890315,
        "description": "This chicken salad is a lunchtime delight! Packed with creamy avocado, tender chicken, and crunchy veggies, it's a healthy and satisfying meal that won't weigh you down. Tossed in a tangy yogurt dressing with a hint of spice, it's a flavor explosion that's perfect for a light meal.",
        "nutrition": {
          "calories": 250,
          "sugar": 8,
          "carbohydrates": 13,
          "fiber": 3,
          "updated_at": "2021-05-03T13:23:58+02:00",
          "protein": 29,
          "fat": 8
        },
        "num_servings": 4,
        "cook_time_minutes": 0,
        "video_id": 73153,
        "country": "US",
        "keywords": "avocado, chia pudding, chicken salad, chickpea chips, deviled eggs, easy, healthy, keto, protein, snacks, vegan, vegetarian",
        "facebook_posts": [],
        "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/45b4efeb5d2c4d29970344ae165615ab/FixedFBFinal.jpg",
        "thumbnail_alt_text": "",
        "updated_at": 1692116691,
        "original_video_url": "https://s3.amazonaws.com/video-api-prod/assets/a0e1b07dc71c4ac6b378f24493ae2d85/FixedFBFinal.mp4",
        "instructions": [
          {
            "position": 1,
            "display_text": "In a blender or food processor, combine the yogurt, lime juice, pepper, and chili powder and pulse to combine. Add ½ of the avocado and blend until creamy.",
            "start_time": 7000,
            "appliance": null,
            "end_time": 26500,
            "temperature": null,
            "id": 43381
          },
          {
            "display_text": "In a medium bowl, combine the chicken, yogurt sauce, celery, the remaining ½ avocado, onion, and salt. Mix until well combined.",
            "start_time": 29000,
            "appliance": null,
            "end_time": 43500,
            "temperature": null,
            "id": 43382,
            "position": 2
          },
          {
            "position": 3,
            "display_text": "Serve on low-carb bread and garnish with cilantro, or as desired.",
            "start_time": 0,
            "appliance": null,
            "end_time": 0,
            "temperature": null,
            "id": 43383
          },
          {
            "position": 4,
            "display_text": "Enjoy!",
            "start_time": 44666,
            "appliance": null,
            "end_time": 47166,
            "temperature": null,
            "id": 43384
          }
        ],
        "language": "eng",
        "show": {
          "name": "Goodful",
          "id": 34
        },
        "video_url": "https://vid.tasty.co/output/121934/hls24_1546897597.m3u8",
        "credits": [
          {
            "name": "Isabel Castillo",
            "type": "internal"
          },
          {
            "name": "Karlee Rotoly",
            "type": "internal"
          }
        ],
        "approved_at": 1553195044,
        "topics": [
          {
            "name": "Bread Lovers",
            "slug": "bread"
          },
          {
            "name": "Sunday Brunch",
            "slug": "brunch"
          },
          {
            "name": "Healthy Eating",
            "slug": "healthy"
          },
          {
            "name": "Low Carb Meals",
            "slug": "low-carb-meals"
          },
          {
            "name": "Weekend Meal Prep",
            "slug": "meal-prep"
          },
          {
            "name": "Romantic Dinners",
            "slug": "romantic-dinners"
          },
          {
            "name": "Snacks",
            "slug": "snacks"
          },
          {
            "name": "American",
            "slug": "american"
          }
        ],
        "user_ratings": {
          "count_positive": 757,
          "score": 0.919806,
          "count_negative": 66
        },
        "brand": null,
        "compilations": [
          {
            "language": "eng",
            "video_url": "https://vid.tasty.co/output/121934/hls24_1546897597.m3u8",
            "approved_at": 1553197578,
            "buzz_id": null,
            "slug": "protein-packed-snacks",
            "promotion": "partial",
            "keywords": null,
            "description": "Whether you’re trying to be healthy, pulling an all-nighter, or just trying to get through the day, protein-packed snacks are your best friends. That’s because protein can give you an energy boost and help you stay fuller longer. From <a href=\"https://tasty.co/recipe/avocado-deviled-eggs\">avocado deviled eggs</a> to <a href=\"https://tasty.co/recipe/cacao-chia-pudding\">cacao chia pudding</a>, these snacks are full of protein-packed ingredients like Greek yogurt and almond butter, which will ensure you don’t get hangry anytime soon.",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/199563.jpg",
            "created_at": 1546890391,
            "show": [
              {
                "name": "Goodful",
                "id": 34
              }
            ],
            "thumbnail_alt_text": "",
            "name": "Protein-Packed Snacks",
            "id": 848,
            "beauty_url": null,
            "video_id": 73153,
            "aspect_ratio": "1:1",
            "is_shoppable": true,
            "facebook_posts": [],
            "draft_status": "published",
            "canonical_id": "compilation:848",
            "country": "US"
          },
          {
            "is_shoppable": false,
            "show": [
              {
                "name": "Goodful",
                "id": 34
              }
            ],
            "language": "eng",
            "beauty_url": null,
            "aspect_ratio": "1:1",
            "draft_status": "published",
            "thumbnail_alt_text": "",
            "canonical_id": "compilation:1353",
            "id": 1353,
            "buzz_id": null,
            "description": null,
            "created_at": 1578291052,
            "name": "5 Easy & Healthy Avocado Recipes",
            "country": "US",
            "facebook_posts": [],
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/250396.jpg",
            "video_url": "https://vid.tasty.co/output/156634/hls24_1578291102.m3u8",
            "approved_at": 1578330513,
            "slug": "5-easy-healthy-avocado-recipes",
            "promotion": "full",
            "video_id": 98266,
            "keywords": null
          },
          {
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/256517.jpg",
            "id": 1403,
            "slug": "healthy-and-delicious-appetisers",
            "promotion": "full",
            "aspect_ratio": "1:1",
            "keywords": null,
            "draft_status": "published",
            "beauty_url": null,
            "country": "US",
            "is_shoppable": false,
            "created_at": 1582700418,
            "video_url": "https://vid.tasty.co/output/161151/hls24_1582700566.m3u8",
            "name": "Healthy And Delicious Appetisers ",
            "canonical_id": "compilation:1403",
            "thumbnail_alt_text": "",
            "approved_at": 1582859703,
            "buzz_id": null,
            "video_id": 101158,
            "facebook_posts": [],
            "show": [
              {
                "name": "Goodful",
                "id": 34
              }
            ],
            "description": null
          },
          {
            "keywords": null,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/280958.jpg",
            "id": 1675,
            "aspect_ratio": "1:1",
            "country": "US",
            "language": "eng",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/177500/hls24_1598874098.m3u8",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1598634358,
            "description": "Can't sleep? Want to snack? These delicious snacks are a quick and easy fix to all your after-midnight hunger pangs. Chomp down on some <a href= \"https://tasty.co/recipe/hummus-and-carrot-sticks\">hummus and carrot sticks</a> or devour a couple handfuls of delicious <a href= \"https://tasty.co/recipe/spicy-roasted-chickpeas\">oven-roasted chickpeas</a>. And once you're full and satisfied, sail softly back into dreamland!",
            "draft_status": "published",
            "canonical_id": "compilation:1675",
            "beauty_url": null,
            "slug": "healthy-snacks-for-late-night-cravings",
            "promotion": "full",
            "is_shoppable": false,
            "facebook_posts": [],
            "video_id": 111496,
            "buzz_id": null,
            "approved_at": 1599571488,
            "name": "Healthy Snacks For Late-night Cravings"
          },
          {
            "created_at": 1621947459,
            "draft_status": "published",
            "canonical_id": "compilation:2455",
            "aspect_ratio": "1:1",
            "country": "US",
            "keywords": null,
            "promotion": "full",
            "description": "Planning a trip to the beach to celebrate the coming of summer? These easy snacks will make sure you're fueled and ready for the next game of water polo. From <a href=\"https://tasty.co/recipe/garlic-parmesan-and-herb-pita-chips\">parmesan garlic & herb pita chips</a> to super easy to make <a href=\"https://tasty.co/recipe/after-school-banana-roll-ups\">banana roll-ups</a>, these treats are beach-friendly and hassle free. So what are you waiting for? Pack up your picnic basket with these goodies: summer's here! ",
            "language": "eng",
            "buzz_id": null,
            "video_url": "https://vid.tasty.co/output/203549/hls24_1621588827.m3u8",
            "name": "Easy Snacks To Pack For Your Next Beach Trip",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/322976.jpg",
            "thumbnail_alt_text": "",
            "id": 2455,
            "beauty_url": null,
            "slug": "easy-snacks-to-pack-for-your-next-beach-trip",
            "video_id": 132618,
            "is_shoppable": false,
            "facebook_posts": [],
            "approved_at": 1622033473
          },
          {
            "thumbnail_alt_text": "",
            "id": 2471,
            "buzz_id": null,
            "aspect_ratio": "1:1",
            "is_shoppable": false,
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "description": "Looking for low-carb options? We've got plenty for you! The crispy <a href=\"https://tasty.co/recipe/easy-chicken-piccata\">Chicken Piccata</a> and the saucy <a href=\"https://tasty.co/recipe/ratatouille\">Ratatouille Lasagna</a> each pack tons of flavor without going overboard on carbs — and they pair well with just about anything. The hardest part? Choosing which dish to make first!",
            "slug": "low-carb-meals-for-a-healthy-you",
            "video_id": 131584,
            "promotion": "full",
            "created_at": 1622179434,
            "draft_status": "published",
            "language": "eng",
            "video_url": "https://vid.tasty.co/output/204325/hls24_1622182197.m3u8",
            "approved_at": 1622729093,
            "country": "US",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/324268.jpg",
            "name": "Low Carb Meals For A Healthy You",
            "beauty_url": null,
            "keywords": null,
            "canonical_id": "compilation:2471"
          },
          {
            "is_shoppable": false,
            "facebook_posts": [],
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/340641.jpg",
            "canonical_id": "compilation:2741",
            "buzz_id": null,
            "video_id": 138926,
            "keywords": null,
            "description": " You can never go wrong with avocado, and these easy mouthwatering recipes can enjoyed at any time of the day. Start your day with a wholesome <a href=\"https://tasty.co/recipe/radish-avocado-toast\">Raddish Avocado Toast</a> or enjoy a <a href=\"https://tasty.co/recipe/salmon-crab-stack\">Salmon Crab Seafood Stack</a> on a lunch date with your special someone. But why settle for one when you have 31 options to try from? Avo-fun for the whole month! ",
            "video_url": "https://vid.tasty.co/output/214898/hls24_1630573823.m3u8",
            "id": 2741,
            "slug": "31-days-31-avocado-recipes",
            "promotion": "full",
            "draft_status": "published",
            "thumbnail_alt_text": "",
            "beauty_url": null,
            "name": "31 Days 31 Avocado Recipes ",
            "aspect_ratio": "1:1",
            "country": "US",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1628697577,
            "language": "eng",
            "approved_at": 1630615490
          },
          {
            "draft_status": "published",
            "beauty_url": null,
            "aspect_ratio": "1:1",
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "description": null,
            "name": "Make Healthy Snacks Tasty With These Recipes",
            "canonical_id": "compilation:2823",
            "id": 2823,
            "promotion": "full",
            "keywords": null,
            "created_at": 1631878927,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/342984.jpg",
            "video_url": "https://vid.tasty.co/output/216394/hls24_1631879337.m3u8",
            "approved_at": 1632837818,
            "buzz_id": null,
            "slug": "make-healthy-snacks-tasty-with-these-recipes",
            "video_id": 141660,
            "country": "US",
            "is_shoppable": false,
            "language": "eng",
            "thumbnail_alt_text": ""
          },
          {
            "is_shoppable": false,
            "draft_status": "published",
            "id": 2850,
            "buzz_id": null,
            "video_id": 142328,
            "beauty_url": null,
            "slug": "recipes-for-when-you-don-t-feel-like-working-out",
            "keywords": null,
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1632478266,
            "name": "Recipes For When You Don't Feel Like Working Out",
            "country": "US",
            "description": "We've all had those days when you just don't feel like working out. Regardless of whether or not you make it to the gym, these recipes will keep you feeling engaged, alert, and fueled up for whatever comes your way. From <a href=\"https://tasty.co/recipe/keto-caprese-avocado-bowls\">caprese avocado bowls</a> to <a href=\"https://tasty.co/recipe/spinach-pasta\">spinach pasta</a>, these meals are nutritious, delicious, and nourishing.",
            "canonical_id": "compilation:2850",
            "approved_at": 1633453142,
            "promotion": "full",
            "aspect_ratio": null,
            "language": "eng",
            "thumbnail_url": "https://s3.amazonaws.com/video-api-prod/assets/5aadea18cb1043cda94b0b830f660c55/FB1.jpg",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/217137/hls24_1632478454.m3u8"
          },
          {
            "facebook_posts": [],
            "description": "With so many health benefits, you ought to use yogurt wisely and creatively! It is easy to digest, packed with vitamins, and a rich source of protein as well. Make the <a href=\"https://tasty.co/recipe/honey-granola-yogurt-bark\">Honey Granola Yogurt Bark</a> for your on-the-go meals. <a href=\"https://tasty.co/recipe/paprika-spiced-chicken-with-lemon-yogurt-and-crispy-potatoes\">Paprika-Spiced Chicken With Lemon Yogurt And Crispy Potatoes</a> is the perfect dinner recipe as it is delicious, easy and healthy, all at the same time!",
            "language": "eng",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/264265/hls24_1669784196.m3u8",
            "promotion": "full",
            "aspect_ratio": "1:1",
            "is_shoppable": false,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/413697.jpg",
            "name": "Use Your Yogurt Wisely!",
            "beauty_url": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1669724060,
            "approved_at": 1670282994,
            "canonical_id": "compilation:3382",
            "country": "US",
            "keywords": null,
            "draft_status": "published",
            "id": 3382,
            "buzz_id": null,
            "slug": "use-your-yogurt-wisely",
            "video_id": 175189
          }
        ],
        "brand_id": null,
        "buzz_id": null,
        "draft_status": "published",
        "inspired_by_url": null,
        "canonical_id": "recipe:4704",
        "price": {
          "consumption_total": 900,
          "consumption_portion": 200,
          "total": 1800,
          "updated_at": "2023-09-13T07:16:08+02:00",
          "portion": 450
        },
        "prep_time_minutes": 0,
        "sections": [
          {
            "name": null,
            "position": 1,
            "components": [
              {
                "ingredient": {
                  "display_plural": "plain greek yogurts",
                  "id": 428,
                  "display_singular": "plain greek yogurt",
                  "updated_at": 1509035261,
                  "name": "plain greek yogurt",
                  "created_at": 1495053532
                },
                "id": 50242,
                "position": 1,
                "measurements": [
                  {
                    "quantity": "⅔",
                    "id": 731945,
                    "unit": {
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup"
                    }
                  },
                  {
                    "quantity": "190",
                    "id": 731942,
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    }
                  }
                ],
                "raw_text": "⅔ cup plain Greek yogurt",
                "extra_comment": ""
              },
              {
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035269,
                  "name": "lime juice",
                  "created_at": 1494878288,
                  "display_plural": "lime juices",
                  "id": 330,
                  "display_singular": "lime juice"
                },
                "id": 50243,
                "position": 2,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "1",
                    "id": 731940
                  }
                ],
                "raw_text": "1 tablespoon lime juice"
              },
              {
                "raw_text": "Pepper, to taste",
                "extra_comment": "to taste",
                "ingredient": {
                  "updated_at": 1509035287,
                  "name": "pepper",
                  "created_at": 1493314935,
                  "display_plural": "peppers",
                  "id": 29,
                  "display_singular": "pepper"
                },
                "id": 50244,
                "position": 3,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "",
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": ""
                    },
                    "quantity": "0",
                    "id": 731943
                  }
                ]
              },
              {
                "extra_comment": "",
                "ingredient": {
                  "display_plural": "chili powders",
                  "id": 7,
                  "display_singular": "chili powder",
                  "updated_at": 1509035289,
                  "name": "chili powder",
                  "created_at": 1493307101
                },
                "id": 50245,
                "position": 4,
                "measurements": [
                  {
                    "unit": {
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp",
                      "system": "imperial"
                    },
                    "quantity": "⅛",
                    "id": 731949
                  }
                ],
                "raw_text": "⅛ teaspoon chili powder"
              },
              {
                "raw_text": "1 avocado, cubed, divided",
                "extra_comment": "cubed, divided",
                "ingredient": {
                  "updated_at": 1509035215,
                  "name": "avocado",
                  "created_at": 1496185911,
                  "display_plural": "avocados",
                  "id": 1005,
                  "display_singular": "avocado"
                },
                "id": 50246,
                "position": 5,
                "measurements": [
                  {
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    },
                    "quantity": "1",
                    "id": 731941
                  }
                ]
              },
              {
                "id": 50247,
                "position": 6,
                "measurements": [
                  {
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    },
                    "quantity": "2",
                    "id": 731944
                  }
                ],
                "raw_text": "2 chicken breasts, cooked and shredded",
                "extra_comment": "cooked and shredded",
                "ingredient": {
                  "updated_at": 1509035286,
                  "name": "chicken breast",
                  "created_at": 1493430237,
                  "display_plural": "chicken breasts",
                  "id": 50,
                  "display_singular": "chicken breast"
                }
              },
              {
                "extra_comment": "diced",
                "ingredient": {
                  "updated_at": 1509035259,
                  "name": "celery",
                  "created_at": 1495082620,
                  "display_plural": "celeries",
                  "id": 458,
                  "display_singular": "celery"
                },
                "id": 50248,
                "position": 7,
                "measurements": [
                  {
                    "quantity": "1",
                    "id": 731946,
                    "unit": {
                      "display_plural": "stalks",
                      "display_singular": "stalk",
                      "abbreviation": "stalk",
                      "system": "none",
                      "name": "stalk"
                    }
                  }
                ],
                "raw_text": "1 celery stalk, diced"
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "2",
                    "id": 731951
                  }
                ],
                "raw_text": "2 tablespoons diced red onion",
                "extra_comment": "diced",
                "ingredient": {
                  "updated_at": 1681493252,
                  "name": "diced red onion",
                  "created_at": 1681493252,
                  "display_plural": "diced red onions",
                  "id": 11117,
                  "display_singular": "diced red onion"
                },
                "id": 50249,
                "position": 8
              },
              {
                "extra_comment": "to taste",
                "ingredient": {
                  "updated_at": 1509035289,
                  "name": "kosher salt",
                  "created_at": 1493307153,
                  "display_plural": "kosher salts",
                  "id": 11,
                  "display_singular": "kosher salt"
                },
                "id": 50250,
                "position": 9,
                "measurements": [
                  {
                    "id": 731947,
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    },
                    "quantity": "0"
                  }
                ],
                "raw_text": "Kosher salt, to taste"
              },
              {
                "measurements": [
                  {
                    "id": 731948,
                    "unit": {
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": "",
                      "system": "none",
                      "name": ""
                    },
                    "quantity": "0"
                  }
                ],
                "raw_text": "Low-carb bread, for serving, optional",
                "extra_comment": "for serving (optional)",
                "ingredient": {
                  "id": 11182,
                  "display_singular": "low-carb bread",
                  "updated_at": 1682530849,
                  "name": "low-carb bread",
                  "created_at": 1682530849,
                  "display_plural": "low-carb breads"
                },
                "id": 50251,
                "position": 10
              },
              {
                "position": 11,
                "measurements": [
                  {
                    "quantity": "0",
                    "id": 731950,
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    }
                  }
                ],
                "raw_text": "Fresh cilantro leaves, for garnish",
                "extra_comment": "for garnish",
                "ingredient": {
                  "updated_at": 1527199111,
                  "name": "fresh cilantro leaves",
                  "created_at": 1527199111,
                  "display_plural": "fresh cilantro leaves",
                  "id": 4163,
                  "display_singular": "fresh cilantro leaf"
                },
                "id": 50252
              }
            ]
          }
        ],
        "promotion": "partial"
      },
      {
        "language": "eng",
        "id": 48,
        "credits": [
          {
            "name": null,
            "type": "internal"
          }
        ],
        "servings_noun_plural": "servings",
        "approved_at": 1561563397,
        "yields": "Servings: 4",
        "instructions": [
          {
            "id": 377,
            "position": 1,
            "display_text": "In a deep skillet, fry the bacon until crispy. Remove to a paper towel to drain, then chop.",
            "start_time": 0,
            "appliance": null,
            "end_time": 6566,
            "temperature": null
          },
          {
            "display_text": "In the same skillet, add the chicken and season with salt, pepper, Italian seasoning, and paprika. Cook until no longer pink inside.",
            "start_time": 6967,
            "appliance": null,
            "end_time": 16217,
            "temperature": null,
            "id": 378,
            "position": 2
          },
          {
            "id": 379,
            "position": 3,
            "display_text": "Add the garlic and cook until softened.",
            "start_time": 17067,
            "appliance": null,
            "end_time": 19267,
            "temperature": null
          },
          {
            "end_time": 25667,
            "temperature": null,
            "id": 380,
            "position": 4,
            "display_text": "Add spinach and tomatoes and cook until the spinach is wilted.",
            "start_time": 19400,
            "appliance": null
          },
          {
            "start_time": 26067,
            "appliance": null,
            "end_time": 32017,
            "temperature": null,
            "id": 381,
            "position": 5,
            "display_text": "Add the cream, Parmesan, an red pepper flakes and bring to a boil."
          },
          {
            "start_time": 33017,
            "appliance": null,
            "end_time": 37016,
            "temperature": null,
            "id": 382,
            "position": 6,
            "display_text": "Add the penne and bacon, and stir until fully coated in sauce."
          },
          {
            "id": 8565,
            "position": 7,
            "display_text": "Serve with parsley, Parmesan, and red pepper flakes, if desired.",
            "start_time": 38766,
            "appliance": null,
            "end_time": 43967,
            "temperature": null
          },
          {
            "start_time": 44617,
            "appliance": null,
            "end_time": 47517,
            "temperature": null,
            "id": 383,
            "position": 8,
            "display_text": "Enjoy!"
          }
        ],
        "user_ratings": {
          "count_positive": 9753,
          "score": 0.978627,
          "count_negative": 213
        },
        "show_id": 17,
        "total_time_minutes": 30,
        "updated_at": 1692119759,
        "video_url": "https://vid.tasty.co/output/8318/low_1472701763.m3u8",
        "renditions": [
          {
            "aspect": "square",
            "minimum_bit_rate": null,
            "name": "low",
            "maximum_bit_rate": null,
            "container": "mp4",
            "bit_rate": null,
            "url": "https://vid.tasty.co/output/8318/low_1472701763.m3u8",
            "duration": 0,
            "content_type": "application/vnd.apple.mpegurl",
            "width": 1080,
            "height": 1080,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/8318/1445289064805-h2exzu/1472701763_00001.png",
            "file_size": null
          },
          {
            "url": "https://vid.tasty.co/output/8318/mp4_1280X720/1472701763",
            "bit_rate": null,
            "content_type": "video/mp4",
            "name": "mp4_720x720",
            "maximum_bit_rate": null,
            "height": 720,
            "container": "mp4",
            "file_size": null,
            "duration": 0,
            "aspect": "square",
            "width": 720,
            "minimum_bit_rate": null,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/8318/mp4_1280X720/1472701763_00001.png"
          },
          {
            "maximum_bit_rate": null,
            "height": 640,
            "file_size": null,
            "url": "https://vid.tasty.co/output/8318/mp4_640x640/1472701763",
            "duration": 0,
            "minimum_bit_rate": null,
            "name": "mp4_640x640",
            "width": 640,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/8318/mp4_640x640/1472701763_00001.png",
            "bit_rate": null,
            "content_type": "video/mp4",
            "aspect": "square"
          },
          {
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/8318/mp4_720x1280/1472701763_00001.png",
            "bit_rate": null,
            "height": 720,
            "minimum_bit_rate": null,
            "name": "mp4_720x720",
            "file_size": null,
            "url": "https://vid.tasty.co/output/8318/mp4_720x1280/1472701763",
            "duration": 0,
            "content_type": "video/mp4",
            "aspect": "square",
            "width": 720,
            "maximum_bit_rate": null
          }
        ],
        "country": "US",
        "seo_path": "8757513,9295874,64453",
        "show": {
          "name": "Tasty",
          "id": 17
        },
        "created_at": 1493235933,
        "thumbnail_url": "https://img.buzzfeed.com/video-api-prod/assets/641e3c1a5f2a48f29b605bff9cbe72b6/BFV10263_CreamyChickenPenne-Thumb1080.jpg",
        "facebook_posts": [],
        "price": {
          "total": 2900,
          "updated_at": "2023-09-13T07:15:42+02:00",
          "portion": 750,
          "consumption_total": 1350,
          "consumption_portion": 350
        },
        "total_time_tier": {
          "tier": "under_30_minutes",
          "display_tier": "Under 30 minutes"
        },
        "video_ad_content": "undetermined",
        "brand": null,
        "slug": "creamy-chicken-penne-pasta",
        "prep_time_minutes": 15,
        "aspect_ratio": "1:1",
        "topics": [
          {
            "name": "Easy Dinner",
            "slug": "easy-dinner"
          },
          {
            "name": "Weekend Meal Prep",
            "slug": "meal-prep"
          },
          {
            "name": "Romantic Dinners",
            "slug": "romantic-dinners"
          },
          {
            "name": "Dinner",
            "slug": "dinner"
          },
          {
            "name": "Pasta",
            "slug": "pasta"
          },
          {
            "name": "American",
            "slug": "american"
          },
          {
            "name": "Italian",
            "slug": "italian"
          }
        ],
        "is_shoppable": true,
        "promotion": "full",
        "tags": [
          {
            "root_tag_type": "cuisine",
            "name": "north_american",
            "id": 64444,
            "display_name": "North American",
            "type": "cuisine"
          },
          {
            "root_tag_type": "cuisine",
            "name": "italian",
            "id": 64453,
            "display_name": "Italian",
            "type": "european"
          },
          {
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "comfort_food",
            "id": 64462,
            "display_name": "Comfort Food"
          },
          {
            "name": "easy",
            "id": 64471,
            "display_name": "Easy",
            "type": "difficulty",
            "root_tag_type": "difficulty"
          },
          {
            "id": 64472,
            "display_name": "Under 30 Minutes",
            "type": "difficulty",
            "root_tag_type": "difficulty",
            "name": "under_30_minutes"
          },
          {
            "root_tag_type": "meal",
            "name": "dinner",
            "id": 64486,
            "display_name": "Dinner",
            "type": "meal"
          },
          {
            "root_tag_type": "meal",
            "name": "weeknight",
            "id": 64505,
            "display_name": "Weeknight",
            "type": "dinner"
          },
          {
            "display_name": "Fusion",
            "type": "cuisine",
            "root_tag_type": "cuisine",
            "name": "fusion",
            "id": 65410
          },
          {
            "root_tag_type": "appliance",
            "name": "stove_top",
            "id": 65848,
            "display_name": "Stove Top",
            "type": "appliance"
          },
          {
            "root_tag_type": "cooking_style",
            "name": "meal_prep",
            "id": 65853,
            "display_name": "Meal Prep",
            "type": "cooking_style"
          },
          {
            "name": "pan_fry",
            "id": 65859,
            "display_name": "Pan Fry",
            "type": "cooking_style",
            "root_tag_type": "cooking_style"
          },
          {
            "root_tag_type": "equipment",
            "name": "pyrex",
            "id": 1247785,
            "display_name": "Pyrex",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "saute_pan",
            "id": 1247787,
            "display_name": "Saute Pan",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "strainer",
            "id": 1247789,
            "display_name": "Strainer",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "tongs",
            "id": 1247790,
            "display_name": "Tongs",
            "type": "equipment"
          },
          {
            "display_name": "Chef's Knife",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "chefs_knife",
            "id": 1280501
          },
          {
            "root_tag_type": "equipment",
            "name": "cutting_board",
            "id": 1280503,
            "display_name": "Cutting Board",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "liquid_measuring_cup",
            "id": 1280506,
            "display_name": "Liquid Measuring Cup",
            "type": "equipment"
          },
          {
            "display_name": "Dry Measuring Cups",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "dry_measuring_cups",
            "id": 1280507
          },
          {
            "display_name": "Measuring Spoons",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "measuring_spoons",
            "id": 1280508
          },
          {
            "name": "mccormick_easy_dinner",
            "id": 5143247,
            "display_name": "McCormick Easy Dinner",
            "type": "business_tags",
            "root_tag_type": "business_tags"
          },
          {
            "id": 8091747,
            "display_name": "Under 45 Minutes",
            "type": "difficulty",
            "root_tag_type": "difficulty",
            "name": "under_45_minutes"
          },
          {
            "name": "under_1_hour",
            "id": 8091748,
            "display_name": "Under 1 Hour",
            "type": "difficulty",
            "root_tag_type": "difficulty"
          },
          {
            "id": 8091917,
            "display_name": "High-Protein",
            "type": "healthy",
            "root_tag_type": "healthy",
            "name": "high_protein"
          },
          {
            "root_tag_type": "healthy",
            "name": "low_sugar",
            "id": 8091918,
            "display_name": "Low-Sugar",
            "type": "healthy"
          },
          {
            "root_tag_type": "healthy",
            "name": "high_fiber",
            "id": 8091920,
            "display_name": "High-Fiber",
            "type": "healthy"
          },
          {
            "root_tag_type": "meal",
            "name": "chicken",
            "id": 9299514,
            "display_name": "Chicken",
            "type": "dinner"
          },
          {
            "root_tag_type": "meal",
            "name": "pasta",
            "id": 9299522,
            "display_name": "Pasta",
            "type": "dinner"
          }
        ],
        "nutrition": {
          "updated_at": "2022-10-02T08:05:26+02:00",
          "protein": 47,
          "fat": 46,
          "calories": 703,
          "sugar": 5,
          "carbohydrates": 37,
          "fiber": 2
        },
        "name": "Creamy Chicken Penne Pasta",
        "draft_status": "published",
        "beauty_url": null,
        "canonical_id": "recipe:48",
        "cook_time_minutes": 15,
        "video_id": 1488,
        "sections": [
          {
            "components": [
              {
                "position": 1,
                "measurements": [
                  {
                    "unit": {
                      "display_singular": "slice",
                      "abbreviation": "slice",
                      "system": "none",
                      "name": "slice",
                      "display_plural": "slices"
                    },
                    "quantity": "4",
                    "id": 486066
                  }
                ],
                "raw_text": "4 slices bacon",
                "extra_comment": "",
                "ingredient": {
                  "display_singular": "bacon",
                  "updated_at": 1509035279,
                  "name": "bacon",
                  "created_at": 1494212643,
                  "display_plural": "bacons",
                  "id": 214
                },
                "id": 522
              },
              {
                "raw_text": "2 chicken breasts, sliced",
                "extra_comment": "sliced",
                "ingredient": {
                  "id": 50,
                  "display_singular": "chicken breast",
                  "updated_at": 1509035286,
                  "name": "chicken breast",
                  "created_at": 1493430237,
                  "display_plural": "chicken breasts"
                },
                "id": 523,
                "position": 2,
                "measurements": [
                  {
                    "unit": {
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": "",
                      "system": "none",
                      "name": ""
                    },
                    "quantity": "2",
                    "id": 486070
                  }
                ]
              },
              {
                "position": 3,
                "measurements": [
                  {
                    "unit": {
                      "display_singular": "",
                      "abbreviation": "",
                      "system": "none",
                      "name": "",
                      "display_plural": ""
                    },
                    "quantity": "0",
                    "id": 486067
                  }
                ],
                "raw_text": "Salt & pepper to taste",
                "extra_comment": "to taste",
                "ingredient": {
                  "display_singular": "salt",
                  "updated_at": 1509035288,
                  "name": "salt",
                  "created_at": 1493314644,
                  "display_plural": "salts",
                  "id": 22
                },
                "id": 524
              },
              {
                "position": 4,
                "measurements": [
                  {
                    "unit": {
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": "",
                      "system": "none"
                    },
                    "quantity": "0",
                    "id": 486068
                  }
                ],
                "raw_text": "n/a",
                "extra_comment": "to taste",
                "ingredient": {
                  "id": 29,
                  "display_singular": "pepper",
                  "updated_at": 1509035287,
                  "name": "pepper",
                  "created_at": 1493314935,
                  "display_plural": "peppers"
                },
                "id": 12253
              },
              {
                "extra_comment": "",
                "ingredient": {
                  "display_singular": "italian seasoning",
                  "updated_at": 1509035253,
                  "name": "italian seasoning",
                  "created_at": 1495219808,
                  "display_plural": "italian seasonings",
                  "id": 533
                },
                "id": 525,
                "position": 5,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp"
                    },
                    "quantity": "2",
                    "id": 486069
                  }
                ],
                "raw_text": "2 teaspoons Italian seasoning"
              },
              {
                "raw_text": "1 teaspoon paprika",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035286,
                  "name": "paprika",
                  "created_at": 1493430149,
                  "display_plural": "paprikas",
                  "id": 42,
                  "display_singular": "paprika"
                },
                "id": 526,
                "position": 6,
                "measurements": [
                  {
                    "unit": {
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp",
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons"
                    },
                    "quantity": "1",
                    "id": 486071
                  }
                ]
              },
              {
                "raw_text": "2 cloves garlic, minced",
                "extra_comment": "minced",
                "ingredient": {
                  "updated_at": 1509035285,
                  "name": "garlic",
                  "created_at": 1493744766,
                  "display_plural": "garlics",
                  "id": 95,
                  "display_singular": "garlic"
                },
                "id": 527,
                "position": 7,
                "measurements": [
                  {
                    "unit": {
                      "system": "none",
                      "name": "clove",
                      "display_plural": "cloves",
                      "display_singular": "clove",
                      "abbreviation": "clove"
                    },
                    "quantity": "2",
                    "id": 486074
                  }
                ]
              },
              {
                "raw_text": "2 cups spinach",
                "extra_comment": "",
                "ingredient": {
                  "display_plural": "spinaches",
                  "id": 164,
                  "display_singular": "spinach",
                  "updated_at": 1509035282,
                  "name": "spinach",
                  "created_at": 1493925032
                },
                "id": 528,
                "position": 8,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "g",
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g"
                    },
                    "quantity": "80",
                    "id": 486073
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "2",
                    "id": 486072
                  }
                ]
              },
              {
                "extra_comment": "diced",
                "ingredient": {
                  "updated_at": 1528127599,
                  "name": "small tomato",
                  "created_at": 1528127599,
                  "display_plural": "small tomatoes",
                  "id": 4236,
                  "display_singular": "small tomato"
                },
                "id": 529,
                "position": 9,
                "measurements": [
                  {
                    "id": 486075,
                    "unit": {
                      "abbreviation": "",
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": ""
                    },
                    "quantity": "4"
                  }
                ],
                "raw_text": "4 small tomatoes, diced"
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "1 ½",
                    "id": 486078
                  },
                  {
                    "unit": {
                      "display_singular": "mL",
                      "abbreviation": "mL",
                      "system": "metric",
                      "name": "milliliter",
                      "display_plural": "mL"
                    },
                    "quantity": "360",
                    "id": 486077
                  }
                ],
                "raw_text": "1 ½ cups cream",
                "extra_comment": "",
                "ingredient": {
                  "id": 305,
                  "display_singular": "cream",
                  "updated_at": 1509035271,
                  "name": "cream",
                  "created_at": 1494812161,
                  "display_plural": "creams"
                },
                "id": 530,
                "position": 10
              },
              {
                "extra_comment": "plus more for serving",
                "ingredient": {
                  "id": 334,
                  "display_singular": "shredded parmesan cheese",
                  "updated_at": 1509035269,
                  "name": "shredded parmesan cheese",
                  "created_at": 1494880013,
                  "display_plural": "shredded parmesan cheeses"
                },
                "id": 531,
                "position": 11,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "1",
                    "id": 486080
                  },
                  {
                    "unit": {
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g",
                      "system": "metric",
                      "name": "gram"
                    },
                    "quantity": "100",
                    "id": 486079
                  }
                ],
                "raw_text": "1 cup shredded parmesan"
              },
              {
                "position": 12,
                "measurements": [
                  {
                    "quantity": "½",
                    "id": 486076,
                    "unit": {
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp",
                      "system": "imperial"
                    }
                  }
                ],
                "raw_text": "½ teaspoon red pepper flakes",
                "extra_comment": "plus more for garnish",
                "ingredient": {
                  "updated_at": 1509035267,
                  "name": "red pepper flakes",
                  "created_at": 1494885083,
                  "display_plural": "red pepper flakes",
                  "id": 351,
                  "display_singular": "red pepper flake"
                },
                "id": 532
              },
              {
                "position": 13,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "ounce",
                      "display_plural": "oz",
                      "display_singular": "oz",
                      "abbreviation": "oz"
                    },
                    "quantity": "10",
                    "id": 486083
                  },
                  {
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "285",
                    "id": 486081
                  }
                ],
                "raw_text": "10 ounces penne, cooked al dente",
                "extra_comment": "cooked until al dente",
                "ingredient": {
                  "name": "penne pasta",
                  "created_at": 1494811670,
                  "display_plural": "penne pastas",
                  "id": 303,
                  "display_singular": "penne pasta",
                  "updated_at": 1509035271
                },
                "id": 533
              },
              {
                "raw_text": "n/a",
                "extra_comment": "for garnish",
                "ingredient": {
                  "display_plural": "Chopped fresh parsleys",
                  "id": 3893,
                  "display_singular": "Chopped fresh parsley",
                  "updated_at": 1521754417,
                  "name": "Chopped fresh parsley",
                  "created_at": 1521754417
                },
                "id": 45554,
                "position": 14,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "3",
                    "id": 486082
                  }
                ]
              }
            ],
            "name": null,
            "position": 1
          }
        ],
        "num_servings": 4,
        "buzz_id": null,
        "thumbnail_alt_text": "",
        "is_one_top": false,
        "tips_and_ratings_enabled": true,
        "description": "If you're in need of a hug in a bowl, this creamy chicken penne pasta is just the ticket. With tender chicken, perfectly cooked pasta, and a velvety sauce, it's pure comfort in a bowl.",
        "inspired_by_url": null,
        "nutrition_visibility": "auto",
        "keywords": null,
        "servings_noun_singular": "serving",
        "brand_id": null,
        "compilations": [
          {
            "slug": "tasty-s-best-pasta-recipes",
            "country": "US",
            "keywords": null,
            "approved_at": 1600108969,
            "name": "Tasty's Best Pasta Recipes",
            "id": 1684,
            "is_shoppable": false,
            "facebook_posts": [],
            "video_url": "https://vid.tasty.co/output/177582/hls24_1598903165.m3u8",
            "canonical_id": "compilation:1684",
            "beauty_url": null,
            "promotion": "full",
            "video_id": 112179,
            "aspect_ratio": "1:1",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "description": "Having trouble deciding what you should make next? Take a look at a few of the best pasta recipes we have to offer! From a <a href=\"https://tasty.co/recipe/vegan-mac-n-cheese\">vegan version of mac 'n' cheese</a> to delicious <a href=\"https://tasty.co/recipe/spaghetti-meatball-bake\">baked meatballs and spaghetti</a>, these ideas will satisfy every craving. Pair your pasta with a salad, dessert, and glass of wine — and you've got a restaurant-quality menu right at home!",
            "thumbnail_alt_text": "",
            "buzz_id": null,
            "created_at": 1598896707,
            "draft_status": "published",
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/281005.jpg"
          },
          {
            "aspect_ratio": "1:1",
            "country": "US",
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "video_url": "https://vid.tasty.co/output/274258/hls24_1676829870.m3u8",
            "draft_status": "published",
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/427961.jpg",
            "slug": "penne-pasta-recipes",
            "keywords": null,
            "facebook_posts": [],
            "created_at": 1676829896,
            "description": "Despite so many options, classic penne is always a great choice when it comes to pasta. It’s easy to cook, delicious, and pairs well with almost any sauce. <a href=\"https://tasty.co/recipe/creamy-chicken-penne-pasta\">Creamy Chicken Penne Pasta</a> will always satisfy, or try the <a href=\"https://tasty.co/recipe/fajita-pasta-bake\">Fajita Pasta Bake</a> for a creative twist. Add as many or as few veggies as you want and you’re good to go!",
            "thumbnail_alt_text": "",
            "approved_at": 1677002300,
            "canonical_id": "compilation:3515",
            "beauty_url": null,
            "video_id": 182285,
            "name": "Penne For Your Thoughts",
            "id": 3515,
            "buzz_id": null,
            "promotion": "full"
          }
        ],
        "seo_title": null,
        "original_video_url": "https://s3.amazonaws.com/video-api-prod/assets/9b377d62783847ae8905f3c6bd6eb14c/BFV10263_CreamyChickenPenne-FB1080SQ.mp4"
      },
      {
        "aspect_ratio": "1:1",
        "created_at": 1515193206,
        "thumbnail_alt_text": "",
        "approved_at": 1515196548,
        "servings_noun_plural": "servings",
        "show_id": 17,
        "name": "One-Pot Chicken Fajita Pasta",
        "tips_and_ratings_enabled": true,
        "is_shoppable": true,
        "yields": "Serves",
        "compilations": [
          {
            "aspect_ratio": null,
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "created_at": 1515196894,
            "draft_status": "published",
            "language": "eng",
            "thumbnail_alt_text": "",
            "promotion": "full",
            "video_id": 43415,
            "is_shoppable": false,
            "video_url": "https://vid.tasty.co/output/71466/hls24_1515191493.m3u8",
            "approved_at": 1515330272,
            "beauty_url": null,
            "country": "US",
            "keywords": null,
            "description": null,
            "name": "Top 5 Pasta Recipes",
            "id": 389,
            "buzz_id": null,
            "facebook_posts": [],
            "thumbnail_url": "https://s3.amazonaws.com/video-api-prod/assets/654d0916588d46c5835b7a5f547a090e/BestPastaFB.jpg",
            "canonical_id": "compilation:389",
            "slug": "top-5-pasta-recipes"
          },
          {
            "buzz_id": null,
            "slug": "6-easy-weeknight-dinners",
            "facebook_posts": [],
            "created_at": 1542269648,
            "description": null,
            "language": "eng",
            "id": 747,
            "beauty_url": null,
            "video_id": 70883,
            "promotion": "full",
            "country": "US",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/189250.jpg",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/116166/hls24_1542706640.m3u8",
            "approved_at": 1542592784,
            "name": "6 Easy Weeknight Dinners",
            "aspect_ratio": "16:9",
            "is_shoppable": false,
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "draft_status": "published",
            "canonical_id": "compilation:747"
          },
          {
            "aspect_ratio": "16:9",
            "created_at": 1546589609,
            "video_url": "https://vid.tasty.co/output/121867/hls24_1546842426.m3u8",
            "approved_at": 1547054937,
            "beauty_url": null,
            "draft_status": "published",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/199080.jpg",
            "id": 841,
            "buzz_id": null,
            "slug": "6-unforgettable-pasta-recipes-in-red-sauce",
            "canonical_id": "compilation:841",
            "video_id": 74923,
            "description": null,
            "language": "eng",
            "thumbnail_alt_text": "",
            "country": "US",
            "is_shoppable": false,
            "keywords": null,
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "name": "6 Unforgettable Pasta Recipes In Red Sauce",
            "promotion": "full"
          },
          {
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "description": null,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/231254.jpg",
            "thumbnail_alt_text": "",
            "name": "5 Delicious Chicken Dinner Recipes You'll Never Get Bored Of",
            "id": 1073,
            "promotion": "full",
            "is_shoppable": false,
            "keywords": null,
            "draft_status": "published",
            "video_url": "https://vid.tasty.co/output/143226/hls24_1566886980.m3u8",
            "buzz_id": null,
            "slug": "5-delicious-chicken-dinner-recipes-you-ll-never-get-bored-of",
            "country": "US",
            "created_at": 1566886784,
            "language": "eng",
            "video_id": 90346,
            "aspect_ratio": "1:1",
            "approved_at": 1567119679,
            "canonical_id": "compilation:1073",
            "beauty_url": null,
            "facebook_posts": []
          },
          {
            "id": 1458,
            "buzz_id": null,
            "created_at": 1585663176,
            "description": null,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/260497.jpg",
            "promotion": "full",
            "aspect_ratio": "1:1",
            "facebook_posts": [],
            "thumbnail_alt_text": "",
            "language": "eng",
            "video_url": "https://vid.tasty.co/output/163875/hls24_1585665830.m3u8",
            "approved_at": 1585846309,
            "canonical_id": "compilation:1458",
            "slug": "5-mouth-watering-chicken-dinners",
            "country": "US",
            "is_shoppable": true,
            "draft_status": "published",
            "beauty_url": null,
            "video_id": 102863,
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "name": "5 Mouth-Watering Chicken Dinners"
          },
          {
            "promotion": "full",
            "video_id": 106383,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "description": null,
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/267494.jpg",
            "beauty_url": null,
            "slug": "must-have-pasta-dishes",
            "aspect_ratio": "1:1",
            "is_shoppable": false,
            "keywords": null,
            "video_url": "https://vid.tasty.co/output/168557/hls24_1590680892.m3u8",
            "buzz_id": null,
            "created_at": 1590679834,
            "thumbnail_alt_text": "",
            "name": "Must-Have Pasta Dishes",
            "canonical_id": "compilation:1501",
            "id": 1501,
            "country": "US",
            "facebook_posts": [],
            "draft_status": "published",
            "approved_at": 1591116124
          },
          {
            "approved_at": 1596648463,
            "name": "For Pasta Lovers Only",
            "aspect_ratio": "1:1",
            "draft_status": "published",
            "canonical_id": "compilation:1520",
            "video_id": 106033,
            "created_at": 1590774548,
            "language": "eng",
            "facebook_posts": [],
            "description": null,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/267816.jpg",
            "video_url": "https://vid.tasty.co/output/168808/hls24_1590772407.m3u8",
            "id": 1520,
            "beauty_url": null,
            "country": "US",
            "keywords": null,
            "thumbnail_alt_text": "",
            "buzz_id": null,
            "slug": "for-pasta-lovers-only",
            "promotion": "full",
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ]
          },
          {
            "draft_status": "published",
            "thumbnail_alt_text": "",
            "keywords": null,
            "video_url": "https://vid.tasty.co/output/198051/hls24_1617121116.m3u8",
            "name": "Make The Perfect Bowl Of Pasta With These Recipes",
            "beauty_url": null,
            "buzz_id": null,
            "slug": "make-the-perfect-bowl-of-pasta-with-these-recipes",
            "aspect_ratio": "1:1",
            "facebook_posts": [],
            "id": 2219,
            "video_id": 127253,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/314886.jpg",
            "approved_at": 1617195181,
            "country": "US",
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1615809320,
            "description": "We've curated a special assortment of pasta recipes just for you. From our unique <a href=\"https://tasty.co/recipe/tomato-and-anchovy-pasta\">tomato anchovy pasta</a> to mouth-watering <a href=\"https://tasty.co/recipe/one-pot-chicken-bacon-and-goat-cheese\">chicken, bacon and goat cheese pasta</a>, these recipes are made to impress! We're going to go eat our hearts out now: time to get cooking!",
            "language": "eng",
            "canonical_id": "compilation:2219",
            "promotion": "full"
          },
          {
            "created_at": 1619273305,
            "draft_status": "published",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/319056.jpg",
            "beauty_url": null,
            "name": "One Pot Recipes For Us Lazy People",
            "canonical_id": "compilation:2335",
            "buzz_id": null,
            "slug": "one-pot-recipes-for-us-lazy-people",
            "aspect_ratio": "1:1",
            "keywords": null,
            "description": "Looking for simple, easy-to-make meal recipes? Start with these! You can serve them with just about anything, and you can switch up the flavors — like a <a href=\"https://tasty.co/recipe/filipino-style-one-pot-chicken-adobo\">Filipino-Style One-Pot Chicken Adobo</a> or <a href=\"https://tasty.co/recipe/one-pot-chicken-teriyaki-with-rice\">One-Pot Chicken Teriyaki With Rice</a>  — depending on what you’re craving. They’re the perfect meal for a busy day and are ready to eat in no time.",
            "video_url": "https://vid.tasty.co/output/200985/hls24_1619273595.m3u8",
            "promotion": "full",
            "video_id": 129805,
            "is_shoppable": false,
            "facebook_posts": [],
            "language": "eng",
            "id": 2335,
            "country": "US",
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "thumbnail_alt_text": "",
            "approved_at": 1620137247
          },
          {
            "name": "30 Ways You've Never Eaten Chicken Before ",
            "promotion": "full",
            "description": "Chicken is always a crowd favorite, but we you gotta switch it up! Say goodbye to your plain Jane chicken recipes and taste test our carefully picked recipes. If you are a guac fiend like we are, you will absolutely devour the <a href==\"https://tasty.co/recipe/bacon-guacamole-chicken-bombs\">Bacon Guacamole Chicken Bombs</a> and if you're going the fancy route, the <a href=\"https://tasty.co/recipe/buffalo-chicken-dip\">Buffalo Chicken Dip</a> is a must-have! Don't forget to pick your favorites!",
            "language": "eng",
            "video_url": "https://vid.tasty.co/output/208056/hls24_1625063242.m3u8",
            "thumbnail_alt_text": "",
            "approved_at": 1625236072,
            "slug": "30-ways-you-ve-never-eaten-chicken-before",
            "aspect_ratio": "1:1",
            "facebook_posts": [],
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/330044.jpg",
            "buzz_id": null,
            "is_shoppable": false,
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "canonical_id": "compilation:2543",
            "id": 2543,
            "beauty_url": null,
            "video_id": 135542,
            "country": "US",
            "created_at": 1624700634,
            "draft_status": "published"
          },
          {
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/329262.jpg",
            "id": 2544,
            "beauty_url": null,
            "facebook_posts": [],
            "description": "It's fiesta time! No matter what you're celebrating, these power-packed fajitas will definitely leave you wanting more. Spice up your summer afternoon with our crunchy and spicy <a href=\"https://tasty.co/recipe/loaded-chicken-fajita-nachos\">Chicken Nachos Fajitas</a>, or add a grilled twist to your menu with the <a href=\"https://tasty.co/recipe/steak-fajita-quesadillas\">Steak Quesadillas Fajita</a>. So what're you waiting for? Whip those aprons out, it's fajita fiesta time!",
            "approved_at": 1625154011,
            "name": "Have A Fiesta With These Fajitas",
            "canonical_id": "compilation:2544",
            "slug": "have-a-fiesta-with-these-fajitas",
            "video_id": 133731,
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "draft_status": "published",
            "keywords": null,
            "created_at": 1624872975,
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/207506/hls24_1624873291.m3u8",
            "buzz_id": null,
            "promotion": "full",
            "aspect_ratio": "1:1",
            "country": "US"
          },
          {
            "keywords": null,
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "description": "Work days are feeling long, but we need you to keep powering through, so we think we have just the thing: A whole list of lunches that'll satisfy every mid-day craving. From mouth-watering <a href=\"https://tasty.co/recipe/chinese-take-away-style-lemon-chicken\">Chinese-style lemon chicken</a> to <a href=\"https://tasty.co/recipe/vegan-pesto-pasta\">vegan pesto pasta</a>, these recipes will definitely make your (work) day.",
            "language": "eng",
            "video_id": 137469,
            "is_shoppable": false,
            "draft_status": "published",
            "video_url": "https://vid.tasty.co/output/211090/hls24_1627643262.m3u8",
            "approved_at": 1627921311,
            "name": "Tasty's Top 23 Lunches ",
            "id": 2648,
            "aspect_ratio": "1:1",
            "thumbnail_alt_text": "",
            "canonical_id": "compilation:2648",
            "promotion": "full",
            "created_at": 1627294831,
            "facebook_posts": [],
            "thumbnail_url": "https://s3.amazonaws.com/video-api-prod/assets/94be2401af1f483ebfbb8d98483e880c/FB2.jpg",
            "beauty_url": null,
            "buzz_id": null,
            "slug": "tasty-s-top-23-lunches",
            "country": "US"
          },
          {
            "draft_status": "published",
            "thumbnail_alt_text": "Chicken Recipes To Cure Your Hunger",
            "approved_at": 1639420355,
            "keywords": null,
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "is_shoppable": false,
            "facebook_posts": [],
            "created_at": 1638896875,
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/356481.jpg",
            "promotion": "full",
            "aspect_ratio": "1:1",
            "country": "US",
            "canonical_id": "compilation:2986",
            "beauty_url": null,
            "buzz_id": null,
            "video_url": "https://vid.tasty.co/output/225363/hls24_1638944532.m3u8",
            "name": "Chicken Recipes To Cure Your Hunger",
            "slug": "chicken-recipes-to-cure-your-hunger",
            "video_id": 148176,
            "description": null,
            "id": 2986
          },
          {
            "draft_status": "published",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/241753/hls24_1654244681.m3u8",
            "name": "Pepper Is Essential",
            "promotion": "full",
            "is_shoppable": false,
            "created_at": 1654244697,
            "description": "One of the most over looked ingredients in food is pepper. Pepper gives your food that extra kick! So here are some tasty recipes, that are incomplete without pepper! Try out our <a href=\"https://tasty.co/recipe/crunchy-salt-and-pepper-shrimp\">salt and pepper shrimp</a>,<a href=\"https://tasty.co/recipe/one-pot-lemon-pepper-chicken-rice\">lemon pepper chicken rice </a> and more to know exactly what we are talking about!",
            "buzz_id": null,
            "aspect_ratio": "1:1",
            "facebook_posts": [],
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/381275.jpg",
            "id": 3201,
            "beauty_url": null,
            "slug": "pepper-is-essential",
            "video_id": 159060,
            "country": "US",
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "approved_at": 1655129570,
            "canonical_id": "compilation:3201"
          }
        ],
        "show": {
          "name": "Tasty",
          "id": 17
        },
        "beauty_url": null,
        "buzz_id": null,
        "video_ad_content": "none",
        "promotion": "full",
        "country": "US",
        "servings_noun_singular": "serving",
        "nutrition": {
          "calories": 862,
          "sugar": 22,
          "carbohydrates": 82,
          "fiber": 16,
          "updated_at": "2023-04-25T08:05:18+02:00",
          "protein": 57,
          "fat": 33
        },
        "is_one_top": false,
        "seo_title": null,
        "canonical_id": "recipe:3289",
        "cook_time_minutes": 32,
        "price": {
          "total": 1800,
          "updated_at": "2023-09-13T07:07:07+02:00",
          "portion": 450,
          "consumption_total": 1750,
          "consumption_portion": 450
        },
        "slug": "one-pot-chicken-fajita-pasta",
        "credits": [
          {
            "type": "internal",
            "name": null
          }
        ],
        "topics": [
          {
            "name": "Easy Dinner",
            "slug": "easy-dinner"
          },
          {
            "name": "One-Pot Recipes",
            "slug": "one-pot"
          },
          {
            "name": "Romantic Dinners",
            "slug": "romantic-dinners"
          },
          {
            "name": "Dinner",
            "slug": "dinner"
          },
          {
            "name": "Pasta",
            "slug": "pasta"
          },
          {
            "name": "American",
            "slug": "american"
          }
        ],
        "keywords": null,
        "user_ratings": {
          "count_negative": 1106,
          "count_positive": 11563,
          "score": 0.9127
        },
        "description": "Ever wanted the full fixings of a fajita in pasta form? These toppings make for a well-seasoned and well-balanced one-dish dinner! ",
        "renditions": [
          {
            "container": "mp4",
            "bit_rate": 3088,
            "minimum_bit_rate": null,
            "name": "mp4_720x720",
            "maximum_bit_rate": null,
            "width": 720,
            "height": 720,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/71475/square_720/1515192538_00001.png",
            "file_size": 19835631,
            "url": "https://vid.tasty.co/output/71475/square_720/1515192538",
            "duration": 51396,
            "content_type": "video/mp4",
            "aspect": "square"
          },
          {
            "minimum_bit_rate": null,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/71475/square_320/1515192538_00001.png",
            "file_size": 6408150,
            "duration": 51396,
            "bit_rate": 998,
            "width": 320,
            "maximum_bit_rate": null,
            "height": 320,
            "container": "mp4",
            "url": "https://vid.tasty.co/output/71475/square_320/1515192538",
            "content_type": "video/mp4",
            "aspect": "square",
            "name": "mp4_320x320"
          },
          {
            "width": 720,
            "name": "mp4_720x720",
            "maximum_bit_rate": null,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/71475/square_720/1515192538_00001.png",
            "file_size": 19835631,
            "url": "https://vid.tasty.co/output/71475/square_720/1515192538",
            "duration": 51396,
            "content_type": "video/mp4",
            "height": 720,
            "container": "mp4",
            "bit_rate": 3088,
            "aspect": "square",
            "minimum_bit_rate": null
          },
          {
            "duration": 51396,
            "bit_rate": 998,
            "name": "mp4_320x320",
            "height": 320,
            "container": "mp4",
            "file_size": 6408150,
            "content_type": "video/mp4",
            "aspect": "square",
            "width": 320,
            "minimum_bit_rate": null,
            "maximum_bit_rate": null,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/71475/square_320/1515192538_00001.png",
            "url": "https://vid.tasty.co/output/71475/square_320/1515192538"
          },
          {
            "duration": 51396,
            "width": 720,
            "height": 720,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/71475/landscape_720/1515192538_00001.png",
            "file_size": 19866977,
            "url": "https://vid.tasty.co/output/71475/landscape_720/1515192538",
            "bit_rate": 3093,
            "content_type": "video/mp4",
            "aspect": "square",
            "minimum_bit_rate": null,
            "name": "mp4_720x720",
            "maximum_bit_rate": null
          },
          {
            "url": "https://vid.tasty.co/output/71475/landscape_480/1515192538",
            "content_type": "video/mp4",
            "aspect": "square",
            "minimum_bit_rate": null,
            "height": 480,
            "name": "mp4_480x480",
            "maximum_bit_rate": null,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/71475/landscape_480/1515192538_00001.png",
            "file_size": 11227934,
            "duration": 51396,
            "bit_rate": 1748,
            "width": 480
          },
          {
            "duration": 51343,
            "bit_rate": null,
            "content_type": "application/vnd.apple.mpegurl",
            "minimum_bit_rate": 278,
            "name": "low",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/71475/1445289064805-h2exzu/1515192538_00001.png",
            "file_size": null,
            "url": "https://vid.tasty.co/output/71475/hls24_1515192538.m3u8",
            "maximum_bit_rate": 5422,
            "height": 1080,
            "container": "ts",
            "aspect": "square",
            "width": 1080
          },
          {
            "height": 720,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/71475/landscape_720/1515192538_00001.png",
            "file_size": 19866977,
            "duration": 51396,
            "bit_rate": 3093,
            "width": 720,
            "url": "https://vid.tasty.co/output/71475/landscape_720/1515192538",
            "content_type": "video/mp4",
            "aspect": "square",
            "minimum_bit_rate": null,
            "name": "mp4_720x720",
            "maximum_bit_rate": null
          },
          {
            "name": "mp4_480x480",
            "height": 480,
            "container": "mp4",
            "file_size": 11227934,
            "url": "https://vid.tasty.co/output/71475/landscape_480/1515192538",
            "content_type": "video/mp4",
            "aspect": "square",
            "minimum_bit_rate": null,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/71475/landscape_480/1515192538_00001.png",
            "duration": 51396,
            "bit_rate": 1748,
            "width": 480,
            "maximum_bit_rate": null
          },
          {
            "file_size": null,
            "content_type": "application/vnd.apple.mpegurl",
            "width": 1080,
            "container": "ts",
            "url": "https://vid.tasty.co/output/71475/hls24_1515192538.m3u8",
            "duration": 51343,
            "bit_rate": null,
            "aspect": "square",
            "minimum_bit_rate": 278,
            "name": "low",
            "maximum_bit_rate": 5422,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/71475/1445289064805-h2exzu/1515192538_00001.png",
            "height": 1080
          }
        ],
        "total_time_tier": {
          "tier": "under_1_hour",
          "display_tier": "Under 1 hour"
        },
        "video_id": 43566,
        "instructions": [
          {
            "temperature": 400,
            "id": 27839,
            "position": 1,
            "display_text": "Heat the oil in a large pot over high heat.",
            "start_time": 0,
            "appliance": "stovetop",
            "end_time": 0
          },
          {
            "start_time": 0,
            "appliance": null,
            "end_time": 4800,
            "temperature": null,
            "id": 27840,
            "position": 2,
            "display_text": "Add the chicken and cook until no longer pink, 5-6 minutes, then remove from the pot."
          },
          {
            "start_time": 4966,
            "appliance": null,
            "end_time": 15266,
            "temperature": null,
            "id": 27841,
            "position": 3,
            "display_text": "Add the bell peppers and onion and cook until the onion is translucent, about 6 minutes."
          },
          {
            "start_time": 15433,
            "appliance": null,
            "end_time": 28900,
            "temperature": null,
            "id": 27842,
            "position": 4,
            "display_text": "Add the chicken back to the pot, along with the salt, pepper, chili powder, cumin, and garlic powder, and stir until evenly coated, about 30 seconds."
          },
          {
            "id": 27843,
            "position": 5,
            "display_text": "Add the milk and the penne, stirring constantly to prevent the pasta from sticking.",
            "start_time": 29400,
            "appliance": "stovetop",
            "end_time": 37366,
            "temperature": 350
          },
          {
            "position": 6,
            "display_text": "Cook for about 20 minutes, until pasta is tender and the milk has reduced to a thick sauce that coats the pasta.",
            "start_time": 0,
            "appliance": null,
            "end_time": 0,
            "temperature": null,
            "id": 27844
          },
          {
            "appliance": "stovetop",
            "end_time": 42333,
            "temperature": 80,
            "id": 27845,
            "position": 7,
            "display_text": "Add the cheese and mix until melted.",
            "start_time": 37700
          },
          {
            "start_time": 44333,
            "appliance": null,
            "end_time": 49133,
            "temperature": null,
            "id": 27846,
            "position": 8,
            "display_text": "Enjoy!"
          }
        ],
        "draft_status": "published",
        "updated_at": 1692117864,
        "sections": [
          {
            "position": 1,
            "components": [
              {
                "raw_text": "3 tablespoons oil",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035091,
                  "name": "neutral oil",
                  "created_at": 1506802368,
                  "display_plural": "neutral oils",
                  "id": 3049,
                  "display_singular": "neutral oil"
                },
                "id": 31642,
                "position": 1,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "3",
                    "id": 731767
                  }
                ]
              },
              {
                "raw_text": "3 chicken breasts, sliced",
                "extra_comment": "sliced",
                "ingredient": {
                  "id": 50,
                  "display_singular": "chicken breast",
                  "updated_at": 1509035286,
                  "name": "chicken breast",
                  "created_at": 1493430237,
                  "display_plural": "chicken breasts"
                },
                "id": 31643,
                "position": 2,
                "measurements": [
                  {
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    },
                    "quantity": "3",
                    "id": 731765
                  }
                ]
              },
              {
                "raw_text": "1 red bell pepper, sliced",
                "extra_comment": "sliced",
                "ingredient": {
                  "updated_at": 1509035277,
                  "name": "red bell pepper",
                  "created_at": 1494292131,
                  "display_plural": "red bell peppers",
                  "id": 227,
                  "display_singular": "red bell pepper"
                },
                "id": 31644,
                "position": 3,
                "measurements": [
                  {
                    "id": 731766,
                    "unit": {
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": "",
                      "system": "none",
                      "name": ""
                    },
                    "quantity": "1"
                  }
                ]
              },
              {
                "id": 31645,
                "position": 4,
                "measurements": [
                  {
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    },
                    "quantity": "1",
                    "id": 731768
                  }
                ],
                "raw_text": "1 green bell pepper, sliced",
                "extra_comment": "sliced",
                "ingredient": {
                  "id": 228,
                  "display_singular": "green bell pepper",
                  "updated_at": 1509035277,
                  "name": "green bell pepper",
                  "created_at": 1494292187,
                  "display_plural": "green bell peppers"
                }
              },
              {
                "raw_text": "1 yellow bell pepper, sliced",
                "extra_comment": "sliced",
                "ingredient": {
                  "name": "yellow bell pepper",
                  "created_at": 1494292208,
                  "display_plural": "yellow bell peppers",
                  "id": 229,
                  "display_singular": "yellow bell pepper",
                  "updated_at": 1509035277
                },
                "id": 31646,
                "position": 5,
                "measurements": [
                  {
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    },
                    "quantity": "1",
                    "id": 731779
                  }
                ]
              },
              {
                "raw_text": "1 onion, sliced",
                "extra_comment": "sliced",
                "ingredient": {
                  "id": 243,
                  "display_singular": "yellow onion",
                  "updated_at": 1509035276,
                  "name": "yellow onion",
                  "created_at": 1494297033,
                  "display_plural": "yellow onions"
                },
                "id": 31647,
                "position": 6,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "",
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": ""
                    },
                    "quantity": "1",
                    "id": 731778
                  }
                ]
              },
              {
                "id": 31648,
                "position": 7,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "tsp",
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon"
                    },
                    "quantity": "1",
                    "id": 731776
                  }
                ],
                "raw_text": "1 teaspoon salt",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035289,
                  "name": "kosher salt",
                  "created_at": 1493307153,
                  "display_plural": "kosher salts",
                  "id": 11,
                  "display_singular": "kosher salt"
                }
              },
              {
                "id": 31649,
                "position": 8,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp"
                    },
                    "quantity": "1",
                    "id": 731777
                  }
                ],
                "raw_text": "1 teaspoon pepper",
                "extra_comment": "",
                "ingredient": {
                  "display_plural": "freshly ground black peppers",
                  "id": 166,
                  "display_singular": "freshly ground black pepper",
                  "updated_at": 1509035282,
                  "name": "freshly ground black pepper",
                  "created_at": 1493925438
                }
              },
              {
                "id": 31650,
                "position": 9,
                "measurements": [
                  {
                    "unit": {
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp",
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons"
                    },
                    "quantity": "1",
                    "id": 731773
                  }
                ],
                "raw_text": "1 tablespoon chili powder",
                "extra_comment": "",
                "ingredient": {
                  "created_at": 1493307101,
                  "display_plural": "chili powders",
                  "id": 7,
                  "display_singular": "chili powder",
                  "updated_at": 1509035289,
                  "name": "chili powder"
                }
              },
              {
                "raw_text": "1 tablespoon cumin",
                "extra_comment": "",
                "ingredient": {
                  "name": "cumin",
                  "created_at": 1493906367,
                  "display_plural": "cumins",
                  "id": 151,
                  "display_singular": "cumin",
                  "updated_at": 1509035283
                },
                "id": 31651,
                "position": 10,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "1",
                    "id": 731772
                  }
                ]
              },
              {
                "ingredient": {
                  "updated_at": 1509035289,
                  "name": "garlic powder",
                  "created_at": 1493307128,
                  "display_plural": "garlic powders",
                  "id": 9,
                  "display_singular": "garlic powder"
                },
                "id": 31652,
                "position": 11,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "tbsp",
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon"
                    },
                    "quantity": "1",
                    "id": 731771
                  }
                ],
                "raw_text": "1 tablespoon garlic powder",
                "extra_comment": ""
              },
              {
                "ingredient": {
                  "display_singular": "milk",
                  "updated_at": 1509035288,
                  "name": "milk",
                  "created_at": 1493314636,
                  "display_plural": "milks",
                  "id": 21
                },
                "id": 31653,
                "position": 12,
                "measurements": [
                  {
                    "unit": {
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups"
                    },
                    "quantity": "5",
                    "id": 731775
                  },
                  {
                    "unit": {
                      "system": "metric",
                      "name": "liter",
                      "display_plural": "L",
                      "display_singular": "L",
                      "abbreviation": "L"
                    },
                    "quantity": "1 ¼",
                    "id": 731774
                  }
                ],
                "raw_text": "5 cups milk",
                "extra_comment": ""
              },
              {
                "position": 13,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup"
                    },
                    "quantity": "4",
                    "id": 731781
                  },
                  {
                    "id": 731780,
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "400"
                  }
                ],
                "raw_text": "4 cups penne pasta",
                "extra_comment": "",
                "ingredient": {
                  "display_plural": "penne pastas",
                  "id": 303,
                  "display_singular": "penne pasta",
                  "updated_at": 1509035271,
                  "name": "penne pasta",
                  "created_at": 1494811670
                },
                "id": 31654
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "1",
                    "id": 731770
                  },
                  {
                    "unit": {
                      "display_singular": "g",
                      "abbreviation": "g",
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g"
                    },
                    "quantity": "100",
                    "id": 731769
                  }
                ],
                "raw_text": "1 cup pepper jack cheese, shredded",
                "extra_comment": "shredded",
                "ingredient": {
                  "updated_at": 1509569778,
                  "name": "pepper jack cheese",
                  "created_at": 1497619885,
                  "display_plural": "pepper jack cheeses",
                  "id": 1867,
                  "display_singular": "pepper jack cheese"
                },
                "id": 31655,
                "position": 14
              }
            ],
            "name": null
          }
        ],
        "tags": [
          {
            "type": "cuisine",
            "root_tag_type": "cuisine",
            "name": "north_american",
            "id": 64444,
            "display_name": "North American"
          },
          {
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "comfort_food",
            "id": 64462,
            "display_name": "Comfort Food"
          },
          {
            "root_tag_type": "difficulty",
            "name": "easy",
            "id": 64471,
            "display_name": "Easy",
            "type": "difficulty"
          },
          {
            "id": 64486,
            "display_name": "Dinner",
            "type": "meal",
            "root_tag_type": "meal",
            "name": "dinner"
          },
          {
            "type": "dinner",
            "root_tag_type": "meal",
            "name": "weeknight",
            "id": 64505,
            "display_name": "Weeknight"
          },
          {
            "display_name": "Fusion",
            "type": "cuisine",
            "root_tag_type": "cuisine",
            "name": "fusion",
            "id": 65410
          },
          {
            "root_tag_type": "appliance",
            "name": "stove_top",
            "id": 65848,
            "display_name": "Stove Top",
            "type": "appliance"
          },
          {
            "display_name": "One-Pot or Pan",
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "one_pot_or_pan",
            "id": 65855
          },
          {
            "name": "pan_fry",
            "id": 65859,
            "display_name": "Pan Fry",
            "type": "cooking_style",
            "root_tag_type": "cooking_style"
          },
          {
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "oven_mitts",
            "id": 1247775,
            "display_name": "Oven Mitts"
          },
          {
            "root_tag_type": "equipment",
            "name": "pyrex",
            "id": 1247785,
            "display_name": "Pyrex",
            "type": "equipment"
          },
          {
            "name": "sauce_pan",
            "id": 1247786,
            "display_name": "Sauce Pan",
            "type": "equipment",
            "root_tag_type": "equipment"
          },
          {
            "name": "wooden_spoon",
            "id": 1247794,
            "display_name": "Wooden Spoon",
            "type": "equipment",
            "root_tag_type": "equipment"
          },
          {
            "display_name": "Chef's Knife",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "chefs_knife",
            "id": 1280501
          },
          {
            "root_tag_type": "equipment",
            "name": "cutting_board",
            "id": 1280503,
            "display_name": "Cutting Board",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "dry_measuring_cups",
            "id": 1280507,
            "display_name": "Dry Measuring Cups",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "measuring_spoons",
            "id": 1280508,
            "display_name": "Measuring Spoons",
            "type": "equipment"
          },
          {
            "root_tag_type": "business_tags",
            "name": "one_top_friendly",
            "id": 1691103,
            "display_name": "One Top Friendly",
            "type": "business_tags"
          },
          {
            "root_tag_type": "business_tags",
            "name": "mccormick_easy_dinner",
            "id": 5143247,
            "display_name": "McCormick Easy Dinner",
            "type": "business_tags"
          },
          {
            "root_tag_type": "feature_page",
            "name": "mccormick_ugc_one_pot_pasta",
            "id": 6986105,
            "display_name": "McCormick UGC One Pot Pasta",
            "type": "feature_page"
          },
          {
            "root_tag_type": "feature_page",
            "name": "shoppable_recipes_family_dinner",
            "id": 7336056,
            "display_name": "Shoppable Recipes Family Dinner",
            "type": "feature_page"
          },
          {
            "display_name": "Under 1 Hour",
            "type": "difficulty",
            "root_tag_type": "difficulty",
            "name": "under_1_hour",
            "id": 8091748
          },
          {
            "name": "high_protein",
            "id": 8091917,
            "display_name": "High-Protein",
            "type": "healthy",
            "root_tag_type": "healthy"
          },
          {
            "display_name": "High-Fiber",
            "type": "healthy",
            "root_tag_type": "healthy",
            "name": "high_fiber",
            "id": 8091920
          },
          {
            "root_tag_type": "seasonal",
            "name": "seasonal",
            "id": 9295812,
            "display_name": "Seasonal",
            "type": "seasonal"
          },
          {
            "display_name": "Southwestern",
            "type": "north_american",
            "root_tag_type": "cuisine",
            "name": "southwestern",
            "id": 9299355
          },
          {
            "root_tag_type": "meal",
            "name": "chicken",
            "id": 9299514,
            "display_name": "Chicken",
            "type": "dinner"
          },
          {
            "root_tag_type": "meal",
            "name": "pasta",
            "id": 9299522,
            "display_name": "Pasta",
            "type": "dinner"
          }
        ],
        "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/128650.jpg",
        "total_time_minutes": 52,
        "nutrition_visibility": "auto",
        "id": 3289,
        "prep_time_minutes": 20,
        "brand": null,
        "brand_id": null,
        "num_servings": 4,
        "inspired_by_url": null,
        "video_url": "https://vid.tasty.co/output/71475/hls24_1515192538.m3u8",
        "facebook_posts": [],
        "language": "eng",
        "seo_path": "9295813,64486,9299514",
        "original_video_url": "https://s3.amazonaws.com/video-api-prod/assets/aef4973b1c2f4a7198693ceb54408051/BFV9608_OnePotChickenFajitaPasta-SQFacebook.mp4"
      },
      {
        "slug": "original-orange-chicken-by-panda-express",
        "buzz_id": 4733167,
        "show": {
          "name": "Tasty",
          "id": 17
        },
        "inspired_by_url": null,
        "total_time_tier": {
          "tier": "under_1.5_hours",
          "display_tier": "Under 1.5 hours"
        },
        "promotion": "full",
        "seo_path": "8757513,9295873,64448",
        "brand": null,
        "yields": "Servings: 8",
        "thumbnail_alt_text": "",
        "beauty_url": "https://img.buzzfeed.com/video-api-prod/assets/31ea3c4bf2134c5f9db08edd13eaad1c/beauty.jpg",
        "user_ratings": {
          "count_positive": 7683,
          "score": 0.955241,
          "count_negative": 360
        },
        "servings_noun_singular": "serving",
        "tags": [
          {
            "id": 64448,
            "display_name": "Chinese",
            "type": "asian",
            "root_tag_type": "cuisine",
            "name": "chinese"
          },
          {
            "root_tag_type": "cooking_style",
            "name": "comfort_food",
            "id": 64462,
            "display_name": "Comfort Food",
            "type": "cooking_style"
          },
          {
            "root_tag_type": "dietary",
            "name": "dairy_free",
            "id": 64463,
            "display_name": "Dairy-Free",
            "type": "dietary"
          },
          {
            "id": 64486,
            "display_name": "Dinner",
            "type": "meal",
            "root_tag_type": "meal",
            "name": "dinner"
          },
          {
            "root_tag_type": "cooking_style",
            "name": "kid_friendly",
            "id": 64488,
            "display_name": "Kid-Friendly",
            "type": "cooking_style"
          },
          {
            "id": 64493,
            "display_name": "Deep-Fry",
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "deep_fry"
          },
          {
            "type": "occasion",
            "root_tag_type": "seasonal",
            "name": "party",
            "id": 64503,
            "display_name": "Party"
          },
          {
            "display_name": "Stove Top",
            "type": "appliance",
            "root_tag_type": "appliance",
            "name": "stove_top",
            "id": 65848
          },
          {
            "display_name": "Wok",
            "type": "appliance",
            "root_tag_type": "appliance",
            "name": "wok",
            "id": 65849
          },
          {
            "name": "big_batch",
            "id": 65851,
            "display_name": "Big Batch",
            "type": "cooking_style",
            "root_tag_type": "cooking_style"
          },
          {
            "name": "pan_fry",
            "id": 65859,
            "display_name": "Pan Fry",
            "type": "cooking_style",
            "root_tag_type": "cooking_style"
          },
          {
            "root_tag_type": "seasonal",
            "name": "special_occasion",
            "id": 188967,
            "display_name": "Special Occasion",
            "type": "occasion"
          },
          {
            "root_tag_type": "equipment",
            "name": "paper_napkins",
            "id": 1247778,
            "display_name": "Paper Napkins",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "parchment_paper",
            "id": 1247780,
            "display_name": "Parchment Paper",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "plastic_wrap",
            "id": 1247784,
            "display_name": "Plastic Wrap",
            "type": "equipment"
          },
          {
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "wooden_spoon",
            "id": 1247794,
            "display_name": "Wooden Spoon"
          },
          {
            "root_tag_type": "equipment",
            "name": "chefs_knife",
            "id": 1280501,
            "display_name": "Chef's Knife",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "cutting_board",
            "id": 1280503,
            "display_name": "Cutting Board",
            "type": "equipment"
          },
          {
            "id": 1280514,
            "display_name": "Spider",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "spider"
          },
          {
            "root_tag_type": "cuisine",
            "name": "asian",
            "id": 9295873,
            "display_name": "Asian",
            "type": "cuisine"
          },
          {
            "type": "dinner",
            "root_tag_type": "meal",
            "name": "chicken",
            "id": 9299514,
            "display_name": "Chicken"
          }
        ],
        "tips_and_ratings_enabled": true,
        "original_video_url": "https://s3.amazonaws.com/video-api-prod/assets/1b781eba0a734a0bab9bed9a79672be1/BFV34171OriginalOrangeChickenbyPandaExpressFB.mp4",
        "facebook_posts": [],
        "language": "eng",
        "name": "Original Orange Chicken by Panda Express ",
        "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/131902.jpg",
        "total_time_minutes": 65,
        "is_shoppable": true,
        "video_ad_content": "none",
        "video_id": 39580,
        "country": "US",
        "prep_time_minutes": 20,
        "show_id": 17,
        "num_servings": 8,
        "created_at": 1516716120,
        "draft_status": "published",
        "video_url": "https://vid.tasty.co/output/74275/hls24_1516728642.m3u8",
        "approved_at": 1519774180,
        "price": {
          "total": 2150,
          "updated_at": "2023-09-13T07:06:12+02:00",
          "portion": 250,
          "consumption_total": 750,
          "consumption_portion": 100
        },
        "id": 3383,
        "seo_title": "Panda Express Orange Chicken | Tasty",
        "canonical_id": "recipe:3383",
        "renditions": [
          {
            "duration": 174980,
            "bit_rate": 2349,
            "content_type": "video/mp4",
            "width": 720,
            "minimum_bit_rate": null,
            "name": "mp4_720x720",
            "file_size": 51370910,
            "url": "https://vid.tasty.co/output/74275/square_720/1516728642",
            "height": 720,
            "aspect": "square",
            "maximum_bit_rate": null,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/74275/square_720/1516728642_00001.png"
          },
          {
            "file_size": 16788322,
            "duration": 174980,
            "bit_rate": 768,
            "aspect": "square",
            "width": 320,
            "maximum_bit_rate": null,
            "height": 320,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/74275/square_320/1516728642_00001.png",
            "url": "https://vid.tasty.co/output/74275/square_320/1516728642",
            "content_type": "video/mp4",
            "minimum_bit_rate": null,
            "name": "mp4_320x320"
          },
          {
            "name": "mp4_720x720",
            "container": "mp4",
            "file_size": 51386266,
            "duration": 174980,
            "bit_rate": 2350,
            "minimum_bit_rate": null,
            "maximum_bit_rate": null,
            "height": 720,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/74275/landscape_720/1516728642_00001.png",
            "url": "https://vid.tasty.co/output/74275/landscape_720/1516728642",
            "content_type": "video/mp4",
            "aspect": "square",
            "width": 720
          },
          {
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/74275/landscape_480/1516728642_00001.png",
            "file_size": 28963279,
            "bit_rate": 1325,
            "aspect": "square",
            "minimum_bit_rate": null,
            "height": 480,
            "container": "mp4",
            "duration": 174980,
            "content_type": "video/mp4",
            "width": 480,
            "name": "mp4_480x480",
            "maximum_bit_rate": null,
            "url": "https://vid.tasty.co/output/74275/landscape_480/1516728642"
          },
          {
            "content_type": "application/vnd.apple.mpegurl",
            "aspect": "square",
            "minimum_bit_rate": 276,
            "duration": 174976,
            "bit_rate": null,
            "file_size": null,
            "url": "https://vid.tasty.co/output/74275/hls24_1516728642.m3u8",
            "width": 1080,
            "name": "low",
            "maximum_bit_rate": 4421,
            "height": 1080,
            "container": "ts",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/74275/1445289064805-h2exzu/1516728642_00001.png"
          }
        ],
        "topics": [
          {
            "name": "Kid Friendly",
            "slug": "kid-friendly"
          },
          {
            "name": "Romantic Dinners",
            "slug": "romantic-dinners"
          },
          {
            "name": "Dinner",
            "slug": "dinner"
          },
          {
            "name": "Chinese",
            "slug": "chinese"
          }
        ],
        "servings_noun_plural": "servings",
        "instructions": [
          {
            "temperature": null,
            "id": 28652,
            "position": 1,
            "display_text": "On a cutting board, cut chicken into 1x1-inch (2x2-cm) cubes and set aside.",
            "start_time": 8000,
            "appliance": null,
            "end_time": 20166
          },
          {
            "appliance": null,
            "end_time": 41166,
            "temperature": null,
            "id": 28653,
            "position": 2,
            "display_text": "In a medium mixing bowl, combine salt, white pepper, cornstarch, and flour. Whisk to combine.",
            "start_time": 28166
          },
          {
            "id": 28654,
            "position": 3,
            "display_text": "Add the egg, water, and oil until it reaches the consistency of pancake batter.",
            "start_time": 41666,
            "appliance": null,
            "end_time": 58660,
            "temperature": null
          },
          {
            "end_time": 73000,
            "temperature": null,
            "id": 28655,
            "position": 4,
            "display_text": "Add the chicken to the batter and refrigerate at least 30 minutes.",
            "start_time": 59333,
            "appliance": null
          },
          {
            "id": 28656,
            "position": 5,
            "display_text": "Heat oil in a wok or heavy bottom pan to 350˚F (180˚C).",
            "start_time": 0,
            "appliance": "food_thermometer",
            "end_time": 0,
            "temperature": 350
          },
          {
            "position": 6,
            "display_text": "Gently add the chicken and cook for 5-6 minutes until lightly golden brown.",
            "start_time": 76833,
            "appliance": null,
            "end_time": 87166,
            "temperature": null,
            "id": 28657
          },
          {
            "id": 28658,
            "position": 7,
            "display_text": "Remove the chicken from the pan and transfer to a paper towel-lined plate.",
            "start_time": 87000,
            "appliance": null,
            "end_time": 93166,
            "temperature": null
          },
          {
            "appliance": "stovetop",
            "end_time": 0,
            "temperature": 350,
            "id": 28659,
            "position": 8,
            "display_text": "Set a heavy bottomed pot over medium- high heat and add the oil.",
            "start_time": 0
          },
          {
            "start_time": 95500,
            "appliance": null,
            "end_time": 105500,
            "temperature": null,
            "id": 28660,
            "position": 9,
            "display_text": "Once the oil begins to shimmer, add the red pepper flakes, ginger, and garlic, and cook for 30 seconds, stirring constantly."
          },
          {
            "temperature": null,
            "id": 28661,
            "position": 10,
            "display_text": "Add the sugar and brown sugar, and stir to combine.",
            "start_time": 106000,
            "appliance": null,
            "end_time": 111000
          },
          {
            "appliance": null,
            "end_time": 113500,
            "temperature": null,
            "id": 28662,
            "position": 11,
            "display_text": "Add in the orange juice and allow the sugars to begin to dissolve in the liquid, stirring occasionally.",
            "start_time": 111333
          },
          {
            "temperature": null,
            "id": 28663,
            "position": 12,
            "display_text": "Add in the vinegar and soy sauce, and stir to combine.",
            "start_time": 114000,
            "appliance": null,
            "end_time": 120666
          },
          {
            "start_time": 121000,
            "appliance": null,
            "end_time": 131166,
            "temperature": null,
            "id": 28664,
            "position": 13,
            "display_text": "Add the cornstarch and water together and whisk to combine. Add to the pan and stir."
          },
          {
            "appliance": null,
            "end_time": 134166,
            "temperature": null,
            "id": 28665,
            "position": 14,
            "display_text": "Continue to cook the sauce until maple syrup consistency is achieved.",
            "start_time": 131167
          },
          {
            "start_time": 134166,
            "appliance": null,
            "end_time": 142666,
            "temperature": null,
            "id": 28666,
            "position": 15,
            "display_text": "Add in the fried chicken and stir until completely coated in the sauce."
          },
          {
            "display_text": "Top with sesame oil.",
            "start_time": 142333,
            "appliance": null,
            "end_time": 148833,
            "temperature": null,
            "id": 28667,
            "position": 16
          },
          {
            "id": 28668,
            "position": 17,
            "display_text": "Enjoy!",
            "start_time": 150000,
            "appliance": null,
            "end_time": 168000,
            "temperature": null
          }
        ],
        "is_one_top": false,
        "compilations": [
          {
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "thumbnail_alt_text": "",
            "name": "Try These Mouth-Watering Recipes Chinese Takeout Recipes At Home",
            "canonical_id": "compilation:2269",
            "aspect_ratio": "1:1",
            "country": "US",
            "beauty_url": null,
            "buzz_id": null,
            "slug": "try-these-mouth-watering-recipes-chinese-takeout-recipes-at-home",
            "promotion": "full",
            "video_id": 127989,
            "draft_status": "published",
            "language": "eng",
            "created_at": 1617201810,
            "description": "What if we told you that you don't need to leave the comfort of home to enjoy some amazing Chinese takeout? We’ve curated some of the best takeout recipes which not only taste delicious, but require very little prep time. Start with the crispy <a href=\"https://tasty.co/recipe/chicken-veggie-spring-rolls\">Chicken Veggie Spring Rolls</a> and work your way up to a <a href=\"https://tasty.co/recipe/original-orange-chicken-by-panda-express\">Orange Chicken</a> with steamed rice which are often perfect for dinners. Sit back and enjoy your Chinese takeout meal with your favorite Netflix rerun: we won't judge, in fact, we're going to do the same thing!",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/315188.jpg",
            "approved_at": 1618319136,
            "id": 2269,
            "keywords": null,
            "facebook_posts": [],
            "video_url": "https://vid.tasty.co/output/198272/hls24_1617202294.m3u8"
          },
          {
            "description": "If you're a fan of citrusy and tangy orange flavor, let us introduce you to this lineup of orange-centric dishes that'll satisfy your cravings at home. <a href=\"https://tasty.co/recipe/sesame-salmon-with-orange-slaw\">Sesame Salmon with Orange Slaw</a> is so incredibly satisfying, as are these <a href=\"https://tasty.co/recipe/jazzy-orange-glazed-drumsticks\">Orange-Glazed Drumsticks</a>, or try everyone's favorite, <a href=\"https://tasty.co/recipe/original-orange-chicken-by-panda-express\"> Orange Chicken by Panda Express</a>.",
            "buzz_id": null,
            "country": "US",
            "language": "eng",
            "canonical_id": "compilation:3319",
            "beauty_url": null,
            "thumbnail_url": "https://s3.amazonaws.com/video-api-prod/assets/a017d949bc3649eb8d7c765de59dfc05/final_thumb.jpg",
            "approved_at": 1667498840,
            "slug": "zesty-orange-recipes",
            "aspect_ratio": "1:1",
            "keywords": null,
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "draft_status": "published",
            "promotion": "full",
            "video_id": 168878,
            "id": 3319,
            "is_shoppable": false,
            "created_at": 1663824809,
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/254911/hls24_1663771349.m3u8",
            "name": "Zesty Orange Recipes"
          },
          {
            "is_shoppable": false,
            "created_at": 1668765961,
            "description": "End the year with a culinary big bang! 2022 is coming to an end, but your nights shouldn't without tasting these delicious recipes. We have got <a href=\"https://tasty.co/recipe/baked-lobster-tails\">Baked Lobster Tails</a>, <a href=\"https://tasty.co/recipe/creamy-tuscan-chicken\">Creamy Tuscan Chicken</a>, <a href=\"https://tasty.co/recipe/korean-style-bbq-beef\">Korean-Style BBQ Beef</a>, or a <a href=\"https://tasty.co/recipe/20-minute-one-pan-pizza\">20-Minute One-Pan Pizza</a> to cover all of your cravings. Are you convinced or should we go on?",
            "canonical_id": "compilation:3370",
            "id": 3370,
            "promotion": "full",
            "aspect_ratio": "1:1",
            "country": "US",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "language": "eng",
            "video_url": "https://vid.tasty.co/output/264409/hls24_1669870722.m3u8",
            "name": "Tasty Dinners for Every Night of December",
            "buzz_id": null,
            "video_id": 174237,
            "keywords": null,
            "facebook_posts": [],
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/411506.jpg",
            "thumbnail_alt_text": "",
            "approved_at": 1670358181,
            "beauty_url": null,
            "draft_status": "published",
            "slug": "tasty-dinner-for-every-night-of-december"
          }
        ],
        "description": "Why order takeout when you can make your own orange chicken at home? This recipe features crispy chicken coated in a zesty orange sauce, and it's easy to make in your own kitchen!",
        "nutrition_visibility": "auto",
        "brand_id": null,
        "nutrition": {},
        "aspect_ratio": "1:1",
        "updated_at": 1692117803,
        "credits": [
          {
            "name": "Pierce Abernathy",
            "type": "internal"
          }
        ],
        "cook_time_minutes": 15,
        "keywords": "chicken, chicken thighs, chinese, chinese cuisine, chinese food, fried chicken, glaze, jimmy wang, orange, orange chicken, original orange chicken, panda, panda express, soy",
        "sections": [
          {
            "components": [
              {
                "raw_text": "2 pounds boneless, skinless, chicken thighs",
                "extra_comment": "",
                "ingredient": {
                  "display_plural": "boneless, skinless chicken thighs",
                  "id": 373,
                  "display_singular": "boneless, skinless chicken thigh",
                  "updated_at": 1521648462,
                  "name": "boneless, skinless chicken thighs",
                  "created_at": 1494975805
                },
                "id": 32713,
                "position": 2,
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "905",
                    "id": 644881
                  },
                  {
                    "unit": {
                      "display_singular": "lb",
                      "abbreviation": "lb",
                      "system": "imperial",
                      "name": "pound",
                      "display_plural": "lb"
                    },
                    "quantity": "2",
                    "id": 644878
                  }
                ]
              },
              {
                "ingredient": {
                  "display_plural": "salts",
                  "id": 22,
                  "display_singular": "salt",
                  "updated_at": 1509035288,
                  "name": "salt",
                  "created_at": 1493314644
                },
                "id": 32714,
                "position": 3,
                "measurements": [
                  {
                    "id": 644893,
                    "unit": {
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp",
                      "system": "imperial"
                    },
                    "quantity": "1"
                  }
                ],
                "raw_text": "1 tablespoon salt",
                "extra_comment": ""
              },
              {
                "extra_comment": "",
                "ingredient": {
                  "created_at": 1495072733,
                  "display_plural": "white peppers",
                  "id": 446,
                  "display_singular": "white pepper",
                  "updated_at": 1509035260,
                  "name": "white pepper"
                },
                "id": 32715,
                "position": 4,
                "measurements": [
                  {
                    "quantity": "1",
                    "id": 644889,
                    "unit": {
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp",
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons"
                    }
                  }
                ],
                "raw_text": "1 teaspoon white pepper"
              },
              {
                "ingredient": {
                  "display_plural": "cornstarches",
                  "id": 488,
                  "display_singular": "cornstarch",
                  "updated_at": 1509035256,
                  "name": "cornstarch",
                  "created_at": 1495141711
                },
                "id": 32716,
                "position": 5,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "g",
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g"
                    },
                    "quantity": "125",
                    "id": 644869
                  },
                  {
                    "unit": {
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups"
                    },
                    "quantity": "1",
                    "id": 644867
                  }
                ],
                "raw_text": "1 cup cornstarch",
                "extra_comment": ""
              },
              {
                "raw_text": "3 cups flour",
                "extra_comment": "",
                "ingredient": {
                  "created_at": 1493314654,
                  "display_plural": "flours",
                  "id": 25,
                  "display_singular": "flour",
                  "updated_at": 1509035288,
                  "name": "flour"
                },
                "id": 32717,
                "position": 6,
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "375",
                    "id": 644885
                  },
                  {
                    "unit": {
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups"
                    },
                    "quantity": "3",
                    "id": 644884
                  }
                ]
              },
              {
                "raw_text": "1 egg",
                "extra_comment": "",
                "ingredient": {
                  "name": "egg",
                  "created_at": 1493314622,
                  "display_plural": "eggs",
                  "id": 19,
                  "display_singular": "egg",
                  "updated_at": 1509035288
                },
                "id": 32718,
                "position": 7,
                "measurements": [
                  {
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    },
                    "quantity": "1",
                    "id": 644872
                  }
                ]
              },
              {
                "ingredient": {
                  "display_plural": "waters",
                  "id": 197,
                  "display_singular": "water",
                  "updated_at": 1509035280,
                  "name": "water",
                  "created_at": 1494124627
                },
                "id": 32719,
                "position": 8,
                "measurements": [
                  {
                    "unit": {
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL",
                      "abbreviation": "mL",
                      "system": "metric"
                    },
                    "quantity": "360",
                    "id": 644875
                  },
                  {
                    "quantity": "1 ½",
                    "id": 644874,
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    }
                  }
                ],
                "raw_text": "1½ cups water",
                "extra_comment": ""
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp",
                      "system": "imperial",
                      "name": "tablespoon"
                    },
                    "quantity": "2",
                    "id": 644876
                  }
                ],
                "raw_text": "2 tablespoons oil",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035284,
                  "name": "oil",
                  "created_at": 1493745145,
                  "display_plural": "oils",
                  "id": 100,
                  "display_singular": "oil"
                },
                "id": 32720,
                "position": 9
              },
              {
                "raw_text": "2 cups oil, for frying",
                "extra_comment": "for frying",
                "ingredient": {
                  "display_singular": "oil",
                  "updated_at": 1509035284,
                  "name": "oil",
                  "created_at": 1493745145,
                  "display_plural": "oils",
                  "id": 100
                },
                "id": 32721,
                "position": 10,
                "measurements": [
                  {
                    "unit": {
                      "name": "liter",
                      "display_plural": "L",
                      "display_singular": "L",
                      "abbreviation": "L",
                      "system": "metric"
                    },
                    "quantity": "1 ½",
                    "id": 644870
                  },
                  {
                    "unit": {
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup"
                    },
                    "quantity": "6",
                    "id": 644868
                  }
                ]
              }
            ],
            "name": "Chicken",
            "position": 1
          },
          {
            "components": [
              {
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035284,
                  "name": "oil",
                  "created_at": 1493745145,
                  "display_plural": "oils",
                  "id": 100,
                  "display_singular": "oil"
                },
                "id": 32723,
                "position": 12,
                "measurements": [
                  {
                    "unit": {
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp",
                      "system": "imperial"
                    },
                    "quantity": "1",
                    "id": 644873
                  }
                ],
                "raw_text": "1 tablespoon oil"
              },
              {
                "position": 13,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp"
                    },
                    "quantity": "¼",
                    "id": 644882
                  }
                ],
                "raw_text": "¼ teaspoon chili flakes",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035153,
                  "name": "chili flake",
                  "created_at": 1498705858,
                  "display_plural": "chili flakes",
                  "id": 1963,
                  "display_singular": "chili flake"
                },
                "id": 32724
              },
              {
                "raw_text": "1 tablespoon garlic, minced",
                "extra_comment": "minced",
                "ingredient": {
                  "name": "garlic",
                  "created_at": 1493744766,
                  "display_plural": "garlics",
                  "id": 95,
                  "display_singular": "garlic",
                  "updated_at": 1509035285
                },
                "id": 32725,
                "position": 14,
                "measurements": [
                  {
                    "unit": {
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp",
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons"
                    },
                    "quantity": "1",
                    "id": 644896
                  }
                ]
              },
              {
                "id": 32726,
                "position": 15,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "tsp",
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon"
                    },
                    "quantity": "½",
                    "id": 644880
                  }
                ],
                "raw_text": "½ teaspoon ginger, minced",
                "extra_comment": "minced",
                "ingredient": {
                  "name": "ginger",
                  "created_at": 1494789823,
                  "display_plural": "gingers",
                  "id": 273,
                  "display_singular": "ginger",
                  "updated_at": 1509035274
                }
              },
              {
                "raw_text": "¼ cup sugar",
                "extra_comment": "",
                "ingredient": {
                  "created_at": 1493314650,
                  "display_plural": "sugars",
                  "id": 24,
                  "display_singular": "sugar",
                  "updated_at": 1509035288,
                  "name": "sugar"
                },
                "id": 32727,
                "position": 16,
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "50",
                    "id": 644879
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "¼",
                    "id": 644877
                  }
                ]
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "55",
                    "id": 644888
                  },
                  {
                    "unit": {
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups"
                    },
                    "quantity": "¼",
                    "id": 644887
                  }
                ],
                "raw_text": "¼ cup brown sugar",
                "extra_comment": "",
                "ingredient": {
                  "created_at": 1493307081,
                  "display_plural": "brown sugars",
                  "id": 6,
                  "display_singular": "brown sugar",
                  "updated_at": 1509035289,
                  "name": "brown sugar"
                },
                "id": 32728,
                "position": 17
              },
              {
                "position": 18,
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL",
                      "abbreviation": "mL"
                    },
                    "quantity": "60",
                    "id": 644891
                  },
                  {
                    "id": 644890,
                    "unit": {
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups"
                    },
                    "quantity": "¼"
                  }
                ],
                "raw_text": "¼ cup orange juice",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035256,
                  "name": "orange juice",
                  "created_at": 1495141563,
                  "display_plural": "orange juices",
                  "id": 485,
                  "display_singular": "orange juice"
                },
                "id": 32729
              },
              {
                "ingredient": {
                  "display_singular": "white distilled vinegar",
                  "updated_at": 1516934995,
                  "name": "white distilled vinegar",
                  "created_at": 1516934995,
                  "display_plural": "white distilled vinegars",
                  "id": 3566
                },
                "id": 32730,
                "position": 19,
                "measurements": [
                  {
                    "quantity": "60",
                    "id": 644895,
                    "unit": {
                      "system": "metric",
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL",
                      "abbreviation": "mL"
                    }
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "¼",
                    "id": 644894
                  }
                ],
                "raw_text": "½ cup white distilled vinegar",
                "extra_comment": ""
              },
              {
                "raw_text": "2 tablespoons soy sauce",
                "extra_comment": "",
                "ingredient": {
                  "display_plural": "soy sauces",
                  "id": 28,
                  "display_singular": "soy sauce",
                  "updated_at": 1509035287,
                  "name": "soy sauce",
                  "created_at": 1493314932
                },
                "id": 32731,
                "position": 20,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "2",
                    "id": 644883
                  }
                ]
              },
              {
                "ingredient": {
                  "updated_at": 1509035280,
                  "name": "water",
                  "created_at": 1494124627,
                  "display_plural": "waters",
                  "id": 197,
                  "display_singular": "water"
                },
                "id": 32732,
                "position": 21,
                "measurements": [
                  {
                    "quantity": "2",
                    "id": 644871,
                    "unit": {
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp",
                      "system": "imperial",
                      "name": "tablespoon"
                    }
                  }
                ],
                "raw_text": "2 tablespoons water",
                "extra_comment": ""
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp",
                      "system": "imperial",
                      "name": "tablespoon"
                    },
                    "quantity": "2",
                    "id": 644892
                  }
                ],
                "raw_text": "2 tablespoons cornstarch",
                "extra_comment": "",
                "ingredient": {
                  "name": "cornstarch",
                  "created_at": 1495141711,
                  "display_plural": "cornstarches",
                  "id": 488,
                  "display_singular": "cornstarch",
                  "updated_at": 1509035256
                },
                "id": 32733,
                "position": 22
              },
              {
                "raw_text": "1 teaspoon sesame oil",
                "extra_comment": "",
                "ingredient": {
                  "display_singular": "sesame oil",
                  "updated_at": 1509035260,
                  "name": "sesame oil",
                  "created_at": 1495072290,
                  "display_plural": "sesame oils",
                  "id": 443
                },
                "id": 32734,
                "position": 23,
                "measurements": [
                  {
                    "quantity": "1",
                    "id": 644886,
                    "unit": {
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp"
                    }
                  }
                ]
              }
            ],
            "name": "Orange Sauce",
            "position": 2
          }
        ]
      },
      {
        "servings_noun_plural": "servings",
        "keywords": "buzzfeed, chicken, delicious, dinner, easy, nom, paprika, rice, tasty",
        "id": 746,
        "show_id": 17,
        "prep_time_minutes": null,
        "sections": [
          {
            "components": [
              {
                "id": 7757,
                "position": 1,
                "measurements": [
                  {
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    },
                    "quantity": "5",
                    "id": 736962
                  }
                ],
                "raw_text": "5 chicken thighs",
                "extra_comment": "",
                "ingredient": {
                  "name": "chicken thighs",
                  "created_at": 1496175396,
                  "display_plural": "chicken thighs",
                  "id": 987,
                  "display_singular": "chicken thigh",
                  "updated_at": 1509035216
                }
              },
              {
                "extra_comment": "plus more to taste",
                "ingredient": {
                  "updated_at": 1509035288,
                  "name": "salt",
                  "created_at": 1493314644,
                  "display_plural": "salts",
                  "id": 22,
                  "display_singular": "salt"
                },
                "id": 7758,
                "position": 2,
                "measurements": [
                  {
                    "id": 736960,
                    "unit": {
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp",
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons"
                    },
                    "quantity": "1"
                  }
                ],
                "raw_text": "1 teaspoon salt"
              },
              {
                "measurements": [
                  {
                    "id": 736963,
                    "unit": {
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp"
                    },
                    "quantity": "1"
                  }
                ],
                "raw_text": "1 teaspoon pepper",
                "extra_comment": "plus more to taste",
                "ingredient": {
                  "name": "pepper",
                  "created_at": 1493314935,
                  "display_plural": "peppers",
                  "id": 29,
                  "display_singular": "pepper",
                  "updated_at": 1509035287
                },
                "id": 7759,
                "position": 3
              },
              {
                "raw_text": "1 teaspoon paprika",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035286,
                  "name": "paprika",
                  "created_at": 1493430149,
                  "display_plural": "paprikas",
                  "id": 42,
                  "display_singular": "paprika"
                },
                "id": 7760,
                "position": 4,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "tsp",
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon"
                    },
                    "quantity": "1",
                    "id": 736961
                  }
                ]
              },
              {
                "ingredient": {
                  "id": 259,
                  "display_singular": "dried parsley",
                  "updated_at": 1509035275,
                  "name": "dried parsley",
                  "created_at": 1494385176,
                  "display_plural": "dried parsleys"
                },
                "id": 7761,
                "position": 5,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "tsp",
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon"
                    },
                    "quantity": "1",
                    "id": 736964
                  }
                ],
                "raw_text": "1 teaspoon dried parsley",
                "extra_comment": ""
              },
              {
                "raw_text": "1 tablespoon olive oil",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035290,
                  "name": "olive oil",
                  "created_at": 1493306183,
                  "display_plural": "olive oils",
                  "id": 4,
                  "display_singular": "olive oil"
                },
                "id": 7762,
                "position": 6,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "1",
                    "id": 736972
                  }
                ]
              },
              {
                "ingredient": {
                  "created_at": 1493744766,
                  "display_plural": "garlics",
                  "id": 95,
                  "display_singular": "garlic",
                  "updated_at": 1509035285,
                  "name": "garlic"
                },
                "id": 7763,
                "position": 7,
                "measurements": [
                  {
                    "unit": {
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp",
                      "system": "imperial"
                    },
                    "quantity": "1",
                    "id": 736969
                  }
                ],
                "raw_text": "1 tablespoon garlic, minced",
                "extra_comment": "minced"
              },
              {
                "ingredient": {
                  "updated_at": 1509035289,
                  "name": "red onion",
                  "created_at": 1493307196,
                  "display_plural": "red onions",
                  "id": 13,
                  "display_singular": "red onion"
                },
                "id": 7764,
                "position": 8,
                "measurements": [
                  {
                    "id": 736967,
                    "unit": {
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups"
                    },
                    "quantity": "½"
                  },
                  {
                    "unit": {
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g",
                      "system": "metric",
                      "name": "gram"
                    },
                    "quantity": "75",
                    "id": 736965
                  }
                ],
                "raw_text": "½ cup red onion, diced",
                "extra_comment": "diced"
              },
              {
                "measurements": [
                  {
                    "quantity": "1",
                    "id": 736968,
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    }
                  },
                  {
                    "quantity": "200",
                    "id": 736966,
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    }
                  }
                ],
                "raw_text": "1 cup long grain rice",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035283,
                  "name": "long grain rice",
                  "created_at": 1493906283,
                  "display_plural": "long grain rices",
                  "id": 150,
                  "display_singular": "long grain rice"
                },
                "id": 7765,
                "position": 9
              },
              {
                "raw_text": "1½ cups chicken broth",
                "extra_comment": "",
                "ingredient": {
                  "display_plural": "chicken broths",
                  "id": 218,
                  "display_singular": "chicken broth",
                  "updated_at": 1509035278,
                  "name": "chicken broth",
                  "created_at": 1494212911
                },
                "id": 7766,
                "position": 10,
                "measurements": [
                  {
                    "unit": {
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup"
                    },
                    "quantity": "1 ½",
                    "id": 736971
                  },
                  {
                    "unit": {
                      "abbreviation": "mL",
                      "system": "metric",
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL"
                    },
                    "quantity": "360",
                    "id": 736970
                  }
                ]
              }
            ],
            "name": null,
            "position": 1
          }
        ],
        "approved_at": 1498007366,
        "yields": "Servings: 5",
        "promotion": "full",
        "facebook_posts": [],
        "nutrition": {
          "carbohydrates": 36,
          "fiber": 0,
          "updated_at": "2023-08-11T08:13:09+02:00",
          "protein": 22,
          "fat": 9,
          "calories": 313,
          "sugar": 1
        },
        "name": "Paprika Chicken & Rice Bake",
        "aspect_ratio": "1:1",
        "credits": [
          {
            "name": "Claire Nolan",
            "type": "internal"
          }
        ],
        "video_ad_content": "none",
        "user_ratings": {
          "count_positive": 8694,
          "score": 0.975867,
          "count_negative": 215
        },
        "slug": "paprika-chicken-rice",
        "draft_status": "published",
        "beauty_url": null,
        "created_at": 1493236057,
        "description": "Sometimes the best things come in one pot! This baked chicken and rice dish saves you the cleanup without skimping on flavor. After you quickly pan fry your seasoned chicken, remove it and cook garlic and onions in the leftover juices. Add rice and broth, cook everything, and top with the chicken before baking for another 35 minutes (optional: broil the chicken separately to get a crispier skin.) You’ll be left with a mountain of food so delicious, you’ll meal prep this super easy recipe at least once a week forever.",
        "updated_at": 1692119161,
        "total_time_tier": null,
        "country": "ZZ",
        "compilations": [
          {
            "aspect_ratio": "1:1",
            "country": "US",
            "keywords": null,
            "facebook_posts": [],
            "beauty_url": null,
            "slug": "10-rice-recipes-perfect-for-dinner",
            "buzz_id": null,
            "is_shoppable": false,
            "created_at": 1543915990,
            "description": null,
            "approved_at": 1544243258,
            "name": "10 Rice Recipes Perfect For Dinner",
            "canonical_id": "compilation:805",
            "id": 805,
            "promotion": "full",
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "draft_status": "published",
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/193464.jpg",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/118698/hls24_1544164488.m3u8",
            "video_id": 72971
          },
          {
            "buzz_id": null,
            "promotion": "full",
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/226378.jpg",
            "thumbnail_alt_text": "",
            "approved_at": 1565106475,
            "beauty_url": null,
            "video_id": 87925,
            "aspect_ratio": "1:1",
            "description": null,
            "draft_status": "published",
            "canonical_id": "compilation:1054",
            "id": 1054,
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1564642366,
            "slug": "5-amazing-recipes-you-can-make-using-rice",
            "country": "US",
            "keywords": null,
            "facebook_posts": [],
            "video_url": "https://vid.tasty.co/output/139726/hls24_1563795527.m3u8",
            "name": "5 Amazing Recipes You Can Make Using Rice"
          },
          {
            "is_shoppable": false,
            "created_at": 1593111736,
            "slug": "delicious-rice-dinners",
            "description": null,
            "draft_status": "published",
            "thumbnail_alt_text": "",
            "approved_at": 1595511950,
            "beauty_url": null,
            "facebook_posts": [],
            "canonical_id": "compilation:1563",
            "id": 1563,
            "buzz_id": null,
            "promotion": "full",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/271498.jpg",
            "video_url": "https://vid.tasty.co/output/171393/hls24_1593112397.m3u8",
            "name": "Delicious Rice Dinners",
            "aspect_ratio": "1:1",
            "country": "US",
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "language": "eng",
            "video_id": 107977
          },
          {
            "promotion": "full",
            "country": "US",
            "facebook_posts": [],
            "draft_status": "published",
            "video_url": "https://vid.tasty.co/output/178721/hls24_1600083487.m3u8",
            "is_shoppable": false,
            "buzz_id": null,
            "slug": "one-pot-dinners",
            "video_id": 112956,
            "keywords": null,
            "description": "Looking for simple, easy-to-make one-pot dinner recipes? Start with these! You choose from a cheesy <a href=\"https://tasty.co/recipe/one-pot-bacon-and-wild-mushroom-risotto%20%20https://tasty.co/recipe/one-pot-broccoli-cheddar-soup\">mushroom bacon risotto</a> or <a href=\"https://tasty.co/recipe/paprika-chicken-rice\">paprika chicken rice bake</a> depending on what you’re craving. They’re perfect dinner options which will keep you full and fueled for hours. If you're vegetarian or vegan, no problem. You can always swap meat with the vegetable of your choice, or even tofu. Let's eat!",
            "thumbnail_url": "https://s3.amazonaws.com/video-api-prod/assets/aa391376ab184d09b13c8ba344a97ea8/OnePotDinners.jpg",
            "canonical_id": "compilation:1704",
            "thumbnail_alt_text": "",
            "approved_at": 1600182627,
            "name": "One-Pot Dinners",
            "id": 1704,
            "aspect_ratio": "1:1",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1600082865,
            "language": "eng",
            "beauty_url": null
          },
          {
            "canonical_id": "compilation:2021",
            "promotion": "full",
            "video_id": 121991,
            "is_shoppable": false,
            "approved_at": 1609344209,
            "name": "Tasty's Best Dinners Of 2020",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/301791.jpg",
            "thumbnail_alt_text": "",
            "country": "US",
            "facebook_posts": [],
            "draft_status": "published",
            "id": 2021,
            "beauty_url": null,
            "buzz_id": null,
            "slug": "tasty-s-best-dinners-of-2020",
            "aspect_ratio": "1:1",
            "description": "2020 has cooked up a storm in our lives and in our kitchens! We've hand-picked the best of the best trends of the year and are serving you some hot delicious dinners. From the insta-worthy <a href=\"https://tasty.co/recipe/rainbow-grilled-chicken-salad\">Rainbow Grilled Chicken Salad</a> to the <a href=\"https://tasty.co/recipe/zaatar-chicken-and-rice-pilaf\">Za'atar Chicken and Rice Pilaf</a>, this year has been great for all you foodies! Remember, let's leave the year behind but not the recipes.",
            "video_url": "https://vid.tasty.co/output/189791/hls24_1609239151.m3u8",
            "language": "eng",
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1609143477
          },
          {
            "canonical_id": "compilation:2188",
            "id": 2188,
            "aspect_ratio": "1:1",
            "facebook_posts": [],
            "video_url": "https://vid.tasty.co/output/194672/hls24_1614338438.m3u8",
            "approved_at": 1614696398,
            "buzz_id": null,
            "video_id": 124386,
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "draft_status": "published",
            "thumbnail_url": "https://s3.amazonaws.com/video-api-prod/assets/065e926a74db43a1bfa4d5c89c762fe8/FB1.jpg",
            "created_at": 1614255889,
            "description": "You can never go wrong with rice, and these easy, mouthwatering recipes prove that rice is an anytime food. Start your day with a sweet <a href=\"https://tasty.co/recipe/japanese-style-fried-chicken-rice-burger\">Fried Chicken Rice Burger</a> or enjoy <a href=\"https://tasty.co/recipe/pineapple-fried-rice\">Pineapple Fried Rice</a> on a special lunch date. But why settle for one when you have 25 options to try from? Let’s get cookin’! ",
            "thumbnail_alt_text": "",
            "beauty_url": null,
            "slug": "25-rice-recipes",
            "promotion": "full",
            "country": "US",
            "is_shoppable": false,
            "language": "eng",
            "name": "25 Rice Recipes"
          },
          {
            "name": "Rice In Everything!",
            "id": 2306,
            "promotion": "full",
            "video_id": 130605,
            "draft_status": "published",
            "approved_at": 1620136761,
            "created_at": 1619167205,
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/201727/hls24_1619721512.m3u8",
            "canonical_id": "compilation:2306",
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "description": "Rice is filling. Rice is versatile. Rice is easy to cook. And these rice recipes will have you set for a whole month. Our one-pot <a href=\"https://tasty.co/recipe/one-pot-enchilada-rice\">Enchilada Rice</a> is cheesy and easy to whip up. For something more fun and cute, try out our beef and broccoli <a href=\"https://tasty.co/recipe/beef-broccoli-stuffed-rice-triangles\">Rice Triangles</a>! If you want to challenge yourself, go all out with the show-stopping <a href=\"https://tasty.co/recipe/lamb-biryani\">Lamb Biryani</a>. Let's face it: with rice, you can never go wrong! ",
            "language": "eng",
            "beauty_url": null,
            "buzz_id": null,
            "country": "US",
            "facebook_posts": [],
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/320062.jpg",
            "slug": "rice-in-everything",
            "aspect_ratio": "1:1",
            "keywords": null
          },
          {
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/332119.jpg",
            "thumbnail_alt_text": "",
            "slug": "comfort-foods-after-a-long-day-at-work",
            "facebook_posts": [],
            "description": "Do you have crazy work hours and need something to lift your spirits? We're happy to help! We've carefully selected a list of low-lift recipes that will bring a smile on your face! Need a quick boost of serotonin, test out the <a href=\"https://tasty.co/recipe/cheeseburger-sliders\">Cheeseburger Sliders</a> and if that's not enough, try the <a href=\"https://tasty.co/recipe/homemade-broccoli-cheese-soup\">Homemade Broccoli Cheese Soup</a>! Test 'em out and don't forget to pick your favorites!",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1626353935,
            "draft_status": "published",
            "video_url": "https://vid.tasty.co/output/209531/hls24_1626338158.m3u8",
            "aspect_ratio": "1:1",
            "country": "US",
            "beauty_url": null,
            "buzz_id": null,
            "name": "Comfort Foods After A Long Day At Work",
            "canonical_id": "compilation:2624",
            "approved_at": 1627308340,
            "id": 2624,
            "promotion": "full",
            "video_id": 136478,
            "is_shoppable": false,
            "keywords": null
          },
          {
            "country": "US",
            "thumbnail_alt_text": "",
            "approved_at": 1627490429,
            "id": 2637,
            "video_id": 136309,
            "description": "We know you love rice as much as we do, but we also know the plain Jane rice recipes just don't cut it! We have curated the most unique and delectable rice recipes, you will definitely love! If you're in the mood for a yummy and fulfilling burger, try the <a href=\"https://tasty.co/recipe/japanese-style-fried-chicken-rice-burger\">Japanese Style Fried Chicken Rice Burger</a>, pair that up with a the scintillating <a href=\"https://tasty.co/recipe/mango-stuffed-sticky-rice-balls\">Mango Sticky Rice</a> for a sweet surprise! The hardest part, you will not get enough of these rice recipes!",
            "aspect_ratio": "1:1",
            "is_shoppable": false,
            "facebook_posts": [],
            "created_at": 1626356560,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/332075.jpg",
            "name": "Rice Recipes You Will Love",
            "slug": "rice-recipes-you-will-love",
            "promotion": "full",
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "draft_status": "published",
            "language": "eng",
            "video_url": "https://vid.tasty.co/output/209494/hls24_1626329475.m3u8",
            "canonical_id": "compilation:2637",
            "beauty_url": null,
            "buzz_id": null
          },
          {
            "buzz_id": null,
            "promotion": "full",
            "description": "Work days are feeling long, but we need you to keep powering through, so we think we have just the thing: A whole list of lunches that'll satisfy every mid-day craving. From mouth-watering <a href=\"https://tasty.co/recipe/chinese-take-away-style-lemon-chicken\">Chinese-style lemon chicken</a> to <a href=\"https://tasty.co/recipe/vegan-pesto-pasta\">vegan pesto pasta</a>, these recipes will definitely make your (work) day.",
            "draft_status": "published",
            "thumbnail_url": "https://s3.amazonaws.com/video-api-prod/assets/94be2401af1f483ebfbb8d98483e880c/FB2.jpg",
            "name": "Tasty's Top 23 Lunches ",
            "canonical_id": "compilation:2648",
            "aspect_ratio": "1:1",
            "keywords": null,
            "id": 2648,
            "language": "eng",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/211090/hls24_1627643262.m3u8",
            "country": "US",
            "is_shoppable": false,
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1627294831,
            "approved_at": 1627921311,
            "beauty_url": null,
            "slug": "tasty-s-top-23-lunches",
            "video_id": 137469
          },
          {
            "video_id": 138077,
            "aspect_ratio": "1:1",
            "country": "US",
            "created_at": 1627898962,
            "name": "7 Days, 7 Rice Bowl Recipes",
            "buzz_id": null,
            "promotion": "full",
            "beauty_url": null,
            "slug": "7-days-7-rice-bowl-recipes",
            "facebook_posts": [],
            "draft_status": "published",
            "language": "eng",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/211419/hls24_1627899371.m3u8",
            "approved_at": 1628185443,
            "is_shoppable": false,
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "description": "Rice is having it's moment in the sun — so we're bringing you rice bowls for every day of the week.  Conquer those Monday blues with a heaping bowl of <a href=\"https://tasty.co/recipe/paprika-chicken-rice\">Paprika Chicken and Rice Bake</a>. On a more relaxed day when you have the time to jazz it up, test out our <a href=\"https://tasty.co/recipe/crunchy-california-roll-sushi-bowl\">Crunchy California Roll Sushi Bowl</a>. That's quite the mouthful, literally and figuratively! It's rice time, baby. ",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/334882.jpg",
            "canonical_id": "compilation:2721",
            "id": 2721
          },
          {
            "id": 2879,
            "beauty_url": null,
            "buzz_id": null,
            "promotion": "full",
            "is_shoppable": false,
            "created_at": 1632947236,
            "description": "There are not many ingredients more versatile than rice. Serve some <a href=\"https://tasty.co/recipe/beef-broccoli-stuffed-rice-triangles\">beef and broccoli-stuffed rice triangles</a> as an appetizer or think outside the box with our loaded, <a href=\"https://tasty.co/recipe/sushi-rice-dip\">one-of-a-kind sushi rice dip</a>. Finally, comfort yourself on a weeknight with our quick and homely <a href=\"https://tasty.co/recipe/one-pot-enchilada-rice\">one-pot enchilada rice</a>. When you have rice on hand, the possibilities are endless.",
            "draft_status": "published",
            "video_id": 142520,
            "country": "US",
            "keywords": null,
            "facebook_posts": [],
            "approved_at": 1634134372,
            "canonical_id": "compilation:2879",
            "slug": "have-a-rice-day-with-these-mouth-watering-recipes",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/344908.jpg",
            "thumbnail_alt_text": "",
            "aspect_ratio": "1:1",
            "video_url": "https://vid.tasty.co/output/217633/hls24_1632947714.m3u8",
            "name": "Have A 'Rice' Day With These Mouth-watering Recipes"
          },
          {
            "video_url": "https://vid.tasty.co/output/229835/hls24_1643381603.m3u8",
            "aspect_ratio": "1:1",
            "description": "Let's face it: we all love food. What we don't like, though? Tedious and over-complicated recipes that make you throw your hands up in frustration and pull up your UberEats app as quickly as possible. Well look no further and try out these recipes that are set to make your week easy, simple, and oh-so-delicious!",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/363455.jpg",
            "thumbnail_alt_text": "Tasty Food For Every Mood",
            "buzz_id": null,
            "slug": "simplify-your-week-with-these-tasty-recipes",
            "created_at": 1643381205,
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "draft_status": "published",
            "language": "eng",
            "approved_at": 1643745364,
            "name": "Simplify Your Week With These Tasty Recipes",
            "canonical_id": "compilation:3049",
            "is_shoppable": false,
            "beauty_url": null,
            "promotion": "full",
            "id": 3049,
            "facebook_posts": [],
            "video_id": 151020,
            "country": "US"
          },
          {
            "facebook_posts": [],
            "created_at": 1654244697,
            "language": "eng",
            "video_url": "https://vid.tasty.co/output/241753/hls24_1654244681.m3u8",
            "country": "US",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "name": "Pepper Is Essential",
            "buzz_id": null,
            "slug": "pepper-is-essential",
            "promotion": "full",
            "keywords": null,
            "is_shoppable": false,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/381275.jpg",
            "approved_at": 1655129570,
            "id": 3201,
            "aspect_ratio": "1:1",
            "draft_status": "published",
            "thumbnail_alt_text": "",
            "canonical_id": "compilation:3201",
            "beauty_url": null,
            "video_id": 159060,
            "description": "One of the most over looked ingredients in food is pepper. Pepper gives your food that extra kick! So here are some tasty recipes, that are incomplete without pepper! Try out our <a href=\"https://tasty.co/recipe/crunchy-salt-and-pepper-shrimp\">salt and pepper shrimp</a>,<a href=\"https://tasty.co/recipe/one-pot-lemon-pepper-chicken-rice\">lemon pepper chicken rice </a> and more to know exactly what we are talking about!"
          },
          {
            "name": "Tasty Dinners for Every Night of December",
            "beauty_url": null,
            "video_id": 174237,
            "facebook_posts": [],
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "video_url": "https://vid.tasty.co/output/264409/hls24_1669870722.m3u8",
            "approved_at": 1670358181,
            "promotion": "full",
            "aspect_ratio": "1:1",
            "draft_status": "published",
            "canonical_id": "compilation:3370",
            "slug": "tasty-dinner-for-every-night-of-december",
            "buzz_id": null,
            "country": "US",
            "is_shoppable": false,
            "created_at": 1668765961,
            "description": "End the year with a culinary big bang! 2022 is coming to an end, but your nights shouldn't without tasting these delicious recipes. We have got <a href=\"https://tasty.co/recipe/baked-lobster-tails\">Baked Lobster Tails</a>, <a href=\"https://tasty.co/recipe/creamy-tuscan-chicken\">Creamy Tuscan Chicken</a>, <a href=\"https://tasty.co/recipe/korean-style-bbq-beef\">Korean-Style BBQ Beef</a>, or a <a href=\"https://tasty.co/recipe/20-minute-one-pan-pizza\">20-Minute One-Pan Pizza</a> to cover all of your cravings. Are you convinced or should we go on?",
            "id": 3370,
            "keywords": null,
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/411506.jpg",
            "thumbnail_alt_text": ""
          },
          {
            "aspect_ratio": "1:1",
            "created_at": 1669048166,
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/263001/hls24_1669048155.m3u8",
            "slug": "sagittarius-season-delicacies",
            "country": "US",
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "description": "This one is for all the Sagittarius folks–lively, passionate, and free-spirited–out there! Start your day with the tastiest <a href=\"https://tasty.co/recipe/sausage-egg-breakfast-cups\">Sausage Egg Breakfast Cups</a>! Tantalize your tastebuds with <a href=\"https://tasty.co/recipe/lemon-chicken-spaghetti-squash\">Lemon Chicken Spaghetti Squash</a>. The <a href=\"https://tasty.co/recipe/mozzarella-stuffed-turkey-meatloaf\">Mozzarella-Stuffed Turkey Meatloaf</a> is sure to leave a smile on your face! Happy Sagittarius season, y'all!",
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/412144.jpg",
            "name": "Sagittarius Season Delicacies",
            "video_id": 174510,
            "approved_at": 1669843638,
            "id": 3374,
            "beauty_url": null,
            "is_shoppable": false,
            "facebook_posts": [],
            "draft_status": "published",
            "canonical_id": "compilation:3374",
            "buzz_id": null,
            "promotion": "full"
          },
          {
            "created_at": 1681482448,
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "description": "A baked chicken dish is always hearty and satisfying without requiring too much time over the stovetop, perfect for those days when you want something satisfying and nourishing, but don't want to spend hours in the kitchen. Try our comforting <a href=\"https://tasty.co/recipe/paprika-chicken-rice\">Paprika Chicken Rice</a>, tasty <a href=\"https://tasty.co/recipe/garlic-parmesan-chicken-tenders\">Garlic Parmesan Chicken Tenders</a>, or ooey-gooey <a href=\"https://tasty.co/recipe/cheesy-chicken-enchiladas\">Cheesy Chicken Enchiladas</a>! Come on, let’s get cooking!",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/440525.jpg",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/284253/hls24_1681482450.m3u8",
            "approved_at": 1682541590,
            "keywords": null,
            "buzz_id": null,
            "promotion": "full",
            "video_id": 189212,
            "beauty_url": null,
            "canonical_id": "compilation:3561",
            "country": "US",
            "is_shoppable": false,
            "draft_status": "published",
            "language": "eng",
            "name": "Succulent Baked Chicken Recipes 7 Ways",
            "id": 3561,
            "slug": "baked-chicken-recipes",
            "aspect_ratio": "1:1"
          }
        ],
        "total_time_minutes": null,
        "is_one_top": false,
        "video_id": 10761,
        "nutrition_visibility": "auto",
        "language": "eng",
        "brand": null,
        "thumbnail_alt_text": "",
        "canonical_id": "recipe:746",
        "seo_title": null,
        "original_video_url": "https://s3.amazonaws.com/video-api-prod/assets/520182b191c3428587290f35aad87d17/BFV16315_PaprikaChickenRice_FB1080SQ.mp4",
        "seo_path": "9295813,64486,64505",
        "brand_id": null,
        "inspired_by_url": null,
        "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/13385.jpg",
        "renditions": [
          {
            "duration": 0,
            "bit_rate": null,
            "aspect": "square",
            "minimum_bit_rate": null,
            "name": "mp4_720x720",
            "maximum_bit_rate": null,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/20942/mp4_1280X720/1484680174_00001.png",
            "content_type": "video/mp4",
            "width": 720,
            "height": 720,
            "file_size": null,
            "url": "https://vid.tasty.co/output/20942/mp4_1280X720/1484680174"
          },
          {
            "duration": 0,
            "aspect": "square",
            "width": 1080,
            "minimum_bit_rate": null,
            "maximum_bit_rate": null,
            "container": "mp4",
            "file_size": null,
            "bit_rate": null,
            "content_type": "application/vnd.apple.mpegurl",
            "name": "low",
            "height": 1080,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/20942/1445289064805-h2exzu/1484680174_00001.png",
            "url": "https://vid.tasty.co/output/20942/low_1484680174.m3u8"
          },
          {
            "file_size": null,
            "bit_rate": null,
            "maximum_bit_rate": null,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/20942/mp4_640x640/1484680174_00001.png",
            "url": "https://vid.tasty.co/output/20942/mp4_640x640/1484680174",
            "duration": 0,
            "content_type": "video/mp4",
            "aspect": "square",
            "width": 640,
            "minimum_bit_rate": null,
            "name": "mp4_640x640",
            "height": 640
          },
          {
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/20942/mp4_720x1280/1484680174_00001.png",
            "bit_rate": null,
            "aspect": "square",
            "name": "mp4_720x720",
            "height": 720,
            "file_size": null,
            "url": "https://vid.tasty.co/output/20942/mp4_720x1280/1484680174",
            "duration": 0,
            "content_type": "video/mp4",
            "width": 720,
            "minimum_bit_rate": null,
            "maximum_bit_rate": null
          }
        ],
        "topics": [
          {
            "slug": "easy-dinner",
            "name": "Easy Dinner"
          },
          {
            "name": "Kid Friendly",
            "slug": "kid-friendly"
          },
          {
            "name": "Weekend Meal Prep",
            "slug": "meal-prep"
          },
          {
            "name": "One-Pot Recipes",
            "slug": "one-pot"
          },
          {
            "name": "Romantic Dinners",
            "slug": "romantic-dinners"
          },
          {
            "name": "Dinner",
            "slug": "dinner"
          },
          {
            "name": "American",
            "slug": "american"
          }
        ],
        "tips_and_ratings_enabled": true,
        "show": {
          "name": "Tasty",
          "id": 17
        },
        "instructions": [
          {
            "temperature": 400,
            "id": 5095,
            "position": 1,
            "display_text": "Preheat oven to 400˚F (200˚C).",
            "start_time": 0,
            "appliance": "oven",
            "end_time": 0
          },
          {
            "temperature": null,
            "id": 5096,
            "position": 2,
            "display_text": "In a large bowl, evenly season chicken thighs with salt, pepper, paprika, and parsley.",
            "start_time": 1000,
            "appliance": null,
            "end_time": 10000
          },
          {
            "end_time": 15850,
            "temperature": 400,
            "id": 5097,
            "position": 3,
            "display_text": "On high, heat olive oil in a oven-proof pot and place chicken thighs, skin-side down, in the hot oil. Cook 5-6 minutes or the thighs develop brown crispy skin and flip over.",
            "start_time": 11000,
            "appliance": "stovetop"
          },
          {
            "position": 4,
            "display_text": "Cook an additional 5-6 minutes to brown the other side and remove from the pot.",
            "start_time": 15617,
            "appliance": null,
            "end_time": 17317,
            "temperature": null,
            "id": 10380
          },
          {
            "id": 5098,
            "position": 5,
            "display_text": "Add the garlic and onions to the pot, and cook until the onions are transparent.",
            "start_time": 17850,
            "appliance": null,
            "end_time": 23505,
            "temperature": null
          },
          {
            "start_time": 24505,
            "appliance": "food_thermometer",
            "end_time": 32350,
            "temperature": 215,
            "id": 5099,
            "position": 6,
            "display_text": "Pour in the rice and chicken broth to the pot and season with salt and pepper. Stir well, bringing to a boil."
          },
          {
            "temperature": null,
            "id": 5100,
            "position": 7,
            "display_text": "Add the chicken thighs back into the pot, skin-side up, on top of the rice, bring back to a boil and cover with a lid.",
            "start_time": 33350,
            "appliance": null,
            "end_time": 36000
          },
          {
            "end_time": 0,
            "temperature": null,
            "id": 5101,
            "position": 8,
            "display_text": "Bake for 35-40 minutes, or until the rice is fully cooked.",
            "start_time": 0,
            "appliance": null
          },
          {
            "id": 10381,
            "position": 9,
            "display_text": "NOTE: For a crispy skin, remove chicken thighs and broil.",
            "start_time": 0,
            "appliance": null,
            "end_time": 0,
            "temperature": null
          },
          {
            "start_time": 43100,
            "appliance": null,
            "end_time": 45449,
            "temperature": null,
            "id": 5103,
            "position": 10,
            "display_text": "Enjoy!"
          }
        ],
        "price": {
          "total": 1300,
          "updated_at": "2023-09-13T07:14:10+02:00",
          "portion": 250,
          "consumption_total": 500,
          "consumption_portion": 100
        },
        "servings_noun_singular": "serving",
        "tags": [
          {
            "root_tag_type": "cuisine",
            "name": "north_american",
            "id": 64444,
            "display_name": "North American",
            "type": "cuisine"
          },
          {
            "display_name": "Comfort Food",
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "comfort_food",
            "id": 64462
          },
          {
            "root_tag_type": "dietary",
            "name": "dairy_free",
            "id": 64463,
            "display_name": "Dairy-Free",
            "type": "dietary"
          },
          {
            "root_tag_type": "dietary",
            "name": "gluten_free",
            "id": 64465,
            "display_name": "Gluten-Free",
            "type": "dietary"
          },
          {
            "display_name": "Easy",
            "type": "difficulty",
            "root_tag_type": "difficulty",
            "name": "easy",
            "id": 64471
          },
          {
            "display_name": "Dinner",
            "type": "meal",
            "root_tag_type": "meal",
            "name": "dinner",
            "id": 64486
          },
          {
            "display_name": "Kid-Friendly",
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "kid_friendly",
            "id": 64488
          },
          {
            "display_name": "Baking",
            "type": "appliance",
            "root_tag_type": "appliance",
            "name": "baking",
            "id": 64492
          },
          {
            "root_tag_type": "seasonal",
            "name": "date_night",
            "id": 64500,
            "display_name": "Date Night",
            "type": "occasion"
          },
          {
            "root_tag_type": "meal",
            "name": "weeknight",
            "id": 64505,
            "display_name": "Weeknight",
            "type": "dinner"
          },
          {
            "name": "broiler",
            "id": 65839,
            "display_name": "Broiler",
            "type": "appliance",
            "root_tag_type": "appliance"
          },
          {
            "root_tag_type": "appliance",
            "name": "stove_top",
            "id": 65848,
            "display_name": "Stove Top",
            "type": "appliance"
          },
          {
            "root_tag_type": "cooking_style",
            "name": "meal_prep",
            "id": 65853,
            "display_name": "Meal Prep",
            "type": "cooking_style"
          },
          {
            "display_name": "One-Pot or Pan",
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "one_pot_or_pan",
            "id": 65855
          },
          {
            "root_tag_type": "cooking_style",
            "name": "pan_fry",
            "id": 65859,
            "display_name": "Pan Fry",
            "type": "cooking_style"
          },
          {
            "id": 1247775,
            "display_name": "Oven Mitts",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "oven_mitts"
          },
          {
            "root_tag_type": "equipment",
            "name": "pyrex",
            "id": 1247785,
            "display_name": "Pyrex",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "sauce_pan",
            "id": 1247786,
            "display_name": "Sauce Pan",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "tongs",
            "id": 1247790,
            "display_name": "Tongs",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "wooden_spoon",
            "id": 1247794,
            "display_name": "Wooden Spoon",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "chefs_knife",
            "id": 1280501,
            "display_name": "Chef's Knife",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "cutting_board",
            "id": 1280503,
            "display_name": "Cutting Board",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "liquid_measuring_cup",
            "id": 1280506,
            "display_name": "Liquid Measuring Cup",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "dry_measuring_cups",
            "id": 1280507,
            "display_name": "Dry Measuring Cups",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "measuring_spoons",
            "id": 1280508,
            "display_name": "Measuring Spoons",
            "type": "equipment"
          },
          {
            "id": 1280510,
            "display_name": "Mixing Bowl",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "mixing_bowl"
          },
          {
            "id": 6117478,
            "display_name": "Tasty EWD Fall",
            "type": "feature_page",
            "root_tag_type": "feature_page",
            "name": "tasty_ewd_fall"
          },
          {
            "root_tag_type": "difficulty",
            "name": "under_1_hour",
            "id": 8091748,
            "display_name": "Under 1 Hour",
            "type": "difficulty"
          },
          {
            "type": "healthy",
            "root_tag_type": "healthy",
            "name": "high_protein",
            "id": 8091917,
            "display_name": "High-Protein"
          },
          {
            "root_tag_type": "healthy",
            "name": "low_sugar",
            "id": 8091918,
            "display_name": "Low-Sugar",
            "type": "healthy"
          },
          {
            "display_name": "Low-Fat",
            "type": "healthy",
            "root_tag_type": "healthy",
            "name": "low_fat",
            "id": 8091919
          },
          {
            "type": "dinner",
            "root_tag_type": "meal",
            "name": "chicken",
            "id": 9299514,
            "display_name": "Chicken"
          }
        ],
        "num_servings": 5,
        "buzz_id": null,
        "video_url": "https://vid.tasty.co/output/20942/low_1484680174.m3u8",
        "is_shoppable": true,
        "cook_time_minutes": null
      },
      {
        "servings_noun_singular": "serving",
        "buzz_id": null,
        "approved_at": 1495575642,
        "is_shoppable": true,
        "yields": "Servings: 6-8",
        "nutrition_visibility": "auto",
        "prep_time_minutes": 15,
        "tips_and_ratings_enabled": true,
        "show": {
          "name": "Tasty International: Proper Tasty",
          "id": 20
        },
        "created_at": 1493235933,
        "description": "Get ready to be cheesin' from ear to ear with this Cheesy Chicken Alfredo Pasta Bake - loaded with gooey cheese, al dente pasta, and tender chicken, this dish is pure comfort in a bowl.",
        "inspired_by_url": null,
        "updated_at": 1692119866,
        "servings_noun_plural": "servings",
        "total_time_tier": {
          "tier": "under_1_hour",
          "display_tier": "Under 1 hour"
        },
        "country": "GB",
        "show_id": 20,
        "sections": [
          {
            "components": [
              {
                "ingredient": {
                  "created_at": 1493306183,
                  "display_plural": "olive oils",
                  "id": 4,
                  "display_singular": "olive oil",
                  "updated_at": 1509035290,
                  "name": "olive oil"
                },
                "id": 559,
                "position": 1,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "1",
                    "id": 659556
                  }
                ],
                "raw_text": "1 tablespoon olive oil",
                "extra_comment": ""
              },
              {
                "raw_text": "3 chicken breasts, cubed",
                "extra_comment": "cubed",
                "ingredient": {
                  "display_singular": "chicken breast",
                  "updated_at": 1509035286,
                  "name": "chicken breast",
                  "created_at": 1493430237,
                  "display_plural": "chicken breasts",
                  "id": 50
                },
                "id": 560,
                "position": 2,
                "measurements": [
                  {
                    "id": 659554,
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    },
                    "quantity": "3"
                  }
                ]
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "display_singular": "",
                      "abbreviation": "",
                      "system": "none",
                      "name": "",
                      "display_plural": ""
                    },
                    "quantity": "0",
                    "id": 659565
                  }
                ],
                "raw_text": "Salt and pepper to taste",
                "extra_comment": "to taste",
                "ingredient": {
                  "updated_at": 1509035288,
                  "name": "salt",
                  "created_at": 1493314644,
                  "display_plural": "salts",
                  "id": 22,
                  "display_singular": "salt"
                },
                "id": 561,
                "position": 3
              },
              {
                "ingredient": {
                  "display_plural": "peppers",
                  "id": 29,
                  "display_singular": "pepper",
                  "updated_at": 1509035287,
                  "name": "pepper",
                  "created_at": 1493314935
                },
                "id": 12237,
                "position": 4,
                "measurements": [
                  {
                    "unit": {
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": "",
                      "system": "none"
                    },
                    "quantity": "0",
                    "id": 659555
                  }
                ],
                "raw_text": "n/a",
                "extra_comment": "to taste"
              },
              {
                "id": 562,
                "position": 5,
                "measurements": [
                  {
                    "quantity": "4",
                    "id": 659557,
                    "unit": {
                      "abbreviation": "clove",
                      "system": "none",
                      "name": "clove",
                      "display_plural": "cloves",
                      "display_singular": "clove"
                    }
                  }
                ],
                "raw_text": "4 garlic cloves, minced",
                "extra_comment": "minced",
                "ingredient": {
                  "updated_at": 1509035285,
                  "name": "garlic",
                  "created_at": 1493744766,
                  "display_plural": "garlics",
                  "id": 95,
                  "display_singular": "garlic"
                }
              },
              {
                "position": 6,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "2 ½",
                    "id": 659567
                  },
                  {
                    "id": 659566,
                    "unit": {
                      "system": "metric",
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL",
                      "abbreviation": "mL"
                    },
                    "quantity": "600"
                  }
                ],
                "raw_text": "2 ½ cups chicken broth",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035278,
                  "name": "chicken broth",
                  "created_at": 1494212911,
                  "display_plural": "chicken broths",
                  "id": 218,
                  "display_singular": "chicken broth"
                },
                "id": 563
              },
              {
                "id": 564,
                "position": 7,
                "measurements": [
                  {
                    "unit": {
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial"
                    },
                    "quantity": "2 ½",
                    "id": 659569
                  },
                  {
                    "unit": {
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL",
                      "abbreviation": "mL",
                      "system": "metric"
                    },
                    "quantity": "600",
                    "id": 659568
                  }
                ],
                "raw_text": "2 ½ cups heavy cream",
                "extra_comment": "",
                "ingredient": {
                  "name": "heavy cream",
                  "created_at": 1494214054,
                  "display_plural": "heavy creams",
                  "id": 221,
                  "display_singular": "heavy cream",
                  "updated_at": 1509035278
                }
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "display_singular": "g",
                      "abbreviation": "g",
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g"
                    },
                    "quantity": "200",
                    "id": 659561
                  },
                  {
                    "unit": {
                      "name": "pound",
                      "display_plural": "lb",
                      "display_singular": "lb",
                      "abbreviation": "lb",
                      "system": "imperial"
                    },
                    "quantity": "½",
                    "id": 659559
                  }
                ],
                "raw_text": "200 grams uncooked penne",
                "extra_comment": "uncooked",
                "ingredient": {
                  "display_plural": "penne pastas",
                  "id": 303,
                  "display_singular": "penne pasta",
                  "updated_at": 1509035271,
                  "name": "penne pasta",
                  "created_at": 1494811670
                },
                "id": 565,
                "position": 8
              },
              {
                "raw_text": "2 cups parmesan",
                "extra_comment": "",
                "ingredient": {
                  "name": "parmesan cheese",
                  "created_at": 1493743835,
                  "display_plural": "parmesan cheeses",
                  "id": 82,
                  "display_singular": "parmesan cheese",
                  "updated_at": 1509035285
                },
                "id": 566,
                "position": 9,
                "measurements": [
                  {
                    "quantity": "2",
                    "id": 659563,
                    "unit": {
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups"
                    }
                  },
                  {
                    "id": 659562,
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "220"
                  }
                ]
              },
              {
                "raw_text": "2 cups mozzarella",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035284,
                  "name": "mozzarella cheese",
                  "created_at": 1493745106,
                  "display_plural": "mozzarella cheeses",
                  "id": 99,
                  "display_singular": "mozzarella cheese"
                },
                "id": 567,
                "position": 10,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "2",
                    "id": 659560
                  },
                  {
                    "unit": {
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g",
                      "system": "metric",
                      "name": "gram"
                    },
                    "quantity": "200",
                    "id": 659558
                  }
                ]
              },
              {
                "raw_text": "A handful of fresh parsley, chopped",
                "extra_comment": "chopped",
                "ingredient": {
                  "display_singular": "fresh parsley",
                  "updated_at": 1509035283,
                  "name": "fresh parsley",
                  "created_at": 1493906396,
                  "display_plural": "fresh parsleys",
                  "id": 154
                },
                "id": 568,
                "position": 11,
                "measurements": [
                  {
                    "id": 659564,
                    "unit": {
                      "display_plural": "handfuls",
                      "display_singular": "handful",
                      "abbreviation": "handful",
                      "system": "none",
                      "name": "handful"
                    },
                    "quantity": "1"
                  }
                ]
              }
            ],
            "name": null,
            "position": 1
          }
        ],
        "brand_id": null,
        "thumbnail_url": "https://img.buzzfeed.com/video-api-prod/assets/e1119589710f4cc19266fc5f05448933/BFV10386_Cheesy_Chicken_Alfredo_Pasta_Bake_Recipe_Photo_2.jpg",
        "thumbnail_alt_text": "",
        "total_time_minutes": 50,
        "topics": [
          {
            "name": "Weekend Meal Prep",
            "slug": "meal-prep"
          },
          {
            "name": "Romantic Dinners",
            "slug": "romantic-dinners"
          },
          {
            "slug": "dinner",
            "name": "Dinner"
          },
          {
            "slug": "pasta",
            "name": "Pasta"
          },
          {
            "name": "American",
            "slug": "american"
          },
          {
            "name": "Italian",
            "slug": "italian"
          }
        ],
        "video_ad_content": "undetermined",
        "canonical_id": "recipe:51",
        "keywords": null,
        "compilations": [
          {
            "slug": "top-5-pasta-recipes",
            "facebook_posts": [],
            "thumbnail_url": "https://s3.amazonaws.com/video-api-prod/assets/654d0916588d46c5835b7a5f547a090e/BestPastaFB.jpg",
            "approved_at": 1515330272,
            "name": "Top 5 Pasta Recipes",
            "id": 389,
            "beauty_url": null,
            "is_shoppable": false,
            "created_at": 1515196894,
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/71466/hls24_1515191493.m3u8",
            "canonical_id": "compilation:389",
            "promotion": "full",
            "video_id": 43415,
            "aspect_ratio": null,
            "country": "US",
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "draft_status": "published",
            "buzz_id": null,
            "description": null,
            "language": "eng"
          },
          {
            "beauty_url": null,
            "country": "US",
            "facebook_posts": [],
            "description": null,
            "draft_status": "published",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/221532.jpg",
            "name": "5 Delicious Cheesy Pasta Recipes",
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "created_at": 1560949153,
            "video_url": "https://vid.tasty.co/output/136445/hls24_1560926789.m3u8",
            "slug": "5-delicious-cheesy-pasta-recipes",
            "aspect_ratio": "1:1",
            "approved_at": 1561222828,
            "canonical_id": "compilation:980",
            "buzz_id": null,
            "promotion": "full",
            "video_id": 85806,
            "is_shoppable": false,
            "keywords": null,
            "language": "eng",
            "thumbnail_alt_text": "",
            "id": 980
          },
          {
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/245675.jpg",
            "slug": "5-mouth-watering-chicken-bake-recipes",
            "country": "US",
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "draft_status": "published",
            "is_shoppable": false,
            "facebook_posts": [],
            "created_at": 1575459708,
            "video_url": "https://vid.tasty.co/output/153419/hls24_1575357993.m3u8",
            "id": 1304,
            "buzz_id": null,
            "promotion": "full",
            "video_id": 96458,
            "aspect_ratio": "1:1",
            "description": null,
            "thumbnail_alt_text": "",
            "beauty_url": null,
            "approved_at": 1575689436,
            "name": "5 Mouth-Watering Chicken Bake Recipes",
            "canonical_id": "compilation:1304"
          },
          {
            "promotion": "full",
            "aspect_ratio": "1:1",
            "country": "US",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "language": "eng",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/155166/hls24_1576480191.m3u8",
            "slug": "7-pasta-recipes-you-ll-want-to-bookmark-asap",
            "is_shoppable": false,
            "facebook_posts": [],
            "created_at": 1576482734,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/248097.jpg",
            "buzz_id": null,
            "keywords": null,
            "canonical_id": "compilation:1344",
            "video_id": 96627,
            "description": null,
            "draft_status": "published",
            "approved_at": 1576544731,
            "name": "7 Pasta Recipes You'll Want To Bookmark ASAP",
            "id": 1344,
            "beauty_url": null
          },
          {
            "slug": "must-have-pasta-dishes",
            "promotion": "full",
            "video_id": 106383,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/267494.jpg",
            "video_url": "https://vid.tasty.co/output/168557/hls24_1590680892.m3u8",
            "beauty_url": null,
            "buzz_id": null,
            "language": "eng",
            "thumbnail_alt_text": "",
            "approved_at": 1591116124,
            "name": "Must-Have Pasta Dishes",
            "description": null,
            "canonical_id": "compilation:1501",
            "aspect_ratio": "1:1",
            "country": "US",
            "facebook_posts": [],
            "created_at": 1590679834,
            "id": 1501,
            "is_shoppable": false,
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "draft_status": "published"
          },
          {
            "promotion": "full",
            "aspect_ratio": "1:1",
            "country": "US",
            "created_at": 1614363222,
            "beauty_url": null,
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/219932/hls24_1634930480.m3u8",
            "name": "Indulgent Vs Light Dinner Recipes",
            "slug": "indulgent-vs-light-dinner-recipes",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "description": "Have some chicken in the fridge and looking for something light to whip up for dinner? The <a href=\"https://tasty.co/recipe/one-pan-lemon-pepper-chicken\">One-Pan Lemon Pepper Chicken</a> is perfect for you. Or if you're feeling like making something more filling, go for the homemade <a href=\"https://tasty.co/recipe/homemade-chicken-tikka-masala\">Chicken Tikka Masala</a>. Use the spaghetti in your pantry for a light <a href=\"https://tasty.co/recipe/2-ingredient-pasta\">2-Ingredient Pasta</a> or indulge in a <a href=\"https://tasty.co/recipe/cheesy-chicken-alfredo-pasta-bake\">Cheesy Chicken Alfredo Pasta Bake</a>.",
            "draft_status": "published",
            "language": "eng",
            "facebook_posts": [],
            "id": 2193,
            "video_id": 125210,
            "canonical_id": "compilation:2193",
            "buzz_id": null,
            "is_shoppable": false,
            "keywords": null,
            "thumbnail_url": "https://s3.amazonaws.com/video-api-prod/assets/8ebbc1961b844cbeac4ecfb841967997/imagebuilder_1614362767606.jpg",
            "approved_at": 1615814518
          },
          {
            "canonical_id": "compilation:2219",
            "buzz_id": null,
            "promotion": "full",
            "created_at": 1615809320,
            "draft_status": "published",
            "video_url": "https://vid.tasty.co/output/198051/hls24_1617121116.m3u8",
            "beauty_url": null,
            "slug": "make-the-perfect-bowl-of-pasta-with-these-recipes",
            "aspect_ratio": "1:1",
            "is_shoppable": false,
            "thumbnail_alt_text": "",
            "video_id": 127253,
            "country": "US",
            "language": "eng",
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "description": "We've curated a special assortment of pasta recipes just for you. From our unique <a href=\"https://tasty.co/recipe/tomato-and-anchovy-pasta\">tomato anchovy pasta</a> to mouth-watering <a href=\"https://tasty.co/recipe/one-pot-chicken-bacon-and-goat-cheese\">chicken, bacon and goat cheese pasta</a>, these recipes are made to impress! We're going to go eat our hearts out now: time to get cooking!",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/314886.jpg",
            "approved_at": 1617195181,
            "name": "Make The Perfect Bowl Of Pasta With These Recipes",
            "id": 2219,
            "keywords": null,
            "facebook_posts": []
          },
          {
            "video_url": "https://vid.tasty.co/output/214880/hls24_1630560418.m3u8",
            "id": 2802,
            "buzz_id": null,
            "is_shoppable": false,
            "thumbnail_alt_text": "",
            "draft_status": "published",
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/340350.jpg",
            "approved_at": 1631799458,
            "canonical_id": "compilation:2802",
            "beauty_url": null,
            "aspect_ratio": "1:1",
            "facebook_posts": [],
            "video_id": 139498,
            "slug": "these-pastas-are-a-total-game-changer",
            "promotion": "full",
            "description": "We're back with one of our all-time favorite foods: pasta! These super quick and easy recipes are the perfect fix for those long, dreary, rainy fall days.. Take your pick from <a href=\"https://tasty.co/recipe/red-wine-pasta\">Red Wine Spaghetti</a> or Instagram-ready <a href=\"https://tasty.co/recipe/grilled-cheese-ravioli\">Grilled Cheese Ravioli</a>. Almost any pasta can satisfy you if you just believe: believe in the power, the power of pasta.   ",
            "country": "US",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "name": "These Pastas Are A Total Game Changer",
            "keywords": null,
            "created_at": 1630559412
          },
          {
            "video_url": "https://vid.tasty.co/output/236137/hls24_1649796728.m3u8",
            "approved_at": 1650404281,
            "name": "Cheese the Pain Away",
            "beauty_url": null,
            "slug": "cheese-the-pain-away",
            "is_shoppable": false,
            "keywords": null,
            "created_at": 1649415489,
            "description": "Ever wondered why Jerry could not keep his hands off the cheese? Cheese is not only \"Tasty\" but tis' loved by all. Balance your sweet side with something savoury by trying out these cheesy recipes.. and see for yourself why Jerry kept coming back for more.  SAY YES TO CHEESE!",
            "draft_status": "published",
            "buzz_id": null,
            "aspect_ratio": "1:1",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "canonical_id": "compilation:3117",
            "video_id": 155104,
            "country": "US",
            "facebook_posts": [],
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/373214.jpg",
            "thumbnail_alt_text": "",
            "id": 3117,
            "promotion": "full"
          },
          {
            "thumbnail_alt_text": "",
            "buzz_id": null,
            "facebook_posts": [],
            "created_at": 1652660719,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/376686.jpg",
            "language": "eng",
            "id": 3169,
            "beauty_url": null,
            "slug": "bring-italy-to-your-kitchen",
            "video_id": 156913,
            "country": "US",
            "keywords": null,
            "description": "Want to experience the exotic flavors from around the world  but are too busy to travel? Here's the solution, why not bring your destination to your kitchen! Time to experience the luxury fashion and renaissance art of wonderful Italy in a different way through your culinary senses. Buon appetito!",
            "approved_at": 1653071940,
            "name": "Bring Italy To Your Kitchen",
            "canonical_id": "compilation:3169",
            "promotion": "full",
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "draft_status": "published",
            "video_url": "https://vid.tasty.co/output/238490/hls24_1651836735.m3u8",
            "aspect_ratio": "1:1",
            "is_shoppable": false
          },
          {
            "video_id": 160124,
            "description": "Wanna win everyone's heart at the next family dinner? We've got you covered! Start out with the delicious <a href=\"https://tasty.co/recipe/one-pot-swedish-meatball-pasta\">One-Pot Swedish Meatball Pasta</a> or try the classy <a href=\"https://tasty.co/recipe/one-pan-teriyaki-salmon-dinner\">One-Pan Teriyaki Salmon Dinner</a>. Impress everyone with your cooking skills!",
            "name": "5 Dinner Recipes To Impress Your Family!",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1655465726,
            "language": "eng",
            "thumbnail_alt_text": "",
            "canonical_id": "compilation:3214",
            "is_shoppable": false,
            "facebook_posts": [],
            "id": 3214,
            "beauty_url": null,
            "country": "US",
            "draft_status": "published",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/383529.jpg",
            "video_url": "https://vid.tasty.co/output/243156/hls24_1655466140.m3u8",
            "approved_at": 1657123771,
            "buzz_id": null,
            "slug": "5-dinner-recipes-to-impress-your-family",
            "promotion": "full",
            "aspect_ratio": "1:1",
            "keywords": null
          },
          {
            "description": "If you believe there's no such thing as too much cheese, these recipes are sugar to satisfy your cravings. Here’s your easy-to-use guide to indulging in the ultimate cheese extravaganza, from <a href=\"https://tasty.co/recipe/cheesy-chicken-alfredo-pasta-bake\">Cheesy Chicken Alfredo Pasta Bake</a> to <a href=\"https://tasty.co/recipe/five-cheese-mac-and-cheese\">Five-cheese Mac and Cheese</a>!",
            "canonical_id": "compilation:3280",
            "is_shoppable": false,
            "keywords": null,
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/393580.jpg",
            "video_url": "https://vid.tasty.co/output/260396/hls24_1667365106.m3u8",
            "name": "Welcome to the Cheese Extravaganza",
            "id": 3280,
            "buzz_id": null,
            "facebook_posts": [],
            "created_at": 1660547546,
            "thumbnail_alt_text": "",
            "promotion": "full",
            "country": "US",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "approved_at": 1667846716,
            "beauty_url": null,
            "slug": "welcome-to-the-cheese-extravaganza",
            "video_id": 164993,
            "aspect_ratio": "1:1",
            "draft_status": "published"
          },
          {
            "approved_at": 1668718685,
            "name": "Recipes to Cook For a Big Family Dinner!",
            "id": 3317,
            "beauty_url": null,
            "created_at": 1663562528,
            "draft_status": "published",
            "thumbnail_url": "https://s3.amazonaws.com/video-api-prod/assets/fa68916e941d481c99136a1051905e44/aaa.jpg",
            "buzz_id": null,
            "slug": "recipes-to-cook-for-a-big-family-dinner",
            "keywords": null,
            "facebook_posts": [],
            "description": "Big family dinners are a time for everyone to come together and gather around a table full of delicious eats. Impress everyone with these family-friendly (and family-size!) recipes that are sure to satisfy the whole crew. From a never-ending <a href=\"https://tasty.co/recipe/100-layer-lasagna\"> 100-Layer Lasagna </a> to a filling <a href=\"https://tasty.co/recipe/chili-cheese-casserole\"> Chili Cheese Casserole</a> , these dishes will have everyone coming back for more!",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "language": "eng",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/254537/hls24_1663561511.m3u8",
            "canonical_id": "compilation:3317",
            "promotion": "full",
            "video_id": 168422,
            "aspect_ratio": "1:1",
            "country": "US",
            "is_shoppable": false
          },
          {
            "created_at": 1668429576,
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/410519.jpg",
            "beauty_url": null,
            "buzz_id": null,
            "promotion": "full",
            "facebook_posts": [],
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/261748/hls24_1668429199.m3u8",
            "name": "Just Take It Cheesy!",
            "id": 3366,
            "country": "US",
            "is_shoppable": false,
            "aspect_ratio": "1:1",
            "description": "Clean out your cheese drawer with these specially curated cheese recipes. From comfort foods to fine dining dishes, we’ve got it all! Start out your meal with these perfect appetizer: <a href=\"https://tasty.co/recipe/3-cheese-garlic-bread\">3-Cheese Garlic Bread</a> Take it further with delicious <a href=\"https://tasty.co/recipe/stuffed-chicken-parmesan\">Stuffed Chicken Parmesan</a> and on a sweet note with the <a href=\"https://tasty.co/recipe/cream-cheese-filled-banana-bread-muffins\">Cream Cheese-Filled Banana Bread Muffins</a>. Gear up for the ultimate cheese marathon.",
            "approved_at": 1669843661,
            "canonical_id": "compilation:3366",
            "slug": "just-take-it-cheesy",
            "video_id": 173186,
            "keywords": null,
            "draft_status": "published"
          },
          {
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1668765961,
            "description": "End the year with a culinary big bang! 2022 is coming to an end, but your nights shouldn't without tasting these delicious recipes. We have got <a href=\"https://tasty.co/recipe/baked-lobster-tails\">Baked Lobster Tails</a>, <a href=\"https://tasty.co/recipe/creamy-tuscan-chicken\">Creamy Tuscan Chicken</a>, <a href=\"https://tasty.co/recipe/korean-style-bbq-beef\">Korean-Style BBQ Beef</a>, or a <a href=\"https://tasty.co/recipe/20-minute-one-pan-pizza\">20-Minute One-Pan Pizza</a> to cover all of your cravings. Are you convinced or should we go on?",
            "approved_at": 1670358181,
            "aspect_ratio": "1:1",
            "language": "eng",
            "name": "Tasty Dinners for Every Night of December",
            "canonical_id": "compilation:3370",
            "buzz_id": null,
            "video_id": 174237,
            "country": "US",
            "keywords": null,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/411506.jpg",
            "video_url": "https://vid.tasty.co/output/264409/hls24_1669870722.m3u8",
            "beauty_url": null,
            "promotion": "full",
            "is_shoppable": false,
            "draft_status": "published",
            "thumbnail_alt_text": "",
            "id": 3370,
            "slug": "tasty-dinner-for-every-night-of-december"
          }
        ],
        "aspect_ratio": "1:1",
        "instructions": [
          {
            "position": 1,
            "display_text": "In a pot, heat oil and add chicken.",
            "start_time": 0,
            "appliance": null,
            "end_time": 2566,
            "temperature": null,
            "id": 399
          },
          {
            "end_time": 3917,
            "temperature": null,
            "id": 8473,
            "position": 2,
            "display_text": "Season chicken with salt and pepper.",
            "start_time": 2917,
            "appliance": null
          },
          {
            "end_time": 6699,
            "temperature": null,
            "id": 8474,
            "position": 3,
            "display_text": "Add garlic, then brown the chicken.",
            "start_time": 4517,
            "appliance": null
          },
          {
            "start_time": 7217,
            "appliance": null,
            "end_time": 12667,
            "temperature": null,
            "id": 8475,
            "position": 4,
            "display_text": "Add broth, heavy cream, and pasta, and bring to a boil."
          },
          {
            "end_time": 17300,
            "temperature": null,
            "id": 8476,
            "position": 5,
            "display_text": "Cover and reduce the heat to a simmer for 15-20 min.",
            "start_time": 12917,
            "appliance": null
          },
          {
            "appliance": null,
            "end_time": 21167,
            "temperature": null,
            "id": 400,
            "position": 6,
            "display_text": "Turn off heat and stir in 1 ½ cups (165 grams) of parmesan cheese.",
            "start_time": 17400
          },
          {
            "temperature": null,
            "id": 8477,
            "position": 7,
            "display_text": "Pour half of the pasta into a greased 11×7 inch or 9×13 inch (28x18 cm or 33x23 cm) baking dish.",
            "start_time": 21567,
            "appliance": null,
            "end_time": 24600
          },
          {
            "end_time": 26517,
            "temperature": null,
            "id": 8478,
            "position": 8,
            "display_text": "Sprinkle evenly with 1 cup (115 grams) of mozzarella cheese.",
            "start_time": 24517,
            "appliance": null
          },
          {
            "end_time": 33367,
            "temperature": null,
            "id": 8479,
            "position": 9,
            "display_text": "Layer the remaining half of the pasta evenly on top. Sprinkle evenly with 1 cup of mozzarella (115 grams) and ½ cup (55 grams) of parmesan.",
            "start_time": 27067,
            "appliance": null
          },
          {
            "display_text": "Broil 10 - 15 minutes, or until the cheese is golden brown. Remove and sprinkle with fresh parsley.",
            "start_time": 33617,
            "appliance": null,
            "end_time": 38913,
            "temperature": null,
            "id": 401,
            "position": 10
          },
          {
            "id": 402,
            "position": 11,
            "display_text": "Enjoy!",
            "start_time": 39913,
            "appliance": null,
            "end_time": 43250,
            "temperature": null
          }
        ],
        "facebook_posts": [],
        "tags": [
          {
            "display_name": "North American",
            "type": "cuisine",
            "root_tag_type": "cuisine",
            "name": "north_american",
            "id": 64444
          },
          {
            "type": "european",
            "root_tag_type": "cuisine",
            "name": "italian",
            "id": 64453,
            "display_name": "Italian"
          },
          {
            "root_tag_type": "cooking_style",
            "name": "comfort_food",
            "id": 64462,
            "display_name": "Comfort Food",
            "type": "cooking_style"
          },
          {
            "root_tag_type": "meal",
            "name": "dinner",
            "id": 64486,
            "display_name": "Dinner",
            "type": "meal"
          },
          {
            "root_tag_type": "appliance",
            "name": "baking",
            "id": 64492,
            "display_name": "Baking",
            "type": "appliance"
          },
          {
            "root_tag_type": "seasonal",
            "name": "date_night",
            "id": 64500,
            "display_name": "Date Night",
            "type": "occasion"
          },
          {
            "root_tag_type": "meal",
            "name": "weeknight",
            "id": 64505,
            "display_name": "Weeknight",
            "type": "dinner"
          },
          {
            "display_name": "Fusion",
            "type": "cuisine",
            "root_tag_type": "cuisine",
            "name": "fusion",
            "id": 65410
          },
          {
            "root_tag_type": "appliance",
            "name": "broiler",
            "id": 65839,
            "display_name": "Broiler",
            "type": "appliance"
          },
          {
            "name": "stove_top",
            "id": 65848,
            "display_name": "Stove Top",
            "type": "appliance",
            "root_tag_type": "appliance"
          },
          {
            "root_tag_type": "cooking_style",
            "name": "meal_prep",
            "id": 65853,
            "display_name": "Meal Prep",
            "type": "cooking_style"
          },
          {
            "id": 188967,
            "display_name": "Special Occasion",
            "type": "occasion",
            "root_tag_type": "seasonal",
            "name": "special_occasion"
          },
          {
            "display_name": "Pyrex",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "pyrex",
            "id": 1247785
          },
          {
            "display_name": "Wooden Spoon",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "wooden_spoon",
            "id": 1247794
          },
          {
            "root_tag_type": "equipment",
            "name": "chefs_knife",
            "id": 1280501,
            "display_name": "Chef's Knife",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "cutting_board",
            "id": 1280503,
            "display_name": "Cutting Board",
            "type": "equipment"
          },
          {
            "name": "liquid_measuring_cup",
            "id": 1280506,
            "display_name": "Liquid Measuring Cup",
            "type": "equipment",
            "root_tag_type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "measuring_spoons",
            "id": 1280508,
            "display_name": "Measuring Spoons",
            "type": "equipment"
          },
          {
            "root_tag_type": "difficulty",
            "name": "under_1_hour",
            "id": 8091748,
            "display_name": "Under 1 Hour",
            "type": "difficulty"
          },
          {
            "root_tag_type": "healthy",
            "name": "high_protein",
            "id": 8091917,
            "display_name": "High-Protein",
            "type": "healthy"
          },
          {
            "display_name": "High-Fiber",
            "type": "healthy",
            "root_tag_type": "healthy",
            "name": "high_fiber",
            "id": 8091920
          },
          {
            "root_tag_type": "cooking_style",
            "name": "cooking_style",
            "id": 9295810,
            "display_name": "Cooking Style",
            "type": "cooking_style"
          },
          {
            "root_tag_type": "appliance",
            "name": "appliance",
            "id": 9295811,
            "display_name": "Appliance",
            "type": "appliance"
          },
          {
            "root_tag_type": "meal",
            "name": "chicken",
            "id": 9299514,
            "display_name": "Chicken",
            "type": "dinner"
          },
          {
            "root_tag_type": "meal",
            "name": "pasta",
            "id": 9299522,
            "display_name": "Pasta",
            "type": "dinner"
          }
        ],
        "nutrition": {
          "sugar": 3,
          "carbohydrates": 29,
          "fiber": 0,
          "updated_at": "2023-08-11T08:13:46+02:00",
          "protein": 93,
          "fat": 78,
          "calories": 1136
        },
        "promotion": "full",
        "language": "eng",
        "id": 51,
        "brand": null,
        "num_servings": 6,
        "video_id": 1609,
        "seo_path": "8757513,9295874,64453",
        "name": "Cheesy Chicken Alfredo Pasta Bake",
        "credits": [
          {
            "name": null,
            "type": "internal"
          }
        ],
        "user_ratings": {
          "count_positive": 11382,
          "score": 0.976996,
          "count_negative": 268
        },
        "price": {
          "total": 3300,
          "updated_at": "2023-09-13T07:15:52+02:00",
          "portion": 550,
          "consumption_total": 2550,
          "consumption_portion": 400
        },
        "slug": "cheesy-chicken-alfredo-pasta-bake",
        "draft_status": "published",
        "video_url": "https://vid.tasty.co/output/8309/low_1472701763.m3u8",
        "is_one_top": false,
        "renditions": [
          {
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/8309/1445289064805-h2exzu/1472701763_00001.png",
            "url": "https://vid.tasty.co/output/8309/low_1472701763.m3u8",
            "duration": 0,
            "bit_rate": null,
            "content_type": "application/vnd.apple.mpegurl",
            "aspect": "square",
            "width": 1080,
            "container": "mp4",
            "height": 1080,
            "name": "low",
            "minimum_bit_rate": null,
            "maximum_bit_rate": null,
            "file_size": null
          },
          {
            "content_type": "video/mp4",
            "width": 720,
            "bit_rate": null,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/8309/mp4_1280X720/1472701763_00001.png",
            "file_size": null,
            "url": "https://vid.tasty.co/output/8309/mp4_1280X720/1472701763",
            "duration": 0,
            "aspect": "square",
            "minimum_bit_rate": null,
            "name": "mp4_720x720",
            "container": "mp4",
            "height": 720,
            "maximum_bit_rate": null
          },
          {
            "minimum_bit_rate": null,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/8309/mp4_640x640/1472701763_00001.png",
            "file_size": null,
            "bit_rate": null,
            "content_type": "video/mp4",
            "aspect": "square",
            "width": 640,
            "height": 640,
            "url": "https://vid.tasty.co/output/8309/mp4_640x640/1472701763",
            "duration": 0,
            "name": "mp4_640x640",
            "maximum_bit_rate": null
          },
          {
            "aspect": "square",
            "width": 720,
            "container": "mp4",
            "file_size": null,
            "duration": 0,
            "bit_rate": null,
            "content_type": "video/mp4",
            "minimum_bit_rate": null,
            "name": "mp4_720x720",
            "maximum_bit_rate": null,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/8309/mp4_720x1280/1472701763_00001.png",
            "url": "https://vid.tasty.co/output/8309/mp4_720x1280/1472701763",
            "height": 720
          }
        ],
        "beauty_url": null,
        "seo_title": null,
        "original_video_url": "https://s3.amazonaws.com/video-api-prod/assets/d3605d9395c748abbfd203e9c2d32db7/BFV10386_Cheesy_Chicken_Alfredo_Pasta_Bake_FB1080SQ.mp4",
        "cook_time_minutes": 35
      },
      {
        "facebook_posts": [],
        "id": 208,
        "brand_id": null,
        "video_url": "https://vid.tasty.co/output/32155/low_1495125408.m3u8",
        "seo_title": null,
        "yields": "Yields: 4 Servings",
        "num_servings": 4,
        "description": "Savor the comforting flavors of this Cheesy Chicken and Broccoli Pasta, perfect for a cozy weeknight dinner. With its creamy sauce and tender chicken, this dish will have everyone coming back for seconds!",
        "draft_status": "published",
        "approved_at": 1497736747,
        "cook_time_minutes": null,
        "promotion": "full",
        "buzz_id": 4633095,
        "show": {
          "name": "Tasty",
          "id": 17
        },
        "thumbnail_alt_text": "",
        "credits": [
          {
            "name": null,
            "type": "internal"
          }
        ],
        "is_one_top": false,
        "servings_noun_plural": "servings",
        "total_time_tier": null,
        "country": "US",
        "seo_path": "9295813,64486,9299514",
        "brand": null,
        "prep_time_minutes": null,
        "thumbnail_url": "https://img.buzzfeed.com/video-api-prod/assets/2de9ee0b60944ff6a0dc73aee761c061/BFV6664_CheesyChickenAndBroccoliPasta_FBthumbB1080sq.jpg",
        "beauty_url": null,
        "sections": [
          {
            "components": [
              {
                "raw_text": "2 Tbsp. olive oil",
                "extra_comment": "",
                "ingredient": {
                  "created_at": 1493306183,
                  "display_plural": "olive oils",
                  "id": 4,
                  "display_singular": "olive oil",
                  "updated_at": 1509035290,
                  "name": "olive oil"
                },
                "id": 2121,
                "position": 1,
                "measurements": [
                  {
                    "id": 544015,
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "2"
                  }
                ]
              },
              {
                "raw_text": "2 chicken breasts, cut into 1 inch pieces",
                "extra_comment": "cut into 1 inch (2cm) pieces",
                "ingredient": {
                  "display_singular": "chicken breast",
                  "updated_at": 1509035286,
                  "name": "chicken breast",
                  "created_at": 1493430237,
                  "display_plural": "chicken breasts",
                  "id": 50
                },
                "id": 2122,
                "position": 2,
                "measurements": [
                  {
                    "unit": {
                      "display_singular": "",
                      "abbreviation": "",
                      "system": "none",
                      "name": "",
                      "display_plural": ""
                    },
                    "quantity": "2",
                    "id": 544016
                  }
                ]
              },
              {
                "ingredient": {
                  "created_at": 1493314644,
                  "display_plural": "salts",
                  "id": 22,
                  "display_singular": "salt",
                  "updated_at": 1509035288,
                  "name": "salt"
                },
                "id": 2123,
                "position": 3,
                "measurements": [
                  {
                    "unit": {
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": "",
                      "system": "none"
                    },
                    "quantity": "0",
                    "id": 544021
                  }
                ],
                "raw_text": "Salt and pepper to taste",
                "extra_comment": "to taste"
              },
              {
                "extra_comment": "to taste",
                "ingredient": {
                  "updated_at": 1509035287,
                  "name": "pepper",
                  "created_at": 1493314935,
                  "display_plural": "peppers",
                  "id": 29,
                  "display_singular": "pepper"
                },
                "id": 12288,
                "position": 4,
                "measurements": [
                  {
                    "unit": {
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": "",
                      "system": "none",
                      "name": ""
                    },
                    "quantity": "0",
                    "id": 544020
                  }
                ],
                "raw_text": "n/a"
              },
              {
                "raw_text": "1/2 cup diced yellow onion (about half an onion)",
                "extra_comment": "about half an onion, diced",
                "ingredient": {
                  "updated_at": 1509035276,
                  "name": "yellow onion",
                  "created_at": 1494297033,
                  "display_plural": "yellow onions",
                  "id": 243,
                  "display_singular": "yellow onion"
                },
                "id": 2124,
                "position": 5,
                "measurements": [
                  {
                    "id": 544019,
                    "unit": {
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g",
                      "system": "metric"
                    },
                    "quantity": "75"
                  },
                  {
                    "unit": {
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups"
                    },
                    "quantity": "½",
                    "id": 544018
                  }
                ]
              },
              {
                "raw_text": "2 cloves garlic, minced (about 1 Tbsp.)",
                "extra_comment": "about 1 tablespoon, minced",
                "ingredient": {
                  "updated_at": 1509035285,
                  "name": "garlic",
                  "created_at": 1493744766,
                  "display_plural": "garlics",
                  "id": 95,
                  "display_singular": "garlic"
                },
                "id": 2125,
                "position": 6,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "clove",
                      "system": "none",
                      "name": "clove",
                      "display_plural": "cloves",
                      "display_singular": "clove"
                    },
                    "quantity": "2",
                    "id": 544017
                  }
                ]
              },
              {
                "id": 2126,
                "position": 7,
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL",
                      "abbreviation": "mL"
                    },
                    "quantity": "480",
                    "id": 544029
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "2",
                    "id": 544028
                  }
                ],
                "raw_text": "2 cups chicken broth",
                "extra_comment": "",
                "ingredient": {
                  "name": "chicken broth",
                  "created_at": 1494212911,
                  "display_plural": "chicken broths",
                  "id": 218,
                  "display_singular": "chicken broth",
                  "updated_at": 1509035278
                }
              },
              {
                "raw_text": "3 cups water",
                "extra_comment": "",
                "ingredient": {
                  "name": "water",
                  "created_at": 1494124627,
                  "display_plural": "waters",
                  "id": 197,
                  "display_singular": "water",
                  "updated_at": 1509035280
                },
                "id": 2127,
                "position": 8,
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL",
                      "abbreviation": "mL"
                    },
                    "quantity": "720",
                    "id": 544031
                  },
                  {
                    "id": 544030,
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "3"
                  }
                ]
              },
              {
                "raw_text": "1 16oz bag of pasta shells",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035222,
                  "name": "pasta shells",
                  "created_at": 1496018460,
                  "display_plural": "pasta shells",
                  "id": 914,
                  "display_singular": "pasta shell"
                },
                "id": 2128,
                "position": 9,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "g",
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g"
                    },
                    "quantity": "455",
                    "id": 544023
                  },
                  {
                    "unit": {
                      "name": "ounce",
                      "display_plural": "oz",
                      "display_singular": "oz",
                      "abbreviation": "oz",
                      "system": "imperial"
                    },
                    "quantity": "16",
                    "id": 544022
                  }
                ]
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "display_plural": "kg",
                      "display_singular": "kg",
                      "abbreviation": "kg",
                      "system": "metric",
                      "name": "kilogram"
                    },
                    "quantity": "1",
                    "id": 544033
                  },
                  {
                    "id": 544032,
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "4"
                  }
                ],
                "raw_text": "4 cups broccoli (or one head of broccoli)",
                "extra_comment": "or one head of broccoli",
                "ingredient": {
                  "display_singular": "broccoli",
                  "updated_at": 1509035287,
                  "name": "broccoli",
                  "created_at": 1493418349,
                  "display_plural": "broccolis",
                  "id": 34
                },
                "id": 2129,
                "position": 10
              },
              {
                "ingredient": {
                  "name": "cayenne powder",
                  "created_at": 1496018573,
                  "display_plural": "cayenne powders",
                  "id": 915,
                  "display_singular": "cayenne powder",
                  "updated_at": 1509035222
                },
                "id": 2130,
                "position": 11,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp"
                    },
                    "quantity": "½",
                    "id": 544026
                  }
                ],
                "raw_text": "1/2 tsp cayenne powder",
                "extra_comment": ""
              },
              {
                "raw_text": "1/4 tsp nutmeg",
                "extra_comment": "",
                "ingredient": {
                  "id": 677,
                  "display_singular": "nutmeg",
                  "updated_at": 1509035242,
                  "name": "nutmeg",
                  "created_at": 1495588355,
                  "display_plural": "nutmegs"
                },
                "id": 2131,
                "position": 12,
                "measurements": [
                  {
                    "quantity": "¼",
                    "id": 544027,
                    "unit": {
                      "abbreviation": "tsp",
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon"
                    }
                  }
                ]
              },
              {
                "raw_text": "1 cup milk",
                "extra_comment": "",
                "ingredient": {
                  "display_plural": "milks",
                  "id": 21,
                  "display_singular": "milk",
                  "updated_at": 1509035288,
                  "name": "milk",
                  "created_at": 1493314636
                },
                "id": 2132,
                "position": 13,
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL",
                      "abbreviation": "mL"
                    },
                    "quantity": "240",
                    "id": 544035
                  },
                  {
                    "quantity": "1",
                    "id": 544034,
                    "unit": {
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial"
                    }
                  }
                ]
              },
              {
                "raw_text": "2 cups shredded cheddar cheese",
                "extra_comment": "",
                "ingredient": {
                  "id": 168,
                  "display_singular": "shredded cheddar cheese",
                  "updated_at": 1509035282,
                  "name": "shredded cheddar cheese",
                  "created_at": 1493925659,
                  "display_plural": "shredded cheddar cheeses"
                },
                "id": 2133,
                "position": 14,
                "measurements": [
                  {
                    "unit": {
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g",
                      "system": "metric"
                    },
                    "quantity": "200",
                    "id": 544025
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "2",
                    "id": 544024
                  }
                ]
              }
            ],
            "name": null,
            "position": 1
          }
        ],
        "name": "Cheesy Chicken And Broccoli Pasta",
        "updated_at": 1692119618,
        "is_shoppable": true,
        "video_id": 3686,
        "original_video_url": "https://s3.amazonaws.com/video-api-prod/assets/87300f3e07474c63b8d61e2a2696be13/BFV664_CheesyChickenAndBroccoliPasta_FBexport1080sq.mp4",
        "canonical_id": "recipe:208",
        "instructions": [
          {
            "start_time": 0,
            "appliance": null,
            "end_time": 8717,
            "temperature": null,
            "id": 1394,
            "position": 1,
            "display_text": "Heat olive oil on medium heat in a large pot. Add chicken breasts, season with salt and pepper, and allow the chicken to brown on one side."
          },
          {
            "display_text": "Flip chicken, then add onions and garlic as the second side browns.",
            "start_time": 9000,
            "appliance": null,
            "end_time": 15667,
            "temperature": null,
            "id": 1395,
            "position": 2
          },
          {
            "appliance": null,
            "end_time": 20867,
            "temperature": null,
            "id": 10361,
            "position": 3,
            "display_text": "Once the chicken has browned on both sides, add chicken broth, water, and pasta to the pot.",
            "start_time": 16217
          },
          {
            "start_time": 21467,
            "appliance": null,
            "end_time": 27817,
            "temperature": null,
            "id": 1396,
            "position": 4,
            "display_text": "Stir all ingredients, cover the pot with a lid, and bring to a boil. When it begins to boil, uncover and stir. Bring the heat to low, stir, then cover and let simmer for 20 minutes."
          },
          {
            "end_time": 34817,
            "temperature": null,
            "id": 1397,
            "position": 5,
            "display_text": "After 20 minutes has passed, uncover and add in the broccoli. Stir continually as the broccoli steams until the rest of the liquid evaporates.",
            "start_time": 28367,
            "appliance": null
          },
          {
            "display_text": "Add milk and cheddar cheese and stir until the cheese melts and you have a smooth cheese sauce.",
            "start_time": 35067,
            "appliance": null,
            "end_time": 39867,
            "temperature": null,
            "id": 8895,
            "position": 6
          },
          {
            "start_time": 40117,
            "appliance": null,
            "end_time": 46367,
            "temperature": null,
            "id": 8896,
            "position": 7,
            "display_text": "Add salt and pepper (to taste), cayenne, and nutmeg. Stir once more, then you’re ready to serve."
          },
          {
            "display_text": "Enjoy!",
            "start_time": 47050,
            "appliance": null,
            "end_time": 51050,
            "temperature": null,
            "id": 8897,
            "position": 8
          }
        ],
        "servings_noun_singular": "serving",
        "show_id": 17,
        "compilations": [
          {
            "id": 980,
            "beauty_url": null,
            "video_id": 85806,
            "keywords": null,
            "language": "eng",
            "draft_status": "published",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/221532.jpg",
            "approved_at": 1561222828,
            "canonical_id": "compilation:980",
            "slug": "5-delicious-cheesy-pasta-recipes",
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "thumbnail_alt_text": "",
            "name": "5 Delicious Cheesy Pasta Recipes",
            "aspect_ratio": "1:1",
            "created_at": 1560949153,
            "description": null,
            "video_url": "https://vid.tasty.co/output/136445/hls24_1560926789.m3u8",
            "buzz_id": null,
            "promotion": "full",
            "country": "US",
            "is_shoppable": false
          },
          {
            "id": 1326,
            "keywords": null,
            "facebook_posts": [],
            "slug": "5-chicken-dinners-for-every-mood",
            "country": "US",
            "description": null,
            "draft_status": "published",
            "video_url": "https://vid.tasty.co/output/155562/hls24_1576649703.m3u8",
            "approved_at": 1576793236,
            "promotion": "full",
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/247797.jpg",
            "thumbnail_alt_text": "",
            "name": "5 Chicken Dinners For Every Mood",
            "canonical_id": "compilation:1326",
            "beauty_url": null,
            "aspect_ratio": "1:1",
            "created_at": 1576224040,
            "buzz_id": null,
            "video_id": 97287
          },
          {
            "aspect_ratio": "1:1",
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "video_url": "https://vid.tasty.co/output/207974/hls24_1625052715.m3u8",
            "video_id": 133856,
            "country": "US",
            "approved_at": 1626275854,
            "id": 2604,
            "beauty_url": null,
            "thumbnail_alt_text": "",
            "name": "7 Days 7 Pasta Recipes",
            "canonical_id": "compilation:2604",
            "keywords": null,
            "facebook_posts": [],
            "description": "What if you could have pasta for every day of the week? We're here to help you keep it exciting, before you sit down to yet another bowl of Spaghetti and Meatballs. If you need to kick those midweek blues, look no further than our <a href=\"https://tasty.co/recipe/chorizo-tomato-rotini-pasta\">Tomato Basil Sausage Pasta</a>. Want something a little more international? We've got <a href=\"https://tasty.co/recipe/one-pot-swedish-meatball-pasta\">Swedish Meatball Pasta</a> that's delightful. We're here for a never-ending pasta, and, well, you have to join us! ",
            "draft_status": "published",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/329936.jpg",
            "buzz_id": null,
            "slug": "7-days-7-pasta-recipes",
            "promotion": "full",
            "created_at": 1625111822,
            "language": "eng"
          },
          {
            "draft_status": "published",
            "thumbnail_alt_text": "",
            "buzz_id": null,
            "keywords": null,
            "name": "Sagittarius Season Delicacies",
            "promotion": "full",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/412144.jpg",
            "aspect_ratio": "1:1",
            "country": "US",
            "is_shoppable": false,
            "facebook_posts": [],
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "created_at": 1669048166,
            "description": "This one is for all the Sagittarius folks–lively, passionate, and free-spirited–out there! Start your day with the tastiest <a href=\"https://tasty.co/recipe/sausage-egg-breakfast-cups\">Sausage Egg Breakfast Cups</a>! Tantalize your tastebuds with <a href=\"https://tasty.co/recipe/lemon-chicken-spaghetti-squash\">Lemon Chicken Spaghetti Squash</a>. The <a href=\"https://tasty.co/recipe/mozzarella-stuffed-turkey-meatloaf\">Mozzarella-Stuffed Turkey Meatloaf</a> is sure to leave a smile on your face! Happy Sagittarius season, y'all!",
            "video_url": "https://vid.tasty.co/output/263001/hls24_1669048155.m3u8",
            "approved_at": 1669843638,
            "id": 3374,
            "slug": "sagittarius-season-delicacies",
            "language": "eng",
            "canonical_id": "compilation:3374",
            "beauty_url": null,
            "video_id": 174510
          }
        ],
        "tips_and_ratings_enabled": true,
        "total_time_minutes": null,
        "keywords": null,
        "user_ratings": {
          "count_positive": 4304,
          "score": 0.91594,
          "count_negative": 395
        },
        "slug": "cheesy-chicken-and-broccoli-pasta",
        "topics": [
          {
            "slug": "easy-dinner",
            "name": "Easy Dinner"
          },
          {
            "name": "Healthy Eating",
            "slug": "healthy"
          },
          {
            "name": "Kid Friendly",
            "slug": "kid-friendly"
          },
          {
            "name": "Weekend Meal Prep",
            "slug": "meal-prep"
          },
          {
            "name": "One-Pot Recipes",
            "slug": "one-pot"
          },
          {
            "name": "Romantic Dinners",
            "slug": "romantic-dinners"
          },
          {
            "name": "Dinner",
            "slug": "dinner"
          },
          {
            "name": "Pasta",
            "slug": "pasta"
          },
          {
            "name": "American",
            "slug": "american"
          },
          {
            "name": "Italian",
            "slug": "italian"
          }
        ],
        "video_ad_content": "undetermined",
        "created_at": 1493235961,
        "inspired_by_url": null,
        "nutrition_visibility": "auto",
        "language": "eng",
        "price": {
          "consumption_portion": 400,
          "total": 2500,
          "updated_at": "2023-09-13T07:14:28+02:00",
          "portion": 600,
          "consumption_total": 1550
        },
        "tags": [
          {
            "name": "north_american",
            "id": 64444,
            "display_name": "North American",
            "type": "cuisine",
            "root_tag_type": "cuisine"
          },
          {
            "root_tag_type": "cuisine",
            "name": "italian",
            "id": 64453,
            "display_name": "Italian",
            "type": "european"
          },
          {
            "root_tag_type": "cooking_style",
            "name": "comfort_food",
            "id": 64462,
            "display_name": "Comfort Food",
            "type": "cooking_style"
          },
          {
            "root_tag_type": "healthy",
            "name": "healthy",
            "id": 64466,
            "display_name": "Healthy",
            "type": "healthy"
          },
          {
            "name": "easy",
            "id": 64471,
            "display_name": "Easy",
            "type": "difficulty",
            "root_tag_type": "difficulty"
          },
          {
            "root_tag_type": "meal",
            "name": "dinner",
            "id": 64486,
            "display_name": "Dinner",
            "type": "meal"
          },
          {
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "kid_friendly",
            "id": 64488,
            "display_name": "Kid-Friendly"
          },
          {
            "root_tag_type": "meal",
            "name": "weeknight",
            "id": 64505,
            "display_name": "Weeknight",
            "type": "dinner"
          },
          {
            "root_tag_type": "cuisine",
            "name": "fusion",
            "id": 65410,
            "display_name": "Fusion",
            "type": "cuisine"
          },
          {
            "root_tag_type": "appliance",
            "name": "stove_top",
            "id": 65848,
            "display_name": "Stove Top",
            "type": "appliance"
          },
          {
            "root_tag_type": "cooking_style",
            "name": "meal_prep",
            "id": 65853,
            "display_name": "Meal Prep",
            "type": "cooking_style"
          },
          {
            "id": 65855,
            "display_name": "One-Pot or Pan",
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "one_pot_or_pan"
          },
          {
            "display_name": "Pan Fry",
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "pan_fry",
            "id": 65859
          },
          {
            "name": "sauce_pan",
            "id": 1247786,
            "display_name": "Sauce Pan",
            "type": "equipment",
            "root_tag_type": "equipment"
          },
          {
            "id": 1247794,
            "display_name": "Wooden Spoon",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "wooden_spoon"
          },
          {
            "id": 1280501,
            "display_name": "Chef's Knife",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "chefs_knife"
          },
          {
            "root_tag_type": "equipment",
            "name": "cutting_board",
            "id": 1280503,
            "display_name": "Cutting Board",
            "type": "equipment"
          },
          {
            "name": "liquid_measuring_cup",
            "id": 1280506,
            "display_name": "Liquid Measuring Cup",
            "type": "equipment",
            "root_tag_type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "dry_measuring_cups",
            "id": 1280507,
            "display_name": "Dry Measuring Cups",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "measuring_spoons",
            "id": 1280508,
            "display_name": "Measuring Spoons",
            "type": "equipment"
          },
          {
            "root_tag_type": "business_tags",
            "name": "mccormick_easy_dinner",
            "id": 5143247,
            "display_name": "McCormick Easy Dinner",
            "type": "business_tags"
          },
          {
            "root_tag_type": "difficulty",
            "name": "under_45_minutes",
            "id": 8091747,
            "display_name": "Under 45 Minutes",
            "type": "difficulty"
          },
          {
            "type": "difficulty",
            "root_tag_type": "difficulty",
            "name": "under_1_hour",
            "id": 8091748,
            "display_name": "Under 1 Hour"
          },
          {
            "root_tag_type": "healthy",
            "name": "high_protein",
            "id": 8091917,
            "display_name": "High-Protein",
            "type": "healthy"
          },
          {
            "root_tag_type": "healthy",
            "name": "high_fiber",
            "id": 8091920,
            "display_name": "High-Fiber",
            "type": "healthy"
          },
          {
            "root_tag_type": "meal",
            "name": "chicken",
            "id": 9299514,
            "display_name": "Chicken",
            "type": "dinner"
          },
          {
            "display_name": "Pasta",
            "type": "dinner",
            "root_tag_type": "meal",
            "name": "pasta",
            "id": 9299522
          }
        ],
        "nutrition": {
          "fat": 25,
          "calories": 826,
          "sugar": 10,
          "carbohydrates": 99,
          "fiber": 5,
          "updated_at": "2022-10-02T08:11:11+02:00",
          "protein": 52
        },
        "aspect_ratio": "1:1",
        "renditions": [
          {
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/32155/mp4_1280X720/1495125408_00001.png",
            "width": 720,
            "maximum_bit_rate": null,
            "height": 720,
            "file_size": 50136183,
            "url": "https://vid.tasty.co/output/32155/mp4_1280X720/1495125408",
            "duration": 54276,
            "bit_rate": 7390,
            "content_type": "video/mp4",
            "aspect": "square",
            "minimum_bit_rate": null,
            "name": "mp4_720x720"
          },
          {
            "minimum_bit_rate": 276,
            "maximum_bit_rate": 8256,
            "height": 1080,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/32155/1445289064805-h2exzu/1495125408_00001.png",
            "url": "https://vid.tasty.co/output/32155/low_1495125408.m3u8",
            "content_type": "application/vnd.apple.mpegurl",
            "aspect": "square",
            "width": 1080,
            "name": "low",
            "container": "mp4",
            "file_size": null,
            "duration": 54230,
            "bit_rate": null
          },
          {
            "minimum_bit_rate": null,
            "maximum_bit_rate": null,
            "container": "mp4",
            "url": "https://vid.tasty.co/output/32155/mp4_640x640/1495125408",
            "duration": 54276,
            "bit_rate": 7387,
            "content_type": "video/mp4",
            "width": 640,
            "height": 640,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/32155/mp4_640x640/1495125408_00001.png",
            "file_size": 50112165,
            "aspect": "square",
            "name": "mp4_640x640"
          },
          {
            "name": "mp4_720x720",
            "maximum_bit_rate": null,
            "height": 720,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/32155/mp4_720x1280/1495125408_00001.png",
            "file_size": 50210037,
            "aspect": "square",
            "width": 720,
            "minimum_bit_rate": null,
            "container": "mp4",
            "url": "https://vid.tasty.co/output/32155/mp4_720x1280/1495125408",
            "duration": 54276,
            "bit_rate": 7401,
            "content_type": "video/mp4"
          }
        ]
      },
      {
        "price": {
          "consumption_total": 1400,
          "consumption_portion": 250,
          "total": 2450,
          "updated_at": "2023-09-13T07:15:52+02:00",
          "portion": 400
        },
        "show_id": 17,
        "name": "Cozy Chicken And Dumplings",
        "renditions": [
          {
            "aspect": "square",
            "width": 720,
            "maximum_bit_rate": null,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/31882/mp4_1280X720/1495124911_00001.png",
            "file_size": 90894411,
            "bit_rate": 7428,
            "content_type": "video/mp4",
            "name": "mp4_720x720",
            "height": 720,
            "container": "mp4",
            "url": "https://vid.tasty.co/output/31882/mp4_1280X720/1495124911",
            "duration": 97903,
            "minimum_bit_rate": null
          },
          {
            "duration": 97840,
            "bit_rate": null,
            "content_type": "application/vnd.apple.mpegurl",
            "minimum_bit_rate": 277,
            "maximum_bit_rate": 8220,
            "name": "low",
            "height": 1080,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/31882/1445289064805-h2exzu/1495124911_00001.png",
            "file_size": null,
            "url": "https://vid.tasty.co/output/31882/low_1495124911.m3u8",
            "aspect": "square",
            "width": 1080
          },
          {
            "url": "https://vid.tasty.co/output/31882/mp4_640x640/1495124911",
            "bit_rate": 7375,
            "content_type": "video/mp4",
            "name": "mp4_640x640",
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/31882/mp4_640x640/1495124911_00001.png",
            "file_size": 90250542,
            "minimum_bit_rate": null,
            "maximum_bit_rate": null,
            "height": 640,
            "duration": 97903,
            "aspect": "square",
            "width": 640
          },
          {
            "container": "mp4",
            "file_size": 91045727,
            "content_type": "video/mp4",
            "width": 720,
            "minimum_bit_rate": null,
            "name": "mp4_720x720",
            "maximum_bit_rate": null,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/31882/mp4_720x1280/1495124911_00001.png",
            "url": "https://vid.tasty.co/output/31882/mp4_720x1280/1495124911",
            "duration": 97903,
            "bit_rate": 7440,
            "aspect": "square",
            "height": 720
          }
        ],
        "promotion": "full",
        "num_servings": 6,
        "tips_and_ratings_enabled": true,
        "aspect_ratio": "1:1",
        "instructions": [
          {
            "end_time": 10367,
            "temperature": null,
            "id": 3743,
            "position": 1,
            "display_text": "In a 6-quart Dutch oven, heat the vegetable oil over medium-high heat. Add the chicken and cook until browned on both sides. Remove from the pot and set aside.",
            "start_time": 0,
            "appliance": null
          },
          {
            "display_text": "Add carrot and onion and cook until just tender, about 3 minutes.",
            "start_time": 11000,
            "appliance": null,
            "end_time": 13917,
            "temperature": null,
            "id": 3744,
            "position": 2
          },
          {
            "start_time": 15000,
            "appliance": null,
            "end_time": 16750,
            "temperature": null,
            "id": 3745,
            "position": 3,
            "display_text": "Add the garlic and stir for another minute, until fragrant."
          },
          {
            "appliance": null,
            "end_time": 23500,
            "temperature": null,
            "id": 3746,
            "position": 4,
            "display_text": "Reduce the heat to medium-low and add the butter and flour, stirring constantly for 3 minutes to prevent lumps from forming.",
            "start_time": 18000
          },
          {
            "end_time": 27500,
            "temperature": null,
            "id": 3747,
            "position": 5,
            "display_text": "Add the chicken and any accumulated juices back to the pot and stir to coat in the roux.",
            "start_time": 24433,
            "appliance": null
          },
          {
            "position": 6,
            "display_text": "Add the chicken broth, cream, thyme, and bay leaves and bring to a simmer. Once soup is at a simmer, add the frozen peas, cover, and cook for 15 minutes.",
            "start_time": 29000,
            "appliance": null,
            "end_time": 44000,
            "temperature": null,
            "id": 8469
          },
          {
            "id": 3748,
            "position": 7,
            "display_text": "Make the dumplings: In a large bowl, combine the flour, baking powder, salt, pepper, and cream. Stir until mixture comes together into single mass of dough.",
            "start_time": 45000,
            "appliance": null,
            "end_time": 61150,
            "temperature": null
          },
          {
            "appliance": null,
            "end_time": 64816,
            "temperature": null,
            "id": 3749,
            "position": 8,
            "display_text": "Using a large spoon or ice cream scoop, form the dough into small round balls about 1 inch (2 ½ cm) in diameter (the dough should yield 14-16 dumplings).",
            "start_time": 61500
          },
          {
            "temperature": null,
            "id": 3750,
            "position": 9,
            "display_text": "Place the dough balls in the simmering soup (making sure they don’t touch), add the parsley, and cover. Let the soup simmer for 15 minutes, or until the dumplings are cooked through.",
            "start_time": 65817,
            "appliance": null,
            "end_time": 75866
          },
          {
            "appliance": null,
            "end_time": 84700,
            "temperature": null,
            "id": 3751,
            "position": 10,
            "display_text": "Ladle into bowls, giving 1-2 dumplings per serving.",
            "start_time": 76700
          },
          {
            "display_text": "Enjoy!",
            "start_time": 85700,
            "appliance": null,
            "end_time": 87733,
            "temperature": null,
            "id": 3752,
            "position": 11
          }
        ],
        "prep_time_minutes": null,
        "sections": [
          {
            "components": [
              {
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035288,
                  "name": "vegetable oil",
                  "created_at": 1493314628,
                  "display_plural": "vegetable oils",
                  "id": 20,
                  "display_singular": "vegetable oil"
                },
                "id": 6187,
                "position": 2,
                "measurements": [
                  {
                    "unit": {
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp",
                      "system": "imperial"
                    },
                    "quantity": "2",
                    "id": 613769
                  }
                ],
                "raw_text": "2 tablespoons oil"
              },
              {
                "position": 3,
                "measurements": [
                  {
                    "unit": {
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g",
                      "system": "metric",
                      "name": "gram"
                    },
                    "quantity": "905",
                    "id": 613763
                  },
                  {
                    "unit": {
                      "display_singular": "lb",
                      "abbreviation": "lb",
                      "system": "imperial",
                      "name": "pound",
                      "display_plural": "lb"
                    },
                    "quantity": "2",
                    "id": 613762
                  }
                ],
                "raw_text": "2 pounds chicken breasts",
                "extra_comment": "cubed",
                "ingredient": {
                  "updated_at": 1509035287,
                  "name": "boneless, skinless chicken breast",
                  "created_at": 1493390997,
                  "display_plural": "boneless, skinless chicken breasts",
                  "id": 33,
                  "display_singular": "boneless, skinless chicken breast"
                },
                "id": 6188
              },
              {
                "position": 4,
                "measurements": [
                  {
                    "unit": {
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial"
                    },
                    "quantity": "1",
                    "id": 613757
                  }
                ],
                "raw_text": "1 large onion, diced",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1548201954,
                  "name": "diced yellow onion",
                  "created_at": 1548201954,
                  "display_plural": "diced yellow onions",
                  "id": 5051,
                  "display_singular": "diced yellow onion"
                },
                "id": 6189
              },
              {
                "raw_text": "4 carrots, sliced to ¼ in half rings",
                "extra_comment": "",
                "ingredient": {
                  "name": "sliced carrot",
                  "created_at": 1520987448,
                  "display_plural": "sliced carrots",
                  "id": 3856,
                  "display_singular": "sliced carrot",
                  "updated_at": 1520987448
                },
                "id": 6190,
                "position": 5,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "1",
                    "id": 613758
                  }
                ]
              },
              {
                "position": 6,
                "measurements": [
                  {
                    "unit": {
                      "display_singular": "clove",
                      "abbreviation": "clove",
                      "system": "none",
                      "name": "clove",
                      "display_plural": "cloves"
                    },
                    "quantity": "3",
                    "id": 613759
                  }
                ],
                "raw_text": "3 garlic cloves, minced",
                "extra_comment": "minced",
                "ingredient": {
                  "created_at": 1494874431,
                  "display_plural": "garlic cloves",
                  "id": 321,
                  "display_singular": "garlic clove",
                  "updated_at": 1509035270,
                  "name": "garlic cloves"
                },
                "id": 6191
              },
              {
                "measurements": [
                  {
                    "id": 613761,
                    "unit": {
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp"
                    },
                    "quantity": "1"
                  }
                ],
                "raw_text": "1 teaspoon salt",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035288,
                  "name": "salt",
                  "created_at": 1493314644,
                  "display_plural": "salts",
                  "id": 22,
                  "display_singular": "salt"
                },
                "id": 6192,
                "position": 7
              },
              {
                "extra_comment": "",
                "ingredient": {
                  "created_at": 1494806355,
                  "display_plural": "unsalted butters",
                  "id": 291,
                  "display_singular": "unsalted butter",
                  "updated_at": 1509035272,
                  "name": "unsalted butter"
                },
                "id": 6193,
                "position": 8,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "5",
                    "id": 613760
                  }
                ],
                "raw_text": "5 tablespoons unsalted butter"
              },
              {
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035280,
                  "name": "all-purpose flour",
                  "created_at": 1494122348,
                  "display_plural": "all-purpose flours",
                  "id": 185,
                  "display_singular": "all-purpose flour"
                },
                "id": 6194,
                "position": 9,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "6",
                    "id": 613774
                  }
                ],
                "raw_text": "6 tablespoons all-purpose flour"
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "name": "liter",
                      "display_plural": "L",
                      "display_singular": "L",
                      "abbreviation": "L",
                      "system": "metric"
                    },
                    "quantity": "1 ½",
                    "id": 613773
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "6",
                    "id": 613772
                  }
                ],
                "raw_text": "6 cups chicken broth",
                "extra_comment": "",
                "ingredient": {
                  "display_singular": "chicken broth",
                  "updated_at": 1509035278,
                  "name": "chicken broth",
                  "created_at": 1494212911,
                  "display_plural": "chicken broths",
                  "id": 218
                },
                "id": 6195,
                "position": 10
              },
              {
                "raw_text": "½ cup heavy cream",
                "extra_comment": "",
                "ingredient": {
                  "created_at": 1494214054,
                  "display_plural": "heavy creams",
                  "id": 221,
                  "display_singular": "heavy cream",
                  "updated_at": 1509035278,
                  "name": "heavy cream"
                },
                "id": 6196,
                "position": 11,
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL",
                      "abbreviation": "mL"
                    },
                    "quantity": "120",
                    "id": 613767
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "½",
                    "id": 613764
                  }
                ]
              },
              {
                "ingredient": {
                  "updated_at": 1509035286,
                  "name": "dried thyme",
                  "created_at": 1493430190,
                  "display_plural": "dried thymes",
                  "id": 47,
                  "display_singular": "dried thyme"
                },
                "id": 6197,
                "position": 12,
                "measurements": [
                  {
                    "unit": {
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp",
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons"
                    },
                    "quantity": "½",
                    "id": 613766
                  }
                ],
                "raw_text": "½ teaspoons dried thyme",
                "extra_comment": ""
              },
              {
                "ingredient": {
                  "display_singular": "bay leaf",
                  "updated_at": 1509035283,
                  "name": "bay leaf",
                  "created_at": 1493906382,
                  "display_plural": "bay leaves",
                  "id": 153
                },
                "id": 6198,
                "position": 13,
                "measurements": [
                  {
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    },
                    "quantity": "2",
                    "id": 613768
                  }
                ],
                "raw_text": "2 bay leaves",
                "extra_comment": ""
              },
              {
                "position": 14,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "1 ½",
                    "id": 613771
                  },
                  {
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "225",
                    "id": 613770
                  }
                ],
                "raw_text": "1 ½ frozen peas",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1521648268,
                  "name": "frozen peas",
                  "created_at": 1494979735,
                  "display_plural": "frozen peas",
                  "id": 385,
                  "display_singular": "frozen pea"
                },
                "id": 6199
              },
              {
                "ingredient": {
                  "display_singular": "fresh parsley",
                  "updated_at": 1509035283,
                  "name": "fresh parsley",
                  "created_at": 1493906396,
                  "display_plural": "fresh parsleys",
                  "id": 154
                },
                "id": 6200,
                "position": 15,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "4",
                    "id": 613765
                  }
                ],
                "raw_text": "4 tablespoons fresh minced parsley",
                "extra_comment": "minced"
              }
            ],
            "name": "Soup",
            "position": 1
          },
          {
            "components": [
              {
                "raw_text": "2 cups all-purpose flour",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035280,
                  "name": "all-purpose flour",
                  "created_at": 1494122348,
                  "display_plural": "all-purpose flours",
                  "id": 185,
                  "display_singular": "all-purpose flour"
                },
                "id": 6202,
                "position": 17,
                "measurements": [
                  {
                    "unit": {
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g",
                      "system": "metric"
                    },
                    "quantity": "250",
                    "id": 613777
                  },
                  {
                    "unit": {
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup"
                    },
                    "quantity": "2",
                    "id": 613776
                  }
                ]
              },
              {
                "extra_comment": "",
                "ingredient": {
                  "display_plural": "baking powders",
                  "id": 23,
                  "display_singular": "baking powder",
                  "updated_at": 1509035288,
                  "name": "baking powder",
                  "created_at": 1493314647
                },
                "id": 6203,
                "position": 18,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "1",
                    "id": 613779
                  }
                ],
                "raw_text": "1 tablespoon baking powder"
              },
              {
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035288,
                  "name": "salt",
                  "created_at": 1493314644,
                  "display_plural": "salts",
                  "id": 22,
                  "display_singular": "salt"
                },
                "id": 6204,
                "position": 19,
                "measurements": [
                  {
                    "unit": {
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp",
                      "system": "imperial"
                    },
                    "quantity": "½",
                    "id": 613778
                  }
                ],
                "raw_text": "½ teaspoon salt"
              },
              {
                "raw_text": "n/a",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035287,
                  "name": "pepper",
                  "created_at": 1493314935,
                  "display_plural": "peppers",
                  "id": 29,
                  "display_singular": "pepper"
                },
                "id": 50620,
                "position": 20,
                "measurements": [
                  {
                    "quantity": "½",
                    "id": 613775,
                    "unit": {
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp",
                      "system": "imperial",
                      "name": "teaspoon"
                    }
                  }
                ]
              },
              {
                "raw_text": "1 ⅓ cups heavy cream",
                "extra_comment": "",
                "ingredient": {
                  "display_singular": "heavy cream",
                  "updated_at": 1509035278,
                  "name": "heavy cream",
                  "created_at": 1494214054,
                  "display_plural": "heavy creams",
                  "id": 221
                },
                "id": 6205,
                "position": 21,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "mL",
                      "system": "metric",
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL"
                    },
                    "quantity": "320",
                    "id": 613781
                  },
                  {
                    "quantity": "1 ⅓",
                    "id": 613780,
                    "unit": {
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial"
                    }
                  }
                ]
              }
            ],
            "name": "Dumplings",
            "position": 2
          }
        ],
        "brand_id": null,
        "compilations": [
          {
            "name": "6 Soup Recipes",
            "beauty_url": null,
            "is_shoppable": false,
            "facebook_posts": [],
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/198407.jpg",
            "approved_at": 1546803789,
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/121190/hls24_1545446159.m3u8",
            "buzz_id": null,
            "slug": "6-soup-recipes",
            "country": "US",
            "keywords": null,
            "description": null,
            "draft_status": "published",
            "video_id": 72435,
            "aspect_ratio": "1:1",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "language": "eng",
            "promotion": "full",
            "created_at": 1545430068,
            "canonical_id": "compilation:832",
            "id": 832
          },
          {
            "promotion": "full",
            "created_at": 1574930628,
            "thumbnail_alt_text": "",
            "name": "Delicious Soups To Keep You Warm This Season",
            "canonical_id": "compilation:1282",
            "id": 1282,
            "beauty_url": null,
            "slug": "delicious-soups-to-keep-you-warm-this-season",
            "aspect_ratio": "1:1",
            "is_shoppable": false,
            "description": null,
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/245278.jpg",
            "approved_at": 1575428106,
            "draft_status": "published",
            "video_url": "https://vid.tasty.co/output/153180/hls24_1574938646.m3u8",
            "country": "US",
            "keywords": null,
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "buzz_id": null,
            "video_id": 96286
          },
          {
            "facebook_posts": [],
            "created_at": 1574939488,
            "draft_status": "published",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/245283.jpg",
            "video_url": "https://vid.tasty.co/output/153184/hls24_1574941051.m3u8",
            "approved_at": 1575431220,
            "name": "5 Delicious Savoury Dumplings You Need To Try",
            "buzz_id": null,
            "video_id": 96283,
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "beauty_url": null,
            "promotion": "full",
            "description": null,
            "thumbnail_alt_text": "",
            "canonical_id": "compilation:1283",
            "id": 1283,
            "slug": "5-delicious-savoury-dumplings-you-need-to-try",
            "aspect_ratio": "1:1",
            "country": "US",
            "keywords": null,
            "language": "eng"
          },
          {
            "country": "US",
            "is_shoppable": false,
            "draft_status": "published",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/260406.jpg",
            "name": "Easy Homemade Dumpling Recipes",
            "id": 1452,
            "aspect_ratio": "1:1",
            "created_at": 1585635308,
            "language": "eng",
            "video_id": 102516,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "facebook_posts": [],
            "description": null,
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/163829/hls24_1585635365.m3u8",
            "approved_at": 1585759405,
            "canonical_id": "compilation:1452",
            "beauty_url": null,
            "buzz_id": null,
            "keywords": null,
            "promotion": "full",
            "slug": "easy-homemade-dumpling-recipes"
          },
          {
            "aspect_ratio": "1:1",
            "country": "US",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/285302.jpg",
            "video_url": "https://vid.tasty.co/output/180362/hls24_1601474927.m3u8",
            "name": "22 Delicious Dumplings",
            "canonical_id": "compilation:1737",
            "video_id": 113856,
            "created_at": 1601472823,
            "draft_status": "published",
            "beauty_url": null,
            "promotion": "full",
            "is_shoppable": false,
            "keywords": null,
            "facebook_posts": [],
            "description": "Looking for some warm and comforting dumpling recipes this holiday season? Why settle for the same old recipes when you can chose from an assortment of 22! From everyone's favorite <a href=\"https://tasty.co/recipe/gyoza-dumplings\">Gyoza Dumplings</a> to Instagram-worthy <a href=\"https://tasty.co/recipe/baked-apple-pie-dumplings\">Apple Pie Baked Dumplings</a>, these sweet and savory dumplings can be whipped up in no time!",
            "language": "eng",
            "approved_at": 1602597262,
            "thumbnail_alt_text": "",
            "id": 1737,
            "buzz_id": null,
            "slug": "22-delicious-dumplings"
          },
          {
            "aspect_ratio": "1:1",
            "facebook_posts": [],
            "created_at": 1622015398,
            "name": "Chicken Recipes For The Whole Month",
            "country": "US",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/324941.jpg",
            "approved_at": 1622553101,
            "promotion": "full",
            "id": 2463,
            "buzz_id": null,
            "is_shoppable": false,
            "keywords": null,
            "draft_status": "published",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/204707/hls24_1622476632.m3u8",
            "canonical_id": "compilation:2463",
            "slug": "chicken-recipes-for-the-whole-month",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "description": "No one can resist a good piece of finger-lickin' chicken. There are billions of ways to cook it, but if you've found yourself in a chicken rut lately, look no further than what we're about to offer you. Lighten it up with our <a href=\"https://tasty.co/recipe/chicken-veggie-stir-fry\">Chicken and Veggie Stir Fry</a>, or indulge in classic comfort with some <a href=\"https://tasty.co/recipe/cozy-chicken-and-dumplings\">Chicken & Dumplings</a>. Want something fancy and indulgent? We've got a creamy and rich <a href=\"https://tasty.co/recipe/crispy-creamy-chicken-cordon-bleu\">Chicken Cordon Bleu</a> that'll make even Julia Child proud. It's chicken night at your house, and we're inviting ourselves over. ",
            "language": "eng",
            "beauty_url": null,
            "video_id": 132951
          },
          {
            "promotion": "full",
            "description": "We bet there's nothing more tasty than hearty, delicious, homemade chicken. So we're bringing you the perfect set of chicken recipes to make you forget all about that take-out Chicken Parm. Try our scintillating <a href=\"https://tasty.co/recipe/spicy-mango-chicken-wings\"Spicy Mango Chicken Wings</a> and then chase it down with the ultimate comfort food: <a href=\"https://tasty.co/recipe/cozy-chicken-and-dumplings\"Cozy Chicken & Dumplings!</a> Give these hearty homemade recipes a try and tell us: what's your favorite?",
            "video_url": "https://vid.tasty.co/output/204583/hls24_1622441439.m3u8",
            "approved_at": 1624463518,
            "canonical_id": "compilation:2497",
            "buzz_id": null,
            "id": 2497,
            "slug": "chicken-so-good-you-ll-forget-about-takeout",
            "video_id": 131748,
            "country": "US",
            "is_shoppable": false,
            "created_at": 1622450631,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/324354.jpg",
            "thumbnail_alt_text": "",
            "aspect_ratio": "1:1",
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "name": "Chicken So Good You'll Forget About Takeout!",
            "beauty_url": null,
            "keywords": null,
            "draft_status": "published",
            "language": "eng"
          },
          {
            "slug": "30-ways-you-ve-never-eaten-chicken-before",
            "aspect_ratio": "1:1",
            "created_at": 1624700634,
            "description": "Chicken is always a crowd favorite, but we you gotta switch it up! Say goodbye to your plain Jane chicken recipes and taste test our carefully picked recipes. If you are a guac fiend like we are, you will absolutely devour the <a href==\"https://tasty.co/recipe/bacon-guacamole-chicken-bombs\">Bacon Guacamole Chicken Bombs</a> and if you're going the fancy route, the <a href=\"https://tasty.co/recipe/buffalo-chicken-dip\">Buffalo Chicken Dip</a> is a must-have! Don't forget to pick your favorites!",
            "draft_status": "published",
            "approved_at": 1625236072,
            "buzz_id": null,
            "country": "US",
            "keywords": null,
            "thumbnail_alt_text": "",
            "canonical_id": "compilation:2543",
            "beauty_url": null,
            "video_id": 135542,
            "facebook_posts": [],
            "video_url": "https://vid.tasty.co/output/208056/hls24_1625063242.m3u8",
            "id": 2543,
            "promotion": "full",
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/330044.jpg",
            "name": "30 Ways You've Never Eaten Chicken Before "
          },
          {
            "beauty_url": null,
            "buzz_id": null,
            "is_shoppable": false,
            "facebook_posts": [],
            "draft_status": "published",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/345734.jpg",
            "approved_at": 1633618917,
            "name": "25 Amazing Dinners From Tasty",
            "promotion": "full",
            "country": "US",
            "keywords": null,
            "created_at": 1632811993,
            "thumbnail_alt_text": "",
            "canonical_id": "compilation:2862",
            "id": 2862,
            "aspect_ratio": "1:1",
            "description": "Can't decide what to cook for your family? We've got you covered! Here are 25 of the best dinners you can make. Low on time and want to keep it simple? Try our easy <a href=\"https://tasty.co/recipe/simple-veggie-curry\">veggie curry</a>. Or, if you're in the mood to treat everyone to something fancy, make our <a href=\"https://tasty.co/recipe/french-pepper-steak-steak-au-poivre\">French pepper steak</a>. It’s a guaranteed way to impress your dinner table.",
            "language": "eng",
            "video_id": 142634,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "video_url": "https://vid.tasty.co/output/218113/hls24_1633408538.m3u8",
            "slug": "25-amazing-dinners-from-tasty"
          },
          {
            "id": 2949,
            "beauty_url": null,
            "slug": "6-warm-soup-recipes-for-those-cozy-days",
            "is_shoppable": false,
            "keywords": null,
            "created_at": 1635519215,
            "draft_status": "published",
            "language": "eng",
            "promotion": "full",
            "aspect_ratio": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "description": "The temperature is dropping and fall is quickly approaching. Luckily, we've got some soups that'll warm you up from head to toe. Our <a href=\"https://tasty.co/recipe/french-onion-soup\">French onion soup</a> is a classic while our lemongrass and ginger packed <a href=\"https://tasty.co/recipe/tom-yum-soup\">Tom Yum soup</a> will give you an instant immunity boost. Want to take advantage of seasonal ingredients? Try our <a href=\"https://tasty.co/recipe/maple-bacon-sweet-potato-soup\">maple-bacon sweet potato soup</a> or a hearty roasted <a href=\"https://tasty.co/recipe/roasted-butternut-squash-soup\">butternut squash soup</a>. These bowls are worth slurping.",
            "approved_at": 1636473118,
            "buzz_id": null,
            "canonical_id": "compilation:2949",
            "name": "6 Warm Soup Recipes For Those Cozy Days",
            "video_id": 143368,
            "country": "US",
            "facebook_posts": [],
            "thumbnail_url": "https://s3.amazonaws.com/video-api-prod/assets/030a107dfa9c47cfb5864f084470eef5/fb1.jpg",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/221035/hls24_1635518719.m3u8"
          },
          {
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/350115.jpg",
            "video_url": "https://vid.tasty.co/output/221116/hls24_1635535715.m3u8",
            "buzz_id": null,
            "aspect_ratio": "1:1",
            "is_shoppable": false,
            "created_at": 1635534040,
            "description": "Chicken is everyone's favorite protein, no really! Luckily, we've got everything you need to celebrate everything chicken has to offer. If you're a first-time cook, you can definitely do justice to these super easy and hearty <a href=\"https://tasty.co/recipe/cozy-chicken-and-dumplings\">cozy chicken soup dumplings</a>. Get yourself a whole chicken from the grocery store and cookup a <a href=\"https://tasty.co/recipe/peri-peri-chicken-feast\">peri-peri chicken feast</a>, paired with some delectable hummus. If you really want to impress, the <a href=\"https://tasty.co/recipe/crispy-creamy-chicken-cordon-bleu\">chicken cordon bleu</a> will have your friends exclaiming 'Ooh, la la'! ",
            "beauty_url": null,
            "video_id": 143467,
            "id": 2961,
            "slug": "easy-to-hard-chicken-meals",
            "facebook_posts": [],
            "draft_status": "published",
            "thumbnail_alt_text": "Easy To Hard: Chicken Meals",
            "name": "Easy To Hard: Chicken Meals",
            "approved_at": 1637249027,
            "canonical_id": "compilation:2961",
            "promotion": "full",
            "country": "US",
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "language": "eng"
          },
          {
            "draft_status": "published",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/373769.jpg",
            "id": 3122,
            "beauty_url": null,
            "buzz_id": null,
            "aspect_ratio": "1:1",
            "country": "US",
            "is_shoppable": false,
            "slug": "5-homemade-delicious-dumplings",
            "canonical_id": "compilation:3122",
            "promotion": "full",
            "video_id": 155568,
            "facebook_posts": [],
            "approved_at": 1650318357,
            "name": "5 Homemade Delicious Dumplings",
            "video_url": "https://vid.tasty.co/output/236523/hls24_1650180360.m3u8",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1650179513,
            "description": "What's an ultimate comfort food if not some delicious dumplings with a tangy sauce on the side? Try out these amazingly tasty <a href=\"https://tasty.co/recipe/cozy-chicken-and-dumplings\">Cozy Chicken And Dumplings</a>. Want to have some sweet dumplings? Fret not, we've got that covered too. Make some delectable <a href=\"https://tasty.co/recipe/baked-apple-pie-dumplings>Baked Apple Pie Dumplings</a>. Bring out your chopsticks and get eating!",
            "keywords": null,
            "language": "eng",
            "thumbnail_alt_text": "DUMPLINGS FOR ALL!"
          }
        ],
        "description": "It’s the end of yet another long day and well, you’re ready to put your feet up, relax, and tuck into a comforting meal. Delivery might be calling your name, but you’ve got a ton of chicken lying around and with not much else to do, now’s the perfect time to whip up a batch of these simple and cozy chicken and dumplings. Tuck in now. ",
        "draft_status": "published",
        "servings_noun_plural": "servings",
        "original_video_url": "https://s3.amazonaws.com/video-api-prod/assets/f2a9adc84b284082bf232f2a77cfcd83/BFV14186_CozyChickenandDumplings_FINAL_FB_V3.mp4",
        "keywords": "chicken, comfort, dumplings, food, soup, southern, stew",
        "seo_path": "9295813,64486,9299514",
        "video_url": "https://vid.tasty.co/output/31882/low_1495124911.m3u8",
        "yields": "Serves 6",
        "nutrition_visibility": "auto",
        "facebook_posts": [],
        "user_ratings": {
          "score": 0.96845,
          "count_negative": 161,
          "count_positive": 4942
        },
        "id": 612,
        "total_time_minutes": null,
        "approved_at": 1495577210,
        "total_time_tier": null,
        "canonical_id": "recipe:612",
        "brand": null,
        "slug": "cozy-chicken-and-dumplings",
        "inspired_by_url": null,
        "thumbnail_alt_text": "",
        "updated_at": 1692119284,
        "video_id": 8201,
        "tags": [
          {
            "root_tag_type": "cooking_style",
            "name": "comfort_food",
            "id": 64462,
            "display_name": "Comfort Food",
            "type": "cooking_style"
          },
          {
            "root_tag_type": "meal",
            "name": "dinner",
            "id": 64486,
            "display_name": "Dinner",
            "type": "meal"
          },
          {
            "root_tag_type": "meal",
            "name": "weeknight",
            "id": 64505,
            "display_name": "Weeknight",
            "type": "dinner"
          },
          {
            "root_tag_type": "seasonal",
            "name": "fall",
            "id": 64508,
            "display_name": "Fall",
            "type": "seasonal"
          },
          {
            "type": "seasonal",
            "root_tag_type": "seasonal",
            "name": "winter",
            "id": 64511,
            "display_name": "Winter"
          },
          {
            "root_tag_type": "appliance",
            "name": "dutch_oven",
            "id": 65841,
            "display_name": "Dutch Oven",
            "type": "appliance"
          },
          {
            "type": "appliance",
            "root_tag_type": "appliance",
            "name": "stove_top",
            "id": 65848,
            "display_name": "Stove Top"
          },
          {
            "id": 65853,
            "display_name": "Meal Prep",
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "meal_prep"
          },
          {
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "pan_fry",
            "id": 65859,
            "display_name": "Pan Fry"
          },
          {
            "type": "occasion",
            "root_tag_type": "seasonal",
            "name": "special_occasion",
            "id": 188967,
            "display_name": "Special Occasion"
          },
          {
            "name": "ice_cream_scoop",
            "id": 1247772,
            "display_name": "Ice Cream Scoop",
            "type": "equipment",
            "root_tag_type": "equipment"
          },
          {
            "id": 1247775,
            "display_name": "Oven Mitts",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "oven_mitts"
          },
          {
            "name": "pyrex",
            "id": 1247785,
            "display_name": "Pyrex",
            "type": "equipment",
            "root_tag_type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "spatula",
            "id": 1247788,
            "display_name": "Spatula",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "tongs",
            "id": 1247790,
            "display_name": "Tongs",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "chefs_knife",
            "id": 1280501,
            "display_name": "Chef's Knife",
            "type": "equipment"
          },
          {
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "cutting_board",
            "id": 1280503,
            "display_name": "Cutting Board"
          },
          {
            "display_name": "Liquid Measuring Cup",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "liquid_measuring_cup",
            "id": 1280506
          },
          {
            "root_tag_type": "equipment",
            "name": "dry_measuring_cups",
            "id": 1280507,
            "display_name": "Dry Measuring Cups",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "measuring_spoons",
            "id": 1280508,
            "display_name": "Measuring Spoons",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "mixing_bowl",
            "id": 1280510,
            "display_name": "Mixing Bowl",
            "type": "equipment"
          },
          {
            "id": 8091748,
            "display_name": "Under 1 Hour",
            "type": "difficulty",
            "root_tag_type": "difficulty",
            "name": "under_1_hour"
          },
          {
            "display_name": "High-Protein",
            "type": "healthy",
            "root_tag_type": "healthy",
            "name": "high_protein",
            "id": 8091917
          },
          {
            "root_tag_type": "healthy",
            "name": "high_fiber",
            "id": 8091920,
            "display_name": "High-Fiber",
            "type": "healthy"
          },
          {
            "display_name": "Chicken",
            "type": "dinner",
            "root_tag_type": "meal",
            "name": "chicken",
            "id": 9299514
          },
          {
            "root_tag_type": "meal",
            "name": "soups",
            "id": 9299526,
            "display_name": "Soups",
            "type": "dinner"
          }
        ],
        "thumbnail_url": "https://img.buzzfeed.com/video-api-prod/assets/66b0e3ddd9db461c90196060a48b293a/FB_thumb-2.jpg",
        "beauty_url": null,
        "topics": [
          {
            "name": "Fall Recipes",
            "slug": "fall"
          },
          {
            "name": "Weekend Meal Prep",
            "slug": "meal-prep"
          },
          {
            "name": "Romantic Dinners",
            "slug": "romantic-dinners"
          },
          {
            "name": "Winter Recipes",
            "slug": "winter"
          },
          {
            "name": "Dinner",
            "slug": "dinner"
          }
        ],
        "cook_time_minutes": 35,
        "is_one_top": false,
        "video_ad_content": "none",
        "seo_title": "",
        "country": "ZZ",
        "servings_noun_singular": "serving",
        "buzz_id": null,
        "created_at": 1493236030,
        "credits": [
          {
            "name": "Jordan Kenna",
            "type": "internal"
          }
        ],
        "language": "eng",
        "nutrition": {
          "fat": 48,
          "calories": 875,
          "sugar": 9,
          "carbohydrates": 62,
          "fiber": 3,
          "updated_at": "2022-10-02T08:11:42+02:00",
          "protein": 61
        },
        "show": {
          "name": "Tasty",
          "id": 17
        },
        "is_shoppable": true
      },
      {
        "user_ratings": {
          "count_positive": 3715,
          "score": 0.977632,
          "count_negative": 85
        },
        "buzz_id": 4739915,
        "aspect_ratio": "1:1",
        "is_shoppable": true,
        "cook_time_minutes": null,
        "country": "US",
        "updated_at": 1692119435,
        "video_ad_content": "none",
        "yields": "Serves 4 to 6",
        "thumbnail_alt_text": "",
        "show_id": 17,
        "prep_time_minutes": null,
        "tips_and_ratings_enabled": true,
        "video_url": "https://vid.tasty.co/output/31952/low_1495124888.m3u8",
        "renditions": [
          {
            "duration": 42031,
            "aspect": "square",
            "width": 720,
            "minimum_bit_rate": null,
            "maximum_bit_rate": null,
            "height": 720,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/31952/mp4_1280X720/1495124888_00001.png",
            "url": "https://vid.tasty.co/output/31952/mp4_1280X720/1495124888",
            "bit_rate": 7490,
            "content_type": "video/mp4",
            "name": "mp4_720x720",
            "container": "mp4",
            "file_size": 39350075
          },
          {
            "bit_rate": null,
            "content_type": "application/vnd.apple.mpegurl",
            "aspect": "square",
            "width": 1080,
            "minimum_bit_rate": 279,
            "height": 1080,
            "file_size": null,
            "duration": 41984,
            "url": "https://vid.tasty.co/output/31952/low_1495124888.m3u8",
            "name": "low",
            "maximum_bit_rate": 8319,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/31952/1445289064805-h2exzu/1495124888_00001.png"
          },
          {
            "content_type": "video/mp4",
            "name": "mp4_640x640",
            "maximum_bit_rate": null,
            "url": "https://vid.tasty.co/output/31952/mp4_640x640/1495124888",
            "bit_rate": 7506,
            "file_size": 39432382,
            "duration": 42031,
            "aspect": "square",
            "width": 640,
            "minimum_bit_rate": null,
            "height": 640,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/31952/mp4_640x640/1495124888_00001.png"
          },
          {
            "duration": 42031,
            "content_type": "video/mp4",
            "width": 720,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/31952/mp4_720x1280/1495124888_00001.png",
            "file_size": 39378059,
            "bit_rate": 7496,
            "aspect": "square",
            "minimum_bit_rate": null,
            "name": "mp4_720x720",
            "maximum_bit_rate": null,
            "height": 720,
            "container": "mp4",
            "url": "https://vid.tasty.co/output/31952/mp4_720x1280/1495124888"
          }
        ],
        "beauty_url": null,
        "language": "eng",
        "facebook_posts": [],
        "sections": [
          {
            "components": [
              {
                "raw_text": "¼ cup olive oil",
                "extra_comment": "",
                "ingredient": {
                  "display_plural": "olive oils",
                  "id": 4,
                  "display_singular": "olive oil",
                  "updated_at": 1509035290,
                  "name": "olive oil",
                  "created_at": 1493306183
                },
                "id": 4329,
                "position": 1,
                "measurements": [
                  {
                    "unit": {
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial",
                      "name": "cup"
                    },
                    "quantity": "¼",
                    "id": 724915
                  },
                  {
                    "id": 724914,
                    "unit": {
                      "system": "metric",
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL",
                      "abbreviation": "mL"
                    },
                    "quantity": "60"
                  }
                ]
              },
              {
                "raw_text": "1 large onion, chopped",
                "extra_comment": "chopped",
                "ingredient": {
                  "display_plural": "large yellow onions",
                  "id": 2978,
                  "display_singular": "large yellow onion",
                  "updated_at": 1509035097,
                  "name": "large yellow onion",
                  "created_at": 1505000725
                },
                "id": 4330,
                "position": 2,
                "measurements": [
                  {
                    "quantity": "1",
                    "id": 724928,
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    }
                  }
                ]
              },
              {
                "position": 3,
                "measurements": [
                  {
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    },
                    "quantity": "3",
                    "id": 724921
                  }
                ],
                "raw_text": "3 large carrots, sliced",
                "extra_comment": "sliced",
                "ingredient": {
                  "created_at": 1528917795,
                  "display_plural": "large carrots",
                  "id": 4330,
                  "display_singular": "large carrot",
                  "updated_at": 1528917795,
                  "name": "large carrots"
                },
                "id": 4331
              },
              {
                "id": 4332,
                "position": 4,
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "stalk",
                      "system": "none",
                      "name": "stalk",
                      "display_plural": "stalks",
                      "display_singular": "stalk"
                    },
                    "quantity": "4",
                    "id": 724924
                  }
                ],
                "raw_text": "4 stalks celery, chopped",
                "extra_comment": "chopped",
                "ingredient": {
                  "id": 458,
                  "display_singular": "celery",
                  "updated_at": 1509035259,
                  "name": "celery",
                  "created_at": 1495082620,
                  "display_plural": "celeries"
                }
              },
              {
                "extra_comment": "plus more to taste",
                "ingredient": {
                  "created_at": 1493307153,
                  "display_plural": "kosher salts",
                  "id": 11,
                  "display_singular": "kosher salt",
                  "updated_at": 1509035289,
                  "name": "kosher salt"
                },
                "id": 4333,
                "position": 5,
                "measurements": [
                  {
                    "quantity": "1",
                    "id": 724917,
                    "unit": {
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp"
                    }
                  }
                ],
                "raw_text": "Kosher salt and black pepper"
              },
              {
                "raw_text": "n/a",
                "extra_comment": "plus more to taste",
                "ingredient": {
                  "name": "freshly ground black pepper",
                  "created_at": 1493925438,
                  "display_plural": "freshly ground black peppers",
                  "id": 166,
                  "display_singular": "freshly ground black pepper",
                  "updated_at": 1509035282
                },
                "id": 12420,
                "position": 6,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "teaspoon",
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp"
                    },
                    "quantity": "1",
                    "id": 724916
                  }
                ]
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "system": "none",
                      "name": "clove",
                      "display_plural": "cloves",
                      "display_singular": "clove",
                      "abbreviation": "clove"
                    },
                    "quantity": "3",
                    "id": 724919
                  }
                ],
                "raw_text": "3 cloves garlic, chopped",
                "extra_comment": "chopped",
                "ingredient": {
                  "updated_at": 1509035285,
                  "name": "garlic",
                  "created_at": 1493744766,
                  "display_plural": "garlics",
                  "id": 95,
                  "display_singular": "garlic"
                },
                "id": 4334,
                "position": 7
              },
              {
                "extra_comment": "",
                "ingredient": {
                  "display_plural": "chicken broths",
                  "id": 218,
                  "display_singular": "chicken broth",
                  "updated_at": 1509035278,
                  "name": "chicken broth",
                  "created_at": 1494212911
                },
                "id": 4335,
                "position": 8,
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "liter",
                      "display_plural": "L",
                      "display_singular": "L",
                      "abbreviation": "L"
                    },
                    "quantity": "2",
                    "id": 724920
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "8",
                    "id": 724918
                  }
                ],
                "raw_text": "8 cups chicken broth (see recipe above)"
              },
              {
                "id": 4336,
                "position": 9,
                "measurements": [
                  {
                    "id": 724926,
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "225"
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "ounce",
                      "display_plural": "oz",
                      "display_singular": "oz",
                      "abbreviation": "oz"
                    },
                    "quantity": "8",
                    "id": 724925
                  }
                ],
                "raw_text": "8 ounces egg noodles",
                "extra_comment": "",
                "ingredient": {
                  "display_singular": "egg noodle",
                  "updated_at": 1509035220,
                  "name": "egg noodles",
                  "created_at": 1496094406,
                  "display_plural": "egg noodles",
                  "id": 938
                }
              },
              {
                "id": 4337,
                "position": 10,
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "500",
                    "id": 724923
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "4",
                    "id": 724922
                  }
                ],
                "raw_text": "4 to 5 cups coarsely shredded chicken (see recipe above)",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1678317096,
                  "name": "coarsely shredded chicken",
                  "created_at": 1678317096,
                  "display_plural": "coarsely shredded chickens",
                  "id": 10738,
                  "display_singular": "coarsely shredded chicken"
                }
              },
              {
                "extra_comment": "",
                "ingredient": {
                  "id": 4144,
                  "display_singular": "finely chopped fresh parsley",
                  "updated_at": 1527016722,
                  "name": "finely chopped fresh parsley",
                  "created_at": 1527016722,
                  "display_plural": "finely chopped fresh parsleys"
                },
                "id": 4338,
                "position": 11,
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "10",
                    "id": 724930
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "½",
                    "id": 724929
                  }
                ],
                "raw_text": "½ cup chopped fresh parsley"
              },
              {
                "raw_text": "Parmesan, for serving",
                "extra_comment": "for serving",
                "ingredient": {
                  "created_at": 1497741203,
                  "display_plural": "grated parmesan cheeses",
                  "id": 1869,
                  "display_singular": "grated parmesan cheese",
                  "updated_at": 1509035159,
                  "name": "grated parmesan cheese"
                },
                "id": 4339,
                "position": 12,
                "measurements": [
                  {
                    "unit": {
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": "",
                      "system": "none",
                      "name": ""
                    },
                    "quantity": "0",
                    "id": 724927
                  }
                ]
              }
            ],
            "name": null,
            "position": 1
          }
        ],
        "num_servings": 4,
        "show": {
          "name": "Tasty",
          "id": 17
        },
        "thumbnail_url": "https://img.buzzfeed.com/video-api-prod/assets/f4a9b7128a684ee685fcbd2774c1cac9/BFV8580_Classic_Chicken_Noodle_Soup-THUMBNAIL.jpg",
        "servings_noun_plural": "servings",
        "instructions": [
          {
            "temperature": null,
            "id": 2516,
            "position": 1,
            "display_text": "Heat the olive oil in a large soup pot over medium heat until shimmering. Add the onion, carrots, celery, salt, and pepper. Cook, stirring frequently, until the vegetables are very soft, about 15 minutes.",
            "start_time": 0,
            "appliance": null,
            "end_time": 11000
          },
          {
            "display_text": "Add the garlic and cook until fragrant, about 1 minute. Add the stock and bring to a boil.",
            "start_time": 12000,
            "appliance": null,
            "end_time": 18000,
            "temperature": null,
            "id": 9581,
            "position": 2
          },
          {
            "position": 3,
            "display_text": "IF MAKING AHEAD: Do not add the noodles or parsley. Cool and store the soup in an airtight container in the refrigerator for up to 4 days, or in the freezer for up to 2 months. Reheat on the stovetop and add the noodles and parsley just before serving.",
            "start_time": 0,
            "appliance": null,
            "end_time": 0,
            "temperature": null,
            "id": 2518
          },
          {
            "appliance": null,
            "end_time": 24000,
            "temperature": null,
            "id": 2517,
            "position": 4,
            "display_text": "Add the noodles and cook for 6 minutes, then add the chicken and cook for about 2 minutes more, until the noodles are tender and the chicken is warmed through.",
            "start_time": 19000
          },
          {
            "display_text": "Season to taste with more salt and pepper, then stir in the parsley.",
            "start_time": 25000,
            "appliance": null,
            "end_time": 30000,
            "temperature": null,
            "id": 9582,
            "position": 5
          },
          {
            "start_time": 33000,
            "appliance": null,
            "end_time": 38000,
            "temperature": null,
            "id": 9583,
            "position": 6,
            "display_text": "Serve topped with grated Parmesan."
          },
          {
            "temperature": null,
            "id": 9584,
            "position": 7,
            "display_text": "Enjoy!",
            "start_time": 40000,
            "appliance": null,
            "end_time": 42000
          }
        ],
        "price": {
          "total": 2600,
          "updated_at": "2023-09-13T07:12:55+02:00",
          "portion": 650,
          "consumption_total": 1500,
          "consumption_portion": 350
        },
        "id": 441,
        "tags": [
          {
            "display_name": "North American",
            "type": "cuisine",
            "root_tag_type": "cuisine",
            "name": "north_american",
            "id": 64444
          },
          {
            "name": "comfort_food",
            "id": 64462,
            "display_name": "Comfort Food",
            "type": "cooking_style",
            "root_tag_type": "cooking_style"
          },
          {
            "id": 64466,
            "display_name": "Healthy",
            "type": "healthy",
            "root_tag_type": "healthy",
            "name": "healthy"
          },
          {
            "type": "difficulty",
            "root_tag_type": "difficulty",
            "name": "easy",
            "id": 64471,
            "display_name": "Easy"
          },
          {
            "root_tag_type": "meal",
            "name": "brunch",
            "id": 64484,
            "display_name": "Brunch",
            "type": "meal"
          },
          {
            "type": "meal",
            "root_tag_type": "meal",
            "name": "dinner",
            "id": 64486,
            "display_name": "Dinner"
          },
          {
            "display_name": "Kid-Friendly",
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "kid_friendly",
            "id": 64488
          },
          {
            "root_tag_type": "meal",
            "name": "lunch",
            "id": 64489,
            "display_name": "Lunch",
            "type": "meal"
          },
          {
            "root_tag_type": "seasonal",
            "name": "date_night",
            "id": 64500,
            "display_name": "Date Night",
            "type": "occasion"
          },
          {
            "type": "dinner",
            "root_tag_type": "meal",
            "name": "weeknight",
            "id": 64505,
            "display_name": "Weeknight"
          },
          {
            "type": "seasonal",
            "root_tag_type": "seasonal",
            "name": "fall",
            "id": 64508,
            "display_name": "Fall"
          },
          {
            "root_tag_type": "seasonal",
            "name": "winter",
            "id": 64511,
            "display_name": "Winter",
            "type": "seasonal"
          },
          {
            "root_tag_type": "appliance",
            "name": "freezer_friendly",
            "id": 65843,
            "display_name": "Freezer Friendly",
            "type": "appliance"
          },
          {
            "root_tag_type": "appliance",
            "name": "stove_top",
            "id": 65848,
            "display_name": "Stove Top",
            "type": "appliance"
          },
          {
            "id": 65853,
            "display_name": "Meal Prep",
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "meal_prep"
          },
          {
            "root_tag_type": "cooking_style",
            "name": "one_pot_or_pan",
            "id": 65855,
            "display_name": "One-Pot or Pan",
            "type": "cooking_style"
          },
          {
            "root_tag_type": "equipment",
            "name": "sauce_pan",
            "id": 1247786,
            "display_name": "Sauce Pan",
            "type": "equipment"
          },
          {
            "display_name": "Spatula",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "spatula",
            "id": 1247788
          },
          {
            "display_name": "Tongs",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "tongs",
            "id": 1247790
          },
          {
            "root_tag_type": "feature_page",
            "name": "tasty_ewd_healthy",
            "id": 6117476,
            "display_name": "Tasty EWD Healthy",
            "type": "feature_page"
          },
          {
            "id": 6986107,
            "display_name": "McCormick UGC One Pot Others",
            "type": "feature_page",
            "root_tag_type": "feature_page",
            "name": "mccormick_ugc_one_pot_others"
          },
          {
            "root_tag_type": "difficulty",
            "name": "under_1_hour",
            "id": 8091748,
            "display_name": "Under 1 Hour",
            "type": "difficulty"
          },
          {
            "root_tag_type": "healthy",
            "name": "high_protein",
            "id": 8091917,
            "display_name": "High-Protein",
            "type": "healthy"
          },
          {
            "root_tag_type": "healthy",
            "name": "low_sugar",
            "id": 8091918,
            "display_name": "Low-Sugar",
            "type": "healthy"
          },
          {
            "name": "high_fiber",
            "id": 8091920,
            "display_name": "High-Fiber",
            "type": "healthy",
            "root_tag_type": "healthy"
          },
          {
            "root_tag_type": "meal",
            "name": "chicken",
            "id": 9299514,
            "display_name": "Chicken",
            "type": "dinner"
          },
          {
            "id": 9299522,
            "display_name": "Pasta",
            "type": "dinner",
            "root_tag_type": "meal",
            "name": "pasta"
          },
          {
            "id": 9299526,
            "display_name": "Soups",
            "type": "dinner",
            "root_tag_type": "meal",
            "name": "soups"
          }
        ],
        "compilations": [
          {
            "video_url": "https://vid.tasty.co/output/189666/hls24_1608832467.m3u8",
            "beauty_url": null,
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1608824048,
            "language": "eng",
            "thumbnail_alt_text": "",
            "buzz_id": null,
            "slug": "25-soup-recipes",
            "promotion": "full",
            "country": "US",
            "keywords": null,
            "draft_status": "published",
            "name": "25 Soup Recipes",
            "aspect_ratio": "1:1",
            "description": "Winters call for a warm and soothing soup. But, why settle for just one when we’ve curated 25 mouthwatering soup recipes to excite your tastebuds. Start with our crowd-pleasing <a href=\"https://tasty.co/recipe/hearty-chicken-tortilla-soup\">Hearty Chicken Tortilla Soup</a> and gorge your way through the vegan <a href=\"https://tasty.co/recipe/healthy-hearty-black-bean-soup\">Healthy and Hearty Black Bean Soup</a> the next day. ",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/301490.jpg",
            "approved_at": 1609944811,
            "canonical_id": "compilation:2010",
            "id": 2010,
            "video_id": 120093,
            "is_shoppable": false
          },
          {
            "keywords": null,
            "description": "Who says soups are only for when you're sick? We've got the perfect soup recipes for every occasion. Whip up our flavor-packed <a href=\"https://tasty.co/recipe/taco-soup\">Taco Soup</a> for a refreshing punch. Need a delicious soup to start off a fancy dinner party? Test out our favorite, Panera's claim to fame, a cheesy <a href=\"https://tasty.co/recipe/one-pot-broccoli-cheddar-soup\">Broccoli Cheddar</a>! The hardest part? Picking out which soup to try. Try 'em out and choose your favorite! ",
            "aspect_ratio": "16:9",
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1622449907,
            "video_url": "https://vid.tasty.co/output/204607/hls24_1622450047.m3u8",
            "name": "Soups For Every Occasion",
            "promotion": "full",
            "country": "US",
            "is_shoppable": false,
            "thumbnail_alt_text": "",
            "canonical_id": "compilation:2493",
            "buzz_id": null,
            "slug": "soups-for-every-occasion",
            "video_id": 133359,
            "draft_status": "published",
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/324840.jpg",
            "approved_at": 1624392879,
            "id": 2493,
            "beauty_url": null
          },
          {
            "thumbnail_alt_text": "",
            "approved_at": 1625582330,
            "country": "US",
            "created_at": 1625038733,
            "draft_status": "published",
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/329845.jpg",
            "aspect_ratio": "1:1",
            "keywords": null,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "name": "7 Classic Recipes Everyone Must Learn To Cook",
            "canonical_id": "compilation:2572",
            "video_id": 134281,
            "is_shoppable": false,
            "facebook_posts": [],
            "description": "We know cooking is not everyone's jam, but lucky for you, we've got a fix for that. Our curated list of classic recipes will always be a hit in your menu & will definitely never fail to impress. If you're just setting foot in the kitchen, you have to test out the <a href=\"https://tasty.co/recipe/maple-bacon-mashed-potatoes\">Maple Bacon Mashed Potatoes</a>, and for a restaurant-y feel, we've got the <a href=\"https://tasty.co/recipe/classic-party-guacamole\">Classic Party Guacamole</a>! Test these out and tell us: which one was your favorite?",
            "video_url": "https://vid.tasty.co/output/207905/hls24_1625038774.m3u8",
            "slug": "6-classic-recipes-everyone-must-learn-to-cook",
            "id": 2572,
            "beauty_url": null,
            "buzz_id": null,
            "promotion": "full"
          },
          {
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "video_url": "https://vid.tasty.co/output/211655/hls24_1627983790.m3u8",
            "approved_at": 1628005498,
            "name": "30 Recipes To Learn Before You Turn 30",
            "id": 2654,
            "keywords": null,
            "description": "You're in your 20s and faced with the realities of life. One of those harsh ones? The need to feed. Luckily for you, we've got 30 recipes to master before you're 30: the perfect way to feed yourself. Learn how to make a great glaze for your <a href=\"https://tasty.co/recipe/easy-glazed-pork-chops\n\">Pork Chops</a>, how you should cook a <a href=\"https://tasty.co/recipe/steak-with-garlic-butter\">Steak In Garlic Butter</a> just to your liking, or something even simpler: a perfect batch of <a href=\"https://tasty.co/recipe/the-best-chewy-chocolate-chip-cookies\">Cookies</a>. The ball's in your court, and so are the delicious eats. ",
            "draft_status": "published",
            "video_id": 137668,
            "facebook_posts": [],
            "thumbnail_alt_text": "",
            "canonical_id": "compilation:2654",
            "buzz_id": null,
            "aspect_ratio": "1:1",
            "country": "US",
            "is_shoppable": false,
            "created_at": 1627445753,
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/335224.jpg",
            "beauty_url": null,
            "slug": "30-recipes-to-learn-before-you-turn-30",
            "promotion": "full"
          }
        ],
        "created_at": 1493235997,
        "draft_status": "published",
        "is_one_top": false,
        "keywords": null,
        "topics": [
          {
            "name": "Sunday Brunch",
            "slug": "brunch"
          },
          {
            "name": "Easy Dinner",
            "slug": "easy-dinner"
          },
          {
            "name": "Fall Recipes",
            "slug": "fall"
          },
          {
            "name": "Healthy Eating",
            "slug": "healthy"
          },
          {
            "name": "Kid Friendly",
            "slug": "kid-friendly"
          },
          {
            "name": "Weekend Meal Prep",
            "slug": "meal-prep"
          },
          {
            "name": "One-Pot Recipes",
            "slug": "one-pot"
          },
          {
            "name": "Romantic Dinners",
            "slug": "romantic-dinners"
          },
          {
            "name": "Winter Recipes",
            "slug": "winter"
          },
          {
            "name": "Lunch",
            "slug": "lunch"
          },
          {
            "name": "Dinner",
            "slug": "dinner"
          },
          {
            "name": "Pasta",
            "slug": "pasta"
          },
          {
            "name": "American",
            "slug": "american"
          }
        ],
        "brand": null,
        "credits": [
          {
            "name": null,
            "type": "internal"
          }
        ],
        "nutrition_visibility": "auto",
        "brand_id": null,
        "description": "This chicken noodle soup is like a warm hug from the inside out. Loaded with tender chicken, hearty vegetables, and comforting noodles, it's the ultimate comfort food on a chilly day.",
        "seo_title": null,
        "original_video_url": "https://s3.amazonaws.com/video-api-prod/assets/31ffb7f534914a9c9f25e8881b6fbf18/BFV8580_Classic_Chicken_Noodle_Soup-FB1080.mp4",
        "canonical_id": "recipe:441",
        "promotion": "full",
        "video_id": 5907,
        "servings_noun_singular": "serving",
        "slug": "classic-chicken-noodle-soup",
        "nutrition": {
          "fat": 25,
          "calories": 582,
          "sugar": 13,
          "carbohydrates": 42,
          "fiber": 15,
          "updated_at": "2023-08-08T08:11:39+02:00",
          "protein": 65
        },
        "name": "Classic Chicken Noodle Soup",
        "inspired_by_url": null,
        "total_time_minutes": null,
        "approved_at": 1498530219,
        "total_time_tier": null,
        "seo_path": "9295813,64486,9299526"
      },
      {
        "num_servings": 6,
        "buzz_id": 4806469,
        "created_at": 1493236015,
        "inspired_by_url": "http://natashaskitchen.com/2014/10/21/chicken-broccoli-and-mushroom-stir-fry/",
        "nutrition_visibility": "auto",
        "price": {
          "portion": 400,
          "consumption_total": 900,
          "consumption_portion": 150,
          "total": 2400,
          "updated_at": "2023-09-13T07:14:24+02:00"
        },
        "id": 538,
        "prep_time_minutes": 20,
        "approved_at": 1497821212,
        "is_one_top": false,
        "beauty_url": null,
        "seo_title": null,
        "show_id": 17,
        "name": "Chicken & Veggie Stir-Fry",
        "show": {
          "name": "Tasty",
          "id": 17
        },
        "description": "Getting take-out is a crave-worthy indulgence. And with our easy chicken veggie stir fry recipe, you can recreate the magic of a Chinese takeout right in your very own kitchen. Feel free to mix up the protein or vegetables depending on what you have in your fridge. The simple sauce packs a flavor punch that will bring the dish together, no matter what.",
        "country": "US",
        "keywords": null,
        "seo_path": "9295813,64486,9299528",
        "user_ratings": {
          "count_positive": 9333,
          "score": 0.958214,
          "count_negative": 407
        },
        "thumbnail_alt_text": "",
        "total_time_minutes": 32,
        "video_id": 6855,
        "brand": null,
        "compilations": [
          {
            "is_shoppable": false,
            "facebook_posts": [],
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "slug": "6-homemade-chinese-dinners",
            "promotion": "full",
            "buzz_id": null,
            "aspect_ratio": "1:1",
            "created_at": 1525705526,
            "description": "If you’ve been spending half your paycheck on Chinese takeout (we can’t blame you) and want to learn how to cook your own Chinese food, this is where to start. Making <a href=\"https://tasty.co/recipe/general-tsos-chicken\">General Tso’s chicken</a> at home requires a few pantry staples, like rice wine and soy sauce, but the process is actually super simple. And if you want a recipe where you can just throw all the ingredients in a pot and forget about it for a few hours, try this low-effort but high-reward <a href=\"https://tasty.co/recipe/slow-cooker-beef-and-broccoli\">slow cooker beef and broccoli</a>.",
            "thumbnail_url": "https://img.buzzfeed.com/video-api-prod/assets/61b386ce18774c18b408beb39c02c5e7/FBChineseDinners2.jpg",
            "name": "6 Homemade Chinese Dinners",
            "canonical_id": "compilation:556",
            "beauty_url": null,
            "keywords": null,
            "id": 556,
            "video_id": 25589,
            "country": "US",
            "draft_status": "published",
            "language": "eng",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/46832/low_1502323857.m3u8",
            "approved_at": 1525705951
          },
          {
            "is_shoppable": true,
            "name": "Low Calorie Weekday Chicken Recipes",
            "buzz_id": null,
            "slug": "low-calorie-weekday-chicken-recipes",
            "facebook_posts": [],
            "show": [
              {
                "name": "Goodful",
                "id": 34
              }
            ],
            "description": "If you’re watching your calorie intake but still want to enjoy delicious meals, these low-cal weekday chicken dinners are the way to go. Take the <a href=\"https://tasty.co/recipe/hasselback-chicken\">hasselback chicken</a>, which is filled with cheddar and ricotta cheese and proof that you can still be indulgent on a low-calorie diet. For a super low-effort recipe, try the <a href=\"https://tasty.co/recipe/chicken-veggie-stir-fry\">chicken and veggie stir-fry</a>, which you can customize with any veggies you have at home.",
            "draft_status": "published",
            "video_id": 86500,
            "aspect_ratio": "1:1",
            "created_at": 1561717902,
            "language": "eng",
            "video_url": "https://vid.tasty.co/output/137520/hls24_1561713790.m3u8",
            "canonical_id": "compilation:1004",
            "beauty_url": null,
            "promotion": "full",
            "country": "US",
            "keywords": null,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/223177.jpg",
            "thumbnail_alt_text": "",
            "approved_at": 1562178417,
            "id": 1004
          },
          {
            "aspect_ratio": "1:1",
            "facebook_posts": [],
            "language": "eng",
            "thumbnail_alt_text": "",
            "approved_at": 1598883310,
            "id": 1673,
            "buzz_id": null,
            "is_shoppable": false,
            "keywords": null,
            "show": [
              {
                "name": "Goodful",
                "id": 34
              }
            ],
            "description": null,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/280651.jpg",
            "name": "Low Calorie Dinners For The Week ",
            "promotion": "full",
            "created_at": 1598615530,
            "draft_status": "published",
            "canonical_id": "compilation:1673",
            "slug": "low-calorie-dinners-for-the-week",
            "country": "US",
            "video_url": "https://vid.tasty.co/output/177341/hls24_1598616173.m3u8",
            "beauty_url": null,
            "video_id": 110885
          },
          {
            "country": "US",
            "is_shoppable": false,
            "language": "eng",
            "video_url": "https://vid.tasty.co/output/180088/hls24_1601367662.m3u8",
            "video_id": 114007,
            "aspect_ratio": "1:1",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "draft_status": "published",
            "thumbnail_url": "https://s3.amazonaws.com/video-api-prod/assets/d3d82bc9b1f547489de3761ed57b787c/imagebuilder_1600698153033.jpg",
            "keywords": null,
            "name": "Tasty's Favorite Chicken Recipes!",
            "canonical_id": "compilation:1728",
            "beauty_url": null,
            "approved_at": 1602508477,
            "id": 1728,
            "buzz_id": null,
            "slug": "tasty-s-favorite-chicken-recipes",
            "facebook_posts": [],
            "created_at": 1601359971,
            "description": "Everyone loves chicken, and these are the best of our recipes! Pick one from the lot, be it either the <a href=\"https://tasty.co/recipe/one-pot-chicken-chow-mein\">chicken chow mein</a> or the <a href=\"https://tasty.co/recipe/chicken-spanakopita-pie\">feta and spinach stuffed chicken pie</a>. These recipes will delight everyone's taste buds and keep you craving even more. So what are you waiting for? Grab your spice box and let's get cookin' shall we?",
            "thumbnail_alt_text": "",
            "promotion": "full"
          },
          {
            "aspect_ratio": "1:1",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "language": "eng",
            "video_url": "https://vid.tasty.co/output/204707/hls24_1622476632.m3u8",
            "buzz_id": null,
            "video_id": 132951,
            "country": "US",
            "is_shoppable": false,
            "created_at": 1622015398,
            "description": "No one can resist a good piece of finger-lickin' chicken. There are billions of ways to cook it, but if you've found yourself in a chicken rut lately, look no further than what we're about to offer you. Lighten it up with our <a href=\"https://tasty.co/recipe/chicken-veggie-stir-fry\">Chicken and Veggie Stir Fry</a>, or indulge in classic comfort with some <a href=\"https://tasty.co/recipe/cozy-chicken-and-dumplings\">Chicken & Dumplings</a>. Want something fancy and indulgent? We've got a creamy and rich <a href=\"https://tasty.co/recipe/crispy-creamy-chicken-cordon-bleu\">Chicken Cordon Bleu</a> that'll make even Julia Child proud. It's chicken night at your house, and we're inviting ourselves over. ",
            "draft_status": "published",
            "canonical_id": "compilation:2463",
            "keywords": null,
            "thumbnail_alt_text": "",
            "approved_at": 1622553101,
            "promotion": "full",
            "facebook_posts": [],
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/324941.jpg",
            "name": "Chicken Recipes For The Whole Month",
            "id": 2463,
            "beauty_url": null,
            "slug": "chicken-recipes-for-the-whole-month"
          },
          {
            "aspect_ratio": "1:1",
            "country": "US",
            "canonical_id": "compilation:2704",
            "promotion": "full",
            "keywords": null,
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "language": "eng",
            "approved_at": 1628085699,
            "beauty_url": null,
            "description": "It can be hard to find good food on a budget. But don't worry, we can help with that. We're bringing a whole set of ideas to your table: ten recipes under $10, just for you. For a sweet start to your morning, try out our <a href=\"https://tasty.co/recipe/blueberry-banana-pancakes\">Blueberry Banana Pancakes</a>, then whip up a batch of our super-filling <a href=\"https://tasty.co/recipe/chicken-veggie-stir-fry\">Chicken & Veggie Stir Fry</a> for a hearty weeknight meal. The best part? Your wallet's doing a happy dance. ",
            "draft_status": "published",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/334435.jpg",
            "video_url": "https://vid.tasty.co/output/211089/hls24_1627642916.m3u8",
            "name": "10 Recipes Under $10",
            "id": 2704,
            "is_shoppable": false,
            "facebook_posts": [],
            "created_at": 1627642556,
            "thumbnail_alt_text": "",
            "buzz_id": null,
            "slug": "10-recipes-under-10",
            "video_id": 136835
          },
          {
            "facebook_posts": [],
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/216394/hls24_1631879337.m3u8",
            "buzz_id": null,
            "country": "US",
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1631878927,
            "description": null,
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/342984.jpg",
            "language": "eng",
            "name": "Make Healthy Snacks Tasty With These Recipes",
            "id": 2823,
            "beauty_url": null,
            "slug": "make-healthy-snacks-tasty-with-these-recipes",
            "video_id": 141660,
            "aspect_ratio": "1:1",
            "keywords": null,
            "draft_status": "published",
            "approved_at": 1632837818,
            "canonical_id": "compilation:2823",
            "promotion": "full"
          },
          {
            "beauty_url": null,
            "video_id": 142634,
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/345734.jpg",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "created_at": 1632811993,
            "description": "Can't decide what to cook for your family? We've got you covered! Here are 25 of the best dinners you can make. Low on time and want to keep it simple? Try our easy <a href=\"https://tasty.co/recipe/simple-veggie-curry\">veggie curry</a>. Or, if you're in the mood to treat everyone to something fancy, make our <a href=\"https://tasty.co/recipe/french-pepper-steak-steak-au-poivre\">French pepper steak</a>. It’s a guaranteed way to impress your dinner table.",
            "thumbnail_alt_text": "",
            "approved_at": 1633618917,
            "name": "25 Amazing Dinners From Tasty",
            "canonical_id": "compilation:2862",
            "promotion": "full",
            "country": "US",
            "is_shoppable": false,
            "facebook_posts": [],
            "draft_status": "published",
            "video_url": "https://vid.tasty.co/output/218113/hls24_1633408538.m3u8",
            "id": 2862,
            "buzz_id": null,
            "slug": "25-amazing-dinners-from-tasty",
            "aspect_ratio": "1:1",
            "keywords": null
          },
          {
            "approved_at": 1650318383,
            "canonical_id": "compilation:3113",
            "id": 3113,
            "created_at": 1648641192,
            "draft_status": "published",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/372233.jpg",
            "buzz_id": null,
            "video_id": 154599,
            "is_shoppable": false,
            "keywords": null,
            "description": "Time for an adventure! Let's turn back in time to our childhood nostalgia. It's time to revisit the pages of your favorite Famous Five adventures, accompanied by these tasty recipes.  No matter who your favorite character is, we have a recipe for everyone, even for the fans of our favorite dog, Timmy!",
            "video_url": "https://vid.tasty.co/output/235459/hls24_1649125896.m3u8",
            "promotion": "full",
            "aspect_ratio": "1:1",
            "facebook_posts": [],
            "language": "eng",
            "name": "If Famous Five Characters were a Recipe",
            "beauty_url": null,
            "slug": "if-famous-five-characters-were-a-recipe",
            "country": "US",
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "thumbnail_alt_text": ""
          },
          {
            "description": "Do you also get all motivated to cook after binging MasterChef but end up being overwhelmed in the kitchen? Fret no more because we've got you covered! To begin with, try this super easy & delicious <a href=\"https://tasty.co/recipe/3-ingredient-mac-cheese\">3 ingredients Mac & Cheese</a>. And to take it up a notch, this <a href=\"https://tasty.co/recipe/3-ingredient-chili-glazed-salmon\">Chilli glazed salmon</a> would make for a great dinner!",
            "draft_status": "published",
            "name": "Easy Recipes To Make At Home",
            "thumbnail_alt_text": "",
            "video_url": "https://vid.tasty.co/output/239103/hls24_1652362062.m3u8",
            "promotion": "full",
            "video_id": 157006,
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/376922.jpg",
            "id": 3160,
            "slug": "easy-recipes-to-make-at-home",
            "country": "US",
            "keywords": null,
            "approved_at": 1652891876,
            "canonical_id": "compilation:3160",
            "buzz_id": null,
            "aspect_ratio": "1:1",
            "facebook_posts": [],
            "created_at": 1652075681,
            "beauty_url": null
          },
          {
            "created_at": 1652663016,
            "video_url": "https://vid.tasty.co/output/237838/hls24_1651223510.m3u8",
            "approved_at": 1653667704,
            "name": "Recipes To Help Your Summer Body",
            "beauty_url": null,
            "aspect_ratio": "1:1",
            "country": "US",
            "is_shoppable": false,
            "show": [
              {
                "name": "Tasty",
                "id": 17
              }
            ],
            "description": "The season of beaches is here! And we know that a lot of you would be hitting gyms soon. But no worries because we're here to give you a stress-free journey on the dietary front. From easy <a href=\"https://tasty.co/recipe/keto-friendly-flatbread\">Flatbread Chips</a> to some flavorful <a href=\"https://tasty.co/recipe/chicken-veggie-stir-fry\">Chicken & Veggies Stir Fry</a>, summer of surfing just got a whole lot easier and whole lot healthier!",
            "buzz_id": null,
            "video_id": 156427,
            "draft_status": "published",
            "language": "eng",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/375664.jpg",
            "canonical_id": "compilation:3175",
            "id": 3175,
            "slug": "recipes-to-help-your-summer-body",
            "promotion": "full",
            "keywords": null,
            "facebook_posts": [],
            "thumbnail_alt_text": ""
          },
          {
            "video_url": "https://vid.tasty.co/output/280021/hls24_1679654444.m3u8",
            "name": "6 Easy Recipes for Busy Weeknights!",
            "beauty_url": null,
            "country": "US",
            "description": "Are you short on time during the week but still want to enjoy a delicious meal? Look no further! With these easy recipes perfect for busy weeknights, you'll have dinner on the table in no time. Try mouthwatering <a href=\"https://tasty.co/recipe/15-minute-garlic-bread-pizza\">15-Minute Garlic Bread Pizza</a> for a quick and easy dinner, or savor the comforting flavors of <a href=\"https://tasty.co/recipe/easy-chicken-miso-ramen\">Easy Chicken Miso Ramen</a>. These recipes are sure to become go-to favorites in your busy schedule.",
            "thumbnail_url": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/435360.jpg",
            "promotion": "full",
            "language": "eng",
            "thumbnail_alt_text": "",
            "approved_at": 1679934717,
            "created_at": 1679654455,
            "draft_status": "published",
            "canonical_id": "compilation:3540",
            "id": 3540,
            "video_id": 186383,
            "keywords": null,
            "facebook_posts": [],
            "show": [
              {
                "id": 17,
                "name": "Tasty"
              }
            ],
            "slug": "quick-weeknight-recipes",
            "aspect_ratio": "1:1",
            "is_shoppable": false,
            "buzz_id": null
          }
        ],
        "draft_status": "published",
        "credits": [
          {
            "name": "Robin Broadfoot",
            "type": "internal"
          }
        ],
        "servings_noun_plural": "servings",
        "topics": [
          {
            "name": "Easy Dinner",
            "slug": "easy-dinner"
          },
          {
            "name": "Healthy Eating",
            "slug": "healthy"
          },
          {
            "name": "Low Carb Meals",
            "slug": "low-carb-meals"
          },
          {
            "slug": "lunar-new-year",
            "name": "Lunar New Year"
          },
          {
            "name": "One-Pot Recipes",
            "slug": "one-pot"
          },
          {
            "slug": "romantic-dinners",
            "name": "Romantic Dinners"
          },
          {
            "name": "Dinner",
            "slug": "dinner"
          },
          {
            "name": "American",
            "slug": "american"
          },
          {
            "name": "Chinese",
            "slug": "chinese"
          }
        ],
        "language": "eng",
        "slug": "chicken-veggie-stir-fry",
        "sections": [
          {
            "name": null,
            "position": 1,
            "components": [
              {
                "raw_text": "1 pound chicken breast, cubed",
                "extra_comment": "cubed",
                "ingredient": {
                  "created_at": 1493430237,
                  "display_plural": "chicken breasts",
                  "id": 50,
                  "display_singular": "chicken breast",
                  "updated_at": 1509035286,
                  "name": "chicken breast"
                },
                "id": 5312,
                "position": 1,
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "455",
                    "id": 611203
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "pound",
                      "display_plural": "lb",
                      "display_singular": "lb",
                      "abbreviation": "lb"
                    },
                    "quantity": "1",
                    "id": 611202
                  }
                ]
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "",
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": ""
                    },
                    "quantity": "0",
                    "id": 611196
                  }
                ],
                "raw_text": "Salt, to taste",
                "extra_comment": "to taste",
                "ingredient": {
                  "updated_at": 1509035288,
                  "name": "salt",
                  "created_at": 1493314644,
                  "display_plural": "salts",
                  "id": 22,
                  "display_singular": "salt"
                },
                "id": 5313,
                "position": 2
              },
              {
                "raw_text": "Pepper, to taste",
                "extra_comment": "to taste",
                "ingredient": {
                  "updated_at": 1509035287,
                  "name": "pepper",
                  "created_at": 1493314935,
                  "display_plural": "peppers",
                  "id": 29,
                  "display_singular": "pepper"
                },
                "id": 5314,
                "position": 3,
                "measurements": [
                  {
                    "quantity": "0",
                    "id": 611199,
                    "unit": {
                      "system": "none",
                      "name": "",
                      "display_plural": "",
                      "display_singular": "",
                      "abbreviation": ""
                    }
                  }
                ]
              },
              {
                "raw_text": "1 pound broccoli florets",
                "extra_comment": "",
                "ingredient": {
                  "id": 444,
                  "display_singular": "broccoli floret",
                  "updated_at": 1509035260,
                  "name": "broccoli florets",
                  "created_at": 1495072508,
                  "display_plural": "broccoli florets"
                },
                "id": 5315,
                "position": 4,
                "measurements": [
                  {
                    "quantity": "455",
                    "id": 611205,
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    }
                  },
                  {
                    "quantity": "1",
                    "id": 611204,
                    "unit": {
                      "abbreviation": "lb",
                      "system": "imperial",
                      "name": "pound",
                      "display_plural": "lb",
                      "display_singular": "lb"
                    }
                  }
                ]
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "display_singular": "g",
                      "abbreviation": "g",
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g"
                    },
                    "quantity": "225",
                    "id": 611201
                  },
                  {
                    "unit": {
                      "display_plural": "oz",
                      "display_singular": "oz",
                      "abbreviation": "oz",
                      "system": "imperial",
                      "name": "ounce"
                    },
                    "quantity": "8",
                    "id": 611197
                  }
                ],
                "raw_text": "8 ounces mushrooms, sliced",
                "extra_comment": "sliced",
                "ingredient": {
                  "id": 2745,
                  "display_singular": "mushroom",
                  "updated_at": 1509035112,
                  "name": "mushroom",
                  "created_at": 1501603488,
                  "display_plural": "mushrooms"
                },
                "id": 5316,
                "position": 5
              },
              {
                "raw_text": "3 tablespoons oil for frying",
                "extra_comment": "for frying",
                "ingredient": {
                  "name": "oil",
                  "created_at": 1493745145,
                  "display_plural": "oils",
                  "id": 100,
                  "display_singular": "oil",
                  "updated_at": 1509035284
                },
                "id": 5317,
                "position": 6,
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "3",
                    "id": 611195
                  }
                ]
              }
            ]
          },
          {
            "components": [
              {
                "measurements": [
                  {
                    "id": 611198,
                    "unit": {
                      "system": "none",
                      "name": "clove",
                      "display_plural": "cloves",
                      "display_singular": "clove",
                      "abbreviation": "clove"
                    },
                    "quantity": "3"
                  }
                ],
                "raw_text": "3 cloves garlic, minced",
                "extra_comment": "minced",
                "ingredient": {
                  "display_singular": "garlic",
                  "updated_at": 1509035285,
                  "name": "garlic",
                  "created_at": 1493744766,
                  "display_plural": "garlics",
                  "id": 95
                },
                "id": 5319,
                "position": 8
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp"
                    },
                    "quantity": "1",
                    "id": 611209
                  }
                ],
                "raw_text": "1 tablespoon ginger, minced",
                "extra_comment": "minced",
                "ingredient": {
                  "display_singular": "ginger",
                  "updated_at": 1509035274,
                  "name": "ginger",
                  "created_at": 1494789823,
                  "display_plural": "gingers",
                  "id": 273
                },
                "id": 5320,
                "position": 9
              },
              {
                "ingredient": {
                  "updated_at": 1509035260,
                  "name": "sesame oil",
                  "created_at": 1495072290,
                  "display_plural": "sesame oils",
                  "id": 443,
                  "display_singular": "sesame oil"
                },
                "id": 5321,
                "position": 10,
                "measurements": [
                  {
                    "unit": {
                      "display_plural": "teaspoons",
                      "display_singular": "teaspoon",
                      "abbreviation": "tsp",
                      "system": "imperial",
                      "name": "teaspoon"
                    },
                    "quantity": "2",
                    "id": 611212
                  }
                ],
                "raw_text": "2 teaspoons sesame oil",
                "extra_comment": ""
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "abbreviation": "mL",
                      "system": "metric",
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL"
                    },
                    "quantity": "80",
                    "id": 611211
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "⅓",
                    "id": 611208
                  }
                ],
                "raw_text": "⅓ cup reduced sodium soy sauce",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035191,
                  "name": "reduced sodium soy sauce",
                  "created_at": 1496696832,
                  "display_plural": "reduced sodium soy sauces",
                  "id": 1376,
                  "display_singular": "reduced sodium soy sauce"
                },
                "id": 5322,
                "position": 11
              },
              {
                "measurements": [
                  {
                    "quantity": "1",
                    "id": 611207,
                    "unit": {
                      "name": "tablespoon",
                      "display_plural": "tablespoons",
                      "display_singular": "tablespoon",
                      "abbreviation": "tbsp",
                      "system": "imperial"
                    }
                  }
                ],
                "raw_text": "1 tablespoon brown sugar",
                "extra_comment": "",
                "ingredient": {
                  "display_singular": "brown sugar",
                  "updated_at": 1509035289,
                  "name": "brown sugar",
                  "created_at": 1493307081,
                  "display_plural": "brown sugars",
                  "id": 6
                },
                "id": 5323,
                "position": 12
              },
              {
                "id": 5324,
                "position": 13,
                "measurements": [
                  {
                    "id": 611214,
                    "unit": {
                      "name": "milliliter",
                      "display_plural": "mL",
                      "display_singular": "mL",
                      "abbreviation": "mL",
                      "system": "metric"
                    },
                    "quantity": "240"
                  },
                  {
                    "unit": {
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c",
                      "system": "imperial"
                    },
                    "quantity": "1",
                    "id": 611213
                  }
                ],
                "raw_text": "1 cup chicken broth",
                "extra_comment": "",
                "ingredient": {
                  "updated_at": 1509035278,
                  "name": "chicken broth",
                  "created_at": 1494212911,
                  "display_plural": "chicken broths",
                  "id": 218,
                  "display_singular": "chicken broth"
                }
              },
              {
                "measurements": [
                  {
                    "unit": {
                      "system": "metric",
                      "name": "gram",
                      "display_plural": "g",
                      "display_singular": "g",
                      "abbreviation": "g"
                    },
                    "quantity": "30",
                    "id": 611210
                  },
                  {
                    "unit": {
                      "system": "imperial",
                      "name": "cup",
                      "display_plural": "cups",
                      "display_singular": "cup",
                      "abbreviation": "c"
                    },
                    "quantity": "¼",
                    "id": 611206
                  }
                ],
                "raw_text": "¼ cup flour",
                "extra_comment": "",
                "ingredient": {
                  "display_plural": "flours",
                  "id": 25,
                  "display_singular": "flour",
                  "updated_at": 1509035288,
                  "name": "flour",
                  "created_at": 1493314654
                },
                "id": 5325,
                "position": 14
              }
            ],
            "name": "Sauce",
            "position": 2
          }
        ],
        "nutrition": {
          "fiber": 3,
          "updated_at": "2022-10-02T08:11:09+02:00",
          "protein": 28,
          "fat": 11,
          "calories": 272,
          "sugar": 3,
          "carbohydrates": 14
        },
        "video_ad_content": "none",
        "servings_noun_singular": "serving",
        "cook_time_minutes": 12,
        "aspect_ratio": "1:1",
        "thumbnail_url": "https://img.buzzfeed.com/video-api-prod/assets/cf779f07644e43d988e37652a4987d7f/BFV12730_ChickenBroccoliandMushroomStirFry-ThumbTextless1080.jpg",
        "video_url": "https://vid.tasty.co/output/10241/low_1474048903.m3u8",
        "updated_at": 1692119349,
        "facebook_posts": [],
        "brand_id": null,
        "tags": [
          {
            "root_tag_type": "cuisine",
            "name": "north_american",
            "id": 64444,
            "display_name": "North American",
            "type": "cuisine"
          },
          {
            "id": 64448,
            "display_name": "Chinese",
            "type": "asian",
            "root_tag_type": "cuisine",
            "name": "chinese"
          },
          {
            "name": "dairy_free",
            "id": 64463,
            "display_name": "Dairy-Free",
            "type": "dietary",
            "root_tag_type": "dietary"
          },
          {
            "root_tag_type": "healthy",
            "name": "healthy",
            "id": 64466,
            "display_name": "Healthy",
            "type": "healthy"
          },
          {
            "root_tag_type": "healthy",
            "name": "low_carb",
            "id": 64467,
            "display_name": "Low-Carb",
            "type": "healthy"
          },
          {
            "id": 64471,
            "display_name": "Easy",
            "type": "difficulty",
            "root_tag_type": "difficulty",
            "name": "easy"
          },
          {
            "display_name": "Dinner",
            "type": "meal",
            "root_tag_type": "meal",
            "name": "dinner",
            "id": 64486
          },
          {
            "root_tag_type": "meal",
            "name": "weeknight",
            "id": 64505,
            "display_name": "Weeknight",
            "type": "dinner"
          },
          {
            "root_tag_type": "cuisine",
            "name": "fusion",
            "id": 65410,
            "display_name": "Fusion",
            "type": "cuisine"
          },
          {
            "root_tag_type": "appliance",
            "name": "stove_top",
            "id": 65848,
            "display_name": "Stove Top",
            "type": "appliance"
          },
          {
            "name": "wok",
            "id": 65849,
            "display_name": "Wok",
            "type": "appliance",
            "root_tag_type": "appliance"
          },
          {
            "root_tag_type": "cooking_style",
            "name": "one_pot_or_pan",
            "id": 65855,
            "display_name": "One-Pot or Pan",
            "type": "cooking_style"
          },
          {
            "display_name": "Pan Fry",
            "type": "cooking_style",
            "root_tag_type": "cooking_style",
            "name": "pan_fry",
            "id": 65859
          },
          {
            "name": "saute_pan",
            "id": 1247787,
            "display_name": "Saute Pan",
            "type": "equipment",
            "root_tag_type": "equipment"
          },
          {
            "id": 1247794,
            "display_name": "Wooden Spoon",
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "wooden_spoon"
          },
          {
            "root_tag_type": "equipment",
            "name": "chefs_knife",
            "id": 1280501,
            "display_name": "Chef's Knife",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "cutting_board",
            "id": 1280503,
            "display_name": "Cutting Board",
            "type": "equipment"
          },
          {
            "type": "equipment",
            "root_tag_type": "equipment",
            "name": "liquid_measuring_cup",
            "id": 1280506,
            "display_name": "Liquid Measuring Cup"
          },
          {
            "root_tag_type": "equipment",
            "name": "dry_measuring_cups",
            "id": 1280507,
            "display_name": "Dry Measuring Cups",
            "type": "equipment"
          },
          {
            "root_tag_type": "equipment",
            "name": "measuring_spoons",
            "id": 1280508,
            "display_name": "Measuring Spoons",
            "type": "equipment"
          },
          {
            "display_name": "One Top Friendly",
            "type": "business_tags",
            "root_tag_type": "business_tags",
            "name": "one_top_friendly",
            "id": 1691103
          },
          {
            "name": "mccormick_easy_dinner",
            "id": 5143247,
            "display_name": "McCormick Easy Dinner",
            "type": "business_tags",
            "root_tag_type": "business_tags"
          },
          {
            "root_tag_type": "feature_page",
            "name": "tasty_ewd_healthy",
            "id": 6117476,
            "display_name": "Tasty EWD Healthy",
            "type": "feature_page"
          },
          {
            "display_name": "Lunar New Year",
            "type": "holidays",
            "root_tag_type": "seasonal",
            "name": "lunar_new_year",
            "id": 6573766
          },
          {
            "root_tag_type": "feature_page",
            "name": "budget_10",
            "id": 6830248,
            "display_name": "Budget 10",
            "type": "feature_page"
          },
          {
            "id": 8091747,
            "display_name": "Under 45 Minutes",
            "type": "difficulty",
            "root_tag_type": "difficulty",
            "name": "under_45_minutes"
          },
          {
            "root_tag_type": "difficulty",
            "name": "under_1_hour",
            "id": 8091748,
            "display_name": "Under 1 Hour",
            "type": "difficulty"
          },
          {
            "name": "high_protein",
            "id": 8091917,
            "display_name": "High-Protein",
            "type": "healthy",
            "root_tag_type": "healthy"
          },
          {
            "root_tag_type": "healthy",
            "name": "low_sugar",
            "id": 8091918,
            "display_name": "Low-Sugar",
            "type": "healthy"
          },
          {
            "display_name": "Asian",
            "type": "cuisine",
            "root_tag_type": "cuisine",
            "name": "asian",
            "id": 9295873
          },
          {
            "id": 9299514,
            "display_name": "Chicken",
            "type": "dinner",
            "root_tag_type": "meal",
            "name": "chicken"
          },
          {
            "root_tag_type": "meal",
            "name": "stir_fry",
            "id": 9299528,
            "display_name": "Stir Fry",
            "type": "dinner"
          }
        ],
        "tips_and_ratings_enabled": true,
        "total_time_tier": {
          "tier": "under_45_minutes",
          "display_tier": "Under 45 minutes"
        },
        "yields": "Servings: 6",
        "original_video_url": "https://s3.amazonaws.com/video-api-prod/assets/ca0ec11bc23541e897636732a864c3c9/BFV12730_ChickenBroccoliandMushroomStirFry-FB1080SQ.mp4",
        "canonical_id": "recipe:538",
        "is_shoppable": true,
        "instructions": [
          {
            "end_time": 5867,
            "temperature": 350,
            "id": 3065,
            "position": 1,
            "display_text": "In a large pan on medium-high heat, add 1 tablespoon of oil.  Once the oil is hot, add chicken, season with salt and pepper, and sauté until cooked through and browned. Remove cooked chicken from pan and set aside.",
            "start_time": 0,
            "appliance": "stovetop"
          },
          {
            "end_time": 13017,
            "temperature": null,
            "id": 3067,
            "position": 2,
            "display_text": "In the same pan, heat 1 tablespoon of oil and add mushrooms. When the mushrooms start to soften, add broccoli florets and stir-fry until the broccoli is tender. Remove cooked mushrooms and broccoli from the pan and set aside.",
            "start_time": 6566,
            "appliance": null
          },
          {
            "position": 3,
            "display_text": "Add 1 tablespoon of oil to the pan and sauté garlic and ginger until fragrant. Add the remaining sauce ingredients and stir until smooth.",
            "start_time": 13517,
            "appliance": null,
            "end_time": 25767,
            "temperature": null,
            "id": 3068
          },
          {
            "start_time": 26767,
            "appliance": null,
            "end_time": 32467,
            "temperature": null,
            "id": 3069,
            "position": 4,
            "display_text": "Return the chicken and vegetables to the saucy pan, stir until heated through."
          },
          {
            "temperature": null,
            "id": 3070,
            "position": 5,
            "display_text": "Serve with hot rice or noodles.",
            "start_time": 33767,
            "appliance": null,
            "end_time": 34767
          },
          {
            "start_time": 35067,
            "appliance": null,
            "end_time": 37500,
            "temperature": null,
            "id": 3071,
            "position": 6,
            "display_text": "Enjoy!"
          }
        ],
        "renditions": [
          {
            "minimum_bit_rate": null,
            "name": "low",
            "maximum_bit_rate": null,
            "height": 1080,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/10241/1445289064805-h2exzu/1474048903_00001.png",
            "file_size": null,
            "aspect": "square",
            "bit_rate": null,
            "content_type": "application/vnd.apple.mpegurl",
            "width": 1080,
            "container": "mp4",
            "url": "https://vid.tasty.co/output/10241/low_1474048903.m3u8",
            "duration": 0
          },
          {
            "duration": 0,
            "bit_rate": null,
            "aspect": "square",
            "width": 720,
            "minimum_bit_rate": null,
            "height": 720,
            "container": "mp4",
            "file_size": null,
            "url": "https://vid.tasty.co/output/10241/mp4_1280X720/1474048903",
            "content_type": "video/mp4",
            "name": "mp4_720x720",
            "maximum_bit_rate": null,
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/10241/mp4_1280X720/1474048903_00001.png"
          },
          {
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/10241/mp4_640x640/1474048903_00001.png",
            "minimum_bit_rate": null,
            "maximum_bit_rate": null,
            "height": 640,
            "name": "mp4_640x640",
            "file_size": null,
            "url": "https://vid.tasty.co/output/10241/mp4_640x640/1474048903",
            "duration": 0,
            "bit_rate": null,
            "content_type": "video/mp4",
            "aspect": "square",
            "width": 640
          },
          {
            "file_size": null,
            "bit_rate": null,
            "content_type": "video/mp4",
            "name": "mp4_720x720",
            "minimum_bit_rate": null,
            "maximum_bit_rate": null,
            "container": "mp4",
            "poster_url": "https://img.buzzfeed.com/video-transcoder-prod/output/10241/mp4_720x1280/1474048903_00001.png",
            "url": "https://vid.tasty.co/output/10241/mp4_720x1280/1474048903",
            "duration": 0,
            "aspect": "square",
            "width": 720,
            "height": 720
          }
        ],
        "promotion": "full"
      }
    ]
  })
  */
  }
}

