import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const nova = new OpenAI({
  baseURL: 'https://api.nova.amazon.com/v1',
  apiKey: process.env.NOVA_API_KEY,
});

const AGENT_1_ID = process.env.AGENT_1_ID;
const AGENT_2_ID = process.env.AGENT_2_ID;
const AGENT_3_ID = process.env.AGENT_3_ID;
const AGENT_4_ID = process.env.AGENT_4_ID;

function stripCitations(text) {
  // Remove hype-citation tags and markdown links like ([site.com](url))
  return text
    .replace(/\(\[.*?\]\(.*?\)\)/g, '')
    .replace(/\[.*?\]\(https?:\/\/.*?\)/g, '')
    .replace(/<hype-citation[^>]*>.*?<\/hype-citation>/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function getTodayDate() {
  const now = new Date();
  return now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatClaimData(claimData) {
  const {
    name,
    policyNumber,
    incidentDate,
    city,
    state,
    country,
    category,
    description,
    estimatedValue,
    thirdParties,
  } = claimData;

  return `
INSURANCE CLAIM SUBMISSION
===========================

Claimant Name: ${name}
Policy Number: ${policyNumber}
Date of Incident: ${incidentDate}
Incident Location: ${city}, ${state}, ${country}
Claim Category: ${category}
Estimated Loss Value: $${estimatedValue}

Incident Description:
${description}

Third Parties Involved:
${thirdParties || 'None reported'}

Please analyze this claim and extract all relevant information for processing.
`;
}

async function callAgent(agentId, message, imageBase64 = null) {
  const timeout = 120000;

  try {
    let content;

    if (imageBase64) {
      content = [
        {
          type: 'text',
          text: message,
        },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${imageBase64}`,
          },
        },
      ];
    } else {
      content = message;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await nova.chat.completions.create({
      model: agentId,
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
    });

    clearTimeout(timeoutId);

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error(`Error calling agent ${agentId}:`, error);
    throw new Error(`Agent ${agentId} failed: ${error.message}`);
  }
}

app.post('/api/process-claim', async (req, res) => {
  try {
    const { claimData, imageBase64 } = req.body;

    if (!claimData || !imageBase64) {
      return res.status(400).json({
        error: 'Missing required fields: claimData and imageBase64',
      });
    }

    const formattedClaim = formatClaimData(claimData);
    const todayDate = getTodayDate();

    console.log('Processing claim for:', claimData.name);

    let agent1Output;
    try {
      console.log('Calling Agent 1 (Claim Intake)...');
      agent1Output = await callAgent(
        AGENT_1_ID,
        `${formattedClaim}\n\nPlease validate and extract all claim details.`
      );
    } catch (error) {
      console.error('Agent 1 failed:', error);
      return res.status(400).json({ error: `Agent 1 failed: ${error.message}` });
    }

    let agent2Output;
    try {
      console.log('Calling Agent 2 (Damage Analysis)...');
      agent2Output = await callAgent(
        AGENT_2_ID,
        `Claim Details:\n${agent1Output}\n\nPlease analyze the attached damage photo and describe the visible damage, extent of damage, and affected areas.`,
        imageBase64
      );
    } catch (error) {
      console.error('Agent 2 failed:', error);
      return res.status(400).json({ error: `Agent 2 failed: ${error.message}` });
    }

    let agent3Output;
    try {
      console.log('Calling Agent 3 (Cost Research)...');
      const rawAgent3Output = await callAgent(
        AGENT_3_ID,
        `Claim Details:\n${agent1Output}\n\nDamage Assessment:\n${agent2Output}\n\nBased on the location (${claimData.city}, ${claimData.state}), damage type, and current market rates, please research and estimate repair costs. Provide itemized cost breakdown.`
      );
      agent3Output = stripCitations(rawAgent3Output);
    } catch (error) {
      console.error('Agent 3 failed:', error);
      return res.status(400).json({ error: `Agent 3 failed: ${error.message}` });
    }

    let agent4Output;
    try {
      console.log('Calling Agent 4 (Settlement Recommendation)...');
      agent4Output = await callAgent(
        AGENT_4_ID,
        `Today's date is ${todayDate}. You must use this exact date for the SETTLEMENT REPORT DATE field.\n\nClaim Summary:\n${agent1Output}\n\nDamage Assessment:\n${agent2Output}\n\nCost Analysis:\n${agent3Output}\n\nBased on all information provided, please generate a comprehensive settlement recommendation including: 1) Claim validation status, 2) Damage verification against description, 3) Cost justification, 4) Final recommendation (Settlement Recommended, Pending Adjuster Review, Claim Denied), and 5) Any flags or concerns requiring human review.`
      );
    } catch (error) {
      console.error('Agent 4 failed:', error);
      return res.status(400).json({ error: `Agent 4 failed: ${error.message}` });
    }

    console.log('All agents processed successfully');

    res.json({
      agent1: agent1Output,
      agent2: agent2Output,
      agent3: agent3Output,
      agent4: agent4Output,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, claimContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Missing required field: message' });
    }

    const systemContext = claimContext
      ? `You are a helpful ClaimLens assistant. The user has just processed an insurance claim and has questions about their results. Here are the full claim results for context:\n\n${claimContext}\n\nAnswer the user's questions clearly and professionally based on these results.`
      : `You are a helpful ClaimLens assistant. Answer questions about the insurance claims process clearly and professionally.`;

    const response = await nova.chat.completions.create({
      model: 'nova-2-lite-v1',
      messages: [
        { role: 'system', content: systemContext },
        { role: 'user', content: message },
      ],
    });

    const reply = response.choices[0].message.content || '';
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`ClaimLens backend server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});
