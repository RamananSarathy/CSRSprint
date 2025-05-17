import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Routes
app.get('/', (req, res) => {
  res.send('CSRSprint API is running');
});

// AI Assistant endpoints
app.post('/api/ai/generate-idea', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in corporate social responsibility (CSR) initiatives. Generate creative and impactful CSR event ideas that align with sustainable development goals."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
    });
    
    res.json({ 
      text: completion.choices[0].message.content,
      type: 'idea'
    });
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({ error: 'Error generating content' });
  }
});

app.post('/api/ai/generate-summary', async (req, res) => {
  try {
    const { eventId } = req.body;
    
    // Fetch event data from Supabase
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Fetch tasks related to the event
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('event_id', eventId);
    
    // Fetch impact metrics related to the event
    const { data: impact } = await supabase
      .from('impact_metrics')
      .select('*')
      .eq('event_id', eventId)
      .single();
    
    // Create a prompt with the event data
    const prompt = `
      Please create a professional summary of this CSR event:
      
      Event Name: ${event.title}
      Date: ${new Date(event.start_date).toLocaleDateString()} to ${new Date(event.end_date).toLocaleDateString()}
      Location: ${event.location}
      
      Description: ${event.description}
      
      ${tasks ? `Number of Tasks: ${tasks.length}` : ''}
      ${impact ? `Impact: 
      - CO2 Saved: ${impact.co2_saved} kg
      - Volunteer Hours: ${impact.volunteer_hours} hours
      - People Reached: ${impact.people_reached} people` : ''}
    `;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in corporate social responsibility reporting. Create professional, concise summaries of CSR events highlighting key achievements and impact."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
    });
    
    res.json({ 
      text: completion.choices[0].message.content,
      type: 'summary'
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Error generating summary' });
  }
});

// Volunteer matching endpoint
app.post('/api/volunteers/match', async (req, res) => {
  try {
    const { skills, location, dates } = req.body;
    
    // Query volunteers based on skills, location, and availability
    let query = supabase
      .from('volunteers')
      .select('*');
    
    // Filter by skills if provided
    if (skills && skills.length > 0) {
      query = query.contains('skills', skills);
    }
    
    // Filter by location if provided
    if (location) {
      query = query.eq('location', location);
    }
    
    // Filter by availability if provided
    if (dates && dates.length > 0) {
      query = query.overlaps('availability', dates);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({ volunteers: data });
  } catch (error) {
    console.error('Error matching volunteers:', error);
    res.status(500).json({ error: 'Error matching volunteers' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});