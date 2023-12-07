var express = require('express');
var router = express.Router();
const rp = require('request-promise');
const { response } = require('../app');
const Openai = require('openai')
var mongoose = require('mongoose');
const removeTags = (text) => {
    return text
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<[^>]+>/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  };
  const websiteSchema = new mongoose.Schema({
    url: { type: String },
    description: { type: String },
    language: { type: String }, // Add this line
  });
  
  const roasted = mongoose.model('roasted', websiteSchema);
 

router.post('/', async function(req, res) {
  console.log(req.body);
  const url = req.body.url;
  const lang = req.body.language;
  try {
    // Check if the website is already in the database for the specific language
    const existingWebsite = await roasted.findOne({ url: url, language: lang });
    if (existingWebsite) {
      // Website exists for the specific language, use the stored description
      console.log('Website found in the database:', existingWebsite.description);
      res.send({ roast: existingWebsite.description });
    } else {
      
      console.log(req.body.language);
      const url = req.body.url;
      const lang = req.body.language;
      const rpResponse = await rp(url);
 
      const parsedText= removeTags(rpResponse);
      const openai = new Openai({apiKey:process.env.OPENAI_KEY})

      completion = await openai.chat.completions.create({
      max_tokens:1024,
      model:"gpt-3.5-turbo",
      messages:[
      {"role": "system", "content": `This is the content of the website of a company , roast it in a few sentences(3-4) to make fun of ot. Give me the result in ${lang}`},
      {"role": "user", "content": parsedText}
     ],
  });
    const roast = completion.choices[0].message.content;
      console.log(roast)
      console.log(url)
      // Save the website information to MongoDB with the specified language
      const newWebsite = new roasted({ url:url, description: roast, language: lang });
      await newWebsite.save();

      console.log('Website not found in the database for the specific language, stored description:', roast);
      res.send({ roast });
    }
  } catch (error) {
    console.error('Error processing the request:', error.message);
    res.status(500).send({ error: 'Internal server error' });
  }
});
  
  module.exports = router;
  