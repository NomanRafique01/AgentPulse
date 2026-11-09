---
name: mcp-builder
description: >-
  Model Context Protocol (MCP) server architect and implementer. Builds FastMCP/stdio MCP servers exposing tools, resources, and prompts to connect LLM agents to external APIs, databases, and local systems. Use when building or testing MCP servers. Triggers: $mcp-builder, build-mcp:, 'mcp builder', 'create mcp server'.
metadata:
  category: backend
---
# MCP Builder

**ANNOUNCE:** "Reading `mcp-builder` — designing and implementing an MCP server."

---

## What an MCP Server Is

An MCP server exposes tools that an LLM agent can call to interact with external systems — APIs, databases, file systems, services. The LLM sees the tool's name, description, and parameters. The server executes the call and returns results.

---

## Tool Design Principles

**One tool, one responsibility.** A tool that does three things is three tools.

**Names are verbs.** `get_user`, `create_project`, `search_files` — not `user`, `project`, `files`.

**Parameters are minimal.** If the user never needs to specify it, don't expose it as a parameter. Use sensible defaults.

**Descriptions are written for the LLM.** The LLM reads the description to decide when to call the tool. Write it as a precise trigger condition:
- Good: "Get a user's profile by their user ID. Call when you need a user's name, email, or role."
- Bad: "Gets user information."

**Return structured data.** Return JSON objects with clear field names. Never return raw strings that need parsing.

**Return errors as errors.** Don't return `{ success: false, error: "..." }` — throw the error. The MCP protocol handles error propagation.

---

## Python Implementation (FastMCP)

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("service-name")

@mcp.tool()
async def get_user(user_id: str) -> dict:
    """Get a user's profile by their user ID.
    Call when you need a user's name, email, avatar, or role.
    Raises an error if the user does not exist."""
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise ValueError(f"User {user_id} not found")
    return {
        "id": user["_id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"]
    }
```

---

## TypeScript Implementation (MCP SDK)

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "service-name", version: "1.0.0" });

server.tool(
  "get_user",
  "Get a user's profile by their user ID. Call when you need a user's name, email, or role.",
  { user_id: z.string().describe("The user's unique identifier") },
  async ({ user_id }) => {
    const user = await db.users.findById(user_id);
    if (!user) throw new Error(`User ${user_id} not found`);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ id: user.id, name: user.name, email: user.email })
      }]
    };
  }
);
```

---

## Testing MCP Servers

Test each tool with:
1. Valid input → correct output
2. Missing required parameter → clear error
3. Non-existent resource → clear "not found" error
4. External service unavailable → clear error with retry guidance
5. Large response → ensure it fits within context limits

Use the MCP inspector for manual testing:
```bash
npx @modelcontextprotocol/inspector python server.py
```

---

## Common Mistakes

- **Too many parameters:** If a tool has more than 5 parameters, split it into multiple tools
- **Vague tool descriptions:** The LLM picks the wrong tool when the description is ambiguous
- **Silent errors:** Always surface errors — never swallow exceptions
- **Non-deterministic tools:** Tools that return different results for the same input confuse the LLM
- **Side-effecting read tools:** A "get" tool should never write — separate reads and writes

