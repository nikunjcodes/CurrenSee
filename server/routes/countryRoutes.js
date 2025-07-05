import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();
const MONGODB_URL = 'mongodb+srv://Ayush-yadav:ayush04@cluster0.kfhbvrm.mongodb.net/countries';

// Search countries
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ countries: [] });
    }

    const client = new MongoClient(MONGODB_URL);
    await client.connect();
    
    const db = client.db('countries');
    const collection = db.collection('countries');
    
    const countries = await collection
      .find({ 
        name: { $regex: q, $options: 'i' } 
      })
      .limit(10)
      .toArray();
    
    await client.close();
    
    const countryNames = countries.map(country => country.name);
    res.json({ countries: countryNames });
    
  } catch (error) {
    console.error('Country search error:', error);
    res.status(500).json({ error: 'Failed to search countries' });
  }
});

// Search cities by country
router.get('/cities/search', async (req, res) => {
  try {
    const { country, q } = req.query;
    
    if (!country || !q || q.length < 2) {
      return res.json({ cities: [] });
    }

    const client = new MongoClient(MONGODB_URL);
    await client.connect();
    
    const db = client.db('countries');
    const collection = db.collection('cities');
    
    const cities = await collection
      .find({ 
        country: { $regex: country, $options: 'i' },
        name: { $regex: q, $options: 'i' } 
      })
      .limit(10)
      .toArray();
    
    await client.close();
    
    const cityNames = cities.map(city => city.name);
    res.json({ cities: cityNames });
    
  } catch (error) {
    console.error('City search error:', error);
    res.status(500).json({ error: 'Failed to search cities' });
  }
});

// Get country by city
router.get('/cities/country', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.json({ country: null });
    }

    const client = new MongoClient(MONGODB_URL);
    await client.connect();
    
    const db = client.db('countries');
    const collection = db.collection('cities');
    
    const cityData = await collection.findOne({ 
      name: { $regex: city, $options: 'i' } 
    });
    
    await client.close();
    
    res.json({ country: cityData ? cityData.country : null });
    
  } catch (error) {
    console.error('Get country by city error:', error);
    res.status(500).json({ error: 'Failed to get country by city' });
  }
});

export default router; 