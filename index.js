import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

const server = new McpServer({
  name: "StudyMate MCP Server",
  version: "1.0.0",
});

server.tool(
  "list_notes",
  "Returns all study notes currently saved in the database",
  {},
  async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`);
      const notes = await response.json();
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(notes, null, 2),
          }
        ]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching notes: ${error.message}` }]
      };
    }
  }
);

server.tool(
  "create_note",
  "Creates a new study note",
  {
    title: z.string().describe("The title of the note"),
    subject: z.string().describe("The subject of the note (e.g. History, Math)"),
    content: z.string().describe("The detailed content of the note"),
  },
  async ({ title, subject, content }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, subject, content }),
      });
      
      const newNote = await response.json();
      
      return {
        content: [
          {
            type: "text",
            text: `Note created successfully: ${JSON.stringify(newNote, null, 2)}`,
          }
        ]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating note: ${error.message}` }]
      };
    }
  }
);

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch(console.error);
