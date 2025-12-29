const axios = require('axios');

// Analyze meeting transcript with Claude AI using direct API calls
const analyzeMeeting = async (transcript) => {
  try {
    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not found in environment variables');
      return {
        success: false,
        error: 'API key not configured',
        analysis: {
          summary: 'AI analysis unavailable. Please configure Anthropic API key.',
          actionItems: [],
          keyDecisions: [],
          importantDates: [],
          tags: ['meeting']
        }
      };
    }

    const prompt = `Analyze this meeting transcript and extract the following information in JSON format:

1. A concise summary (2-3 sentences)
2. Action items with description, assigned person, and priority (High/Medium/Low)
3. Key decisions made
4. Important dates mentioned
5. Suggested tags (3-5 relevant tags)

Meeting Transcript:
${transcript}

Please respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "summary": "string",
  "actionItems": [
    {
      "description": "string",
      "assignedTo": "string",
      "priority": "High|Medium|Low"
    }
  ],
  "keyDecisions": ["string"],
  "importantDates": ["string"],
  "tags": ["string"]
}`;

    console.log('Calling Claude API with axios...');
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      }
    );

    console.log('Claude API responded successfully');

    // Extract the response text
    let responseText = response.data.content[0].text;
    
    // Remove markdown code blocks if present (```json ... ```)
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('Parsing JSON response...');
    
    // Parse JSON response
    const analysis = JSON.parse(responseText);

    console.log('Analysis complete!');

    return {
      success: true,
      analysis
    };
  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
    return {
      success: false,
      error: error.message,
      // Return default structure if AI fails
      analysis: {
        summary: 'Analysis unavailable. Please try again.',
        actionItems: [],
        keyDecisions: [],
        importantDates: [],
        tags: ['meeting']
      }
    };
  }
};

module.exports = { analyzeMeeting };