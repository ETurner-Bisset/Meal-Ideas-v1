const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const path = require('path');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const date = new Date().getFullYear();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(`${__dirname}/public`));

app.get('/', async (req, res) => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'https://www.themealdb.com/api/json/v1/1/random.php',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    res.status(200).render('home', {
      ingredient: _.capitalize('random'),
      date,
      recipes: result.data.meals,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post('/ideas', async (req, res) => {
  const ingredient = req.body.ingredient;
  if (ingredient !== '') {
    try {
      const result = await axios({
        method: 'POST',
        url: `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      res.status(200).render('home', {
        ingredient: _.capitalize(ingredient),
        date,
        recipes: result.data.meals,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.redirect('/');
  }
});

app.get('/:s', async (req, res) => {
  try {
    const name = req.params.s;
    const result = await axios({
      method: 'GET',
      url: `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    // console.log(result.data.meals[0]);
    let ingredientArray = [];
    let quantityArray = [];
    Object.entries(result.data.meals[0]).filter((item) => {
      if (item[0].startsWith('strIngredient') && item[1] !== '' && item[1]) {
        ingredientArray.push(item[1]);
      }
      if (item[0].startsWith('strMeasure') && item[1] !== '' && item[1]) {
        quantityArray.push(item[1]);
      }
    });
    let mixedArray = ingredientArray.map((x, i) => {
      return [x, quantityArray[i]];
    });
    res.status(200).render('recipe', {
      meal: result.data.meals[0].strMeal,
      date,
      recipe: result.data.meals[0],
      mixedArray,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
