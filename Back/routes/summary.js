var express = require('express');
var router = express.Router();
const rp = require('request-promise');
const Openai = require ("openai");
var mongoose = require('mongoose');
const { response } = require('../app');
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

const Website = mongoose.model('Website', websiteSchema);

router.post('/', async function (req, res) {
  console.log(req.body);
  const url = req.body.url;
  const lang = req.body.language;


  try {
    // Check if the website is already in the database for the specific language
    const existingWebsite = await Website.findOne({ url: url, language: lang });

    if (existingWebsite) {
      // Website exists for the specific language, use the stored description
      console.log('Website found in the database:', existingWebsite.description);
      res.send({ summary: existingWebsite.description });
    } else {
      // Website not in the database for the specific language, fetch the website content
      const rpResponse = await rp(url);
      const parsedText = removeTags(rpResponse);
      const openai = new Openai({apiKey:process.env.OPENAI_KEY})
      // Use OpenAI to get the summary
      const completion = await openai.chat.completions.create({
        max_tokens: 1024,
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": `This is the content of the website of a company, summarize it in a few sentences (3-4) so that we know what they do. I need you to give me your summary in ${lang}`},
          { "role": "user", "content": parsedText },
        ],
      });
      
      const summary = completion.choices[0].message.content;
      console.log(completion.choices[0].message.content)
      // Save the website information to MongoDB with the specified language
      const newWebsite = new Website({ url:url, description: summary, language: lang });
      await newWebsite.save();

      console.log('Website not found in the database for the specific language, stored description:', summary);
      res.send({ summary });
    }
  } catch (error) {
    console.error('Error processing the request:', error.message);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;