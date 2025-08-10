Full Stack Developer Evaluation Task
WhatsApp Web Clone
Your mission If you choose to accept, is to build a WhatsApp Web – like chat interface that displays
real-time WhatsApp conversations using webhook data. The interface should mimic WhatsApp Web,
show chats neatly, and support sending new messages (for storage only – no external sending).
You Will Need to:
• Set up a MongoDB Cluster (preferably MongoDB Atlas)
• Create server-side APIs in Node.js or Python to process payloads and serve data
• Build a responsive, mobile-friendly frontend that looks and behaves like WhatsApp Web
• Host your application on a public URL (e.g., using Vercel, Render, Heroku, or your own server)
 Task 1: Webhook Payload Processor
• Here is a zip file with sample payloads (JSON files) that simulate WhatsApp Business API
webhooks:
Download It here: https://drive.google.com/file/d/1pWZ9HaHLza8k080pP_GhvKIl8j2voyU/view?usp=sharing
• Write a script to:
o Read these payloads
o Insert new messages into the MongoDB collection:
Database: whatsapp
Collection: processed_messages
o Use the status payloads (sent, delivered, read) to update the status of each
corresponding message using the id or meta_msg_id field
 Task 2: WhatsApp Web–Like Interface
• Create a frontend UI similar to WhatsApp Web
• Show all conversations grouped by user (wa_id)
• Clicking a chat should show:
o All message bubbles with date time
o Status indicators (sent, delivered, read)
o Basic user info (name and number)
• Design should be:
o Clean
o Responsive
o Easy to use on mobile and desktop
 Task 3: Send Message (Demo)
• Add a “Send Message” input box like WhatsApp Web
• On submit, the message should:
o Show up in the conversation UI
o Be saved to the database (processed_messages)
o No message will actually be sent outside the platform
 Task 4: Deployment
Host the complete app on a public URL You may use: Vercel, Render, Heroku, Or any other hosting
provider
• Do not submit code-only repositories or localhost URLs
• Demo must be accessible publicly without setup
 Bonus Task: Real-Time Interface Using WebSocket (Not Mandatory)
Simulate real-time message updates using WebSocket (e.g., Socket.IO). Your frontend should
automatically reflect new messages and status updates as they are inserted or updated in the
database, without requiring a manual refresh.
 Evaluation Criteria
• Closeness of your app UI to WhatsApp web
• Responsiveness on mobile devices
• Thoughtful assumptions and attention to detail
• A well-structured backend
• Responsiveness and mobile friendliness
Submission Instructions:
Submit ONLY using the MakeList Form here. Submissions via email or internshala chat won’t be
evaluated.
Requirements
• Submit only if you're:
o Based in India
o Not a student, intern, or part-time applicant
• Final Submission Must Include:
▪ Public URL to the running app
▪ (Optional) GitHub repo or documentation
NOTES
• No real WhatsApp messages will be sent. This is a frontend + backend simulation for webhook
data processing and display.
• Use of AI based code generation is acceptable as long as you are able to explain it
