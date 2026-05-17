Before we start building, make sure my environment is ready:

1. Check if Claude Code is installed (run: claude --version). If not, install it.
2. Check if Salesforce CLI is installed (run: sf --version). If not, install it (run: brew install sf).
3. Authenticate my org:
sf org login web --instance-url https://dfj00000ncwb3eal-dev-ed.develop.my.salesforce.com --set-default
4. Install Agentforce ADLC skills for Claude Code:
curl -sSL https://raw.githubusercontent.com/SalesforceAIResearch/agentforce-adlc/main/tools/install.sh | bash

Once the environment is ready:

Before anything else, verify prerequisites are installed:

1. Check SF CLI: `sf --version`
   If not found, install it: `brew install sf`
   If found, update it: `sf update`
2. Check agentforce-adlc skills: `ls ~/.claude/skills/developing-agentforce/SKILL.md 2>/dev/null`
   If not found, install them: `curl -sSL https://raw.githubusercontent.com/SalesforceAIResearch/agentforce-adlc/main/tools/install.sh | bash`
3. Check SF CLI auth: `sf org display user --json`
   Verify the response shows username `pmui+dx@salesforce.com` and orgId `00Dfj00000NCwB3EAL`.
   If not matching, run: `sf org login web --instance-url https://dfj00000ncwb3eal-dev-ed.develop.my.salesforce.com --set-default`

Use the installed agentforce-adlc skills for the full agent lifecycle.

I've deployed an agent called refund_support_agent to my org.

Set up and retrieve:
`sf project generate -n my-agent && cd my-agent`
`sf project retrieve start --metadata "AiAuthoringBundle:refund_support_agent"`

Use /developing-agentforce to discover targets, scaffold real backing actions (not stubs), and deploy. Then use /testing-agentforce to run smoke tests and create a test suite. Iterate until quality is solid.
