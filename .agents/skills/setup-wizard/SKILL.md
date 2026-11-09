---
name: setup-wizard
description: >-
  Interactive bash setup wizard and human-in-the-loop task generator. Generates guided shell scripts for human-only steps (cloud provisioning, credential generation, secret insertion, browser-based OAuth), recording choices to memory decisions. Use for setup workflows requiring user intervention. Triggers: $setup-wizard, setup-wizard:, 'run setup wizard', 'interactive setup'.
metadata:
  category: architecture
---
# Setup Wizard

**ANNOUNCE:** "Reading `setup-wizard` — generating an interactive wizard for human-only steps."

The wizard is for steps that require a human. If an agent can do it — an agent should do it.

---

## When to Generate a Wizard

Generate a wizard when the setup requires:
- Logging into a web dashboard (GitHub, AWS console, Vercel, etc.)
- Entering secrets or credentials the agent doesn't have
- Clicking through UI flows in a third-party service
- Making decisions that require human judgment (billing, legal, compliance)
- Running a migration that is irreversible and needs human sign-off

---

## Wizard Format

```bash
#!/usr/bin/env bash
set -euo pipefail

# Colors for output
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

info() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
prompt() { echo -e "${YELLOW}[ACTION]${NC} $1"; }

# Step 1
info "Step 1 of N: [What this step sets up]"
echo ""
prompt "1. Go to [URL]"
prompt "2. Click [specific button or menu item]"
prompt "3. Copy the value from [specific field]"
echo ""
read -p "Paste the value here: " VALUE_NAME
[[ -z "$VALUE_NAME" ]] && error "[Value name] cannot be empty"
echo "export VALUE_NAME='$VALUE_NAME'" >> .env.local
info "✓ [Value name] saved"
echo ""

# Step 2
info "Step 2 of N: [What this step sets up]"
...

info "Setup complete. Run [next command] to continue."
```

---

## Wizard Design Rules

- Every step says what to do in exact terms — not "configure the webhook" but "click the Webhooks tab, then New Webhook, then paste [URL] in the Endpoint URL field"
- Every step validates what was entered — empty is always an error
- Every step confirms success before moving to the next
- The wizard is idempotent — safe to run again if interrupted
- Secrets are written to `.env.local`, never echoed to the terminal after entry

---

## After the Wizard

After the wizard runs, the agent should:
1. Verify the setup by testing with a known input
2. Document what was configured in `.agents/memory/decisions.md`
3. List what to do if the setup needs to be reversed

