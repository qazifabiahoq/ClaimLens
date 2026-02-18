# ClaimLens

AI-Powered Insurance Claims Processing. Decisions in Minutes.

Live Demo: [https://claim-lens-xi.vercel.app](https://claim-lens-xi.vercel.app)

Blog post : https://builder.aws.com/post/39rTAiy3PknegtXV6n2csRB24yN_p/claimlens-accelerating-insurance-claims-with-amazon-nova


---

## The Problem

Filing an insurance claim after a car accident or property damage should be straightforward. Instead it usually means waiting days or weeks while an adjuster manually reviews your paperwork, schedules a physical inspection, researches repair costs, and writes up a report before anyone can tell you what your claim is worth.

This is not because adjusters are slow or bad at their jobs. It is because the entire workflow is manual by design. Every single claim requires a trained professional to read through unstructured information, look at photos, pull current pricing data, and turn all of it into a written recommendation. When you multiply that across thousands of claims a month, you get backlogs, delays, and a lot of frustrated people waiting on answers after an already stressful event.

The insurer absorbs the cost in adjuster labor hours. The claimant absorbs it in weeks of uncertainty.

ClaimLens was built to change that.

---

## What ClaimLens Does

ClaimLens is an AI claims processing platform that takes a claimant's submission, including their details and damage photos, and returns a complete adjuster-ready settlement recommendation in under two minutes.

The claimant fills out a form and uploads photos of the damage. Behind the scenes, four specialized AI agents work through the claim in sequence, each doing one job really well and passing their findings to the next. By the time the pipeline finishes, the output is a professional report with verified damage assessment, current regional repair cost estimates, cross-referenced findings, and a clear settlement recommendation.

Once the settlement recommendation is generated, the claimant can download the full settlement report directly from the platform.

There is also a "Discuss This" button where an AI chat pops up on the left side of the screen. The claimant can ask questions about the specific claim they submitted, and the AI responds using the structured findings from all four agents.

In addition, there is a "Connect to Human Adjuster" button where the claimant can email customer service directly if they want manual review or additional clarification.

The adjuster reviews it, confirms the deductible, and approves. What previously took hours of manual work now takes about ninety seconds.

---

## The Four AI Agents

This is what makes ClaimLens technically interesting. Rather than sending everything to a single AI model and hoping for a good answer, ClaimLens uses a multi-agent pipeline where each agent is specifically designed, prompted, and configured for one task. The output of each agent becomes the input context for the next.

**Agent 1 is the Intake Agent.**

It reads the raw claim submission and extracts every structured field: claimant name, policy number, date of incident, location, claim category, incident description, estimated loss value, and any third parties involved. It generates a unique claim ID, flags any missing required data, and packages everything cleanly for downstream processing. If something is missing from the form, it says so rather than guessing.

**Agent 2 is the Vision Agent.**

This agent receives the intake output along with the claimant's damage photos. It uses multimodal AI to analyze the images directly, identifying the type of damage, which components are affected, and how severe the damage looks. It checks whether the photographic evidence is actually consistent with what the claimant described. If it detects signs of pre-existing damage, it flags them. If the image quality is too poor to assess confidently, it reports that too. This agent only works from what it can see in the photos. It does not take the claimant's written description as proof of anything.

**Agent 3 is the Cost Research Agent.**

This agent receives the intake and vision outputs and researches what repairs will actually cost in the claimant's region right now. It produces an itemized breakdown covering each damaged component, labor hours, parts and materials, and supplemental costs like rental vehicles or storage. It adjusts for regional pricing differences and specifies whether each component needs repair or full replacement. Web search is enabled on this agent so it draws from live current market data rather than relying on training data that may be months out of date.

**Agent 4 is the Settlement Agent.**

This is the final synthesis step. The settlement agent receives everything the first three agents found and cross-references all of it. It checks whether the claim description, the photographic evidence, and the cost estimates are consistent with each other. If anything does not line up, it flags it. Then it produces a settlement disposition: Approve, Approve with Conditions, Escalate for Investigation, or Deny. The output includes a pre-deductible and post-deductible recommendation, specific guidance notes for the human adjuster, and a final status the adjuster can act on immediately.

---

## Why Multi-Agent Architecture

A single AI model given all four tasks at once tends to produce inconsistent and hard-to-audit results. Separating the work into four specialized agents means each one can be optimized and evaluated independently for exactly what it needs to do. The intake agent never has to think about repair costs. The vision agent never has to think about legal liability. The settlement agent has the benefit of three structured expert inputs before it makes any recommendation.

This approach also makes the system more transparent and auditable. Every step of the reasoning is visible and logged separately. When an adjuster reviews a ClaimLens report, they can see exactly what each agent found and why the final recommendation was made. That matters in an industry where compliance and documentation are non-negotiable.

---

## Who This Is Built For

On the business side, ClaimLens is designed for insurance operations teams that process large volumes of claims and want to reduce manual adjuster workload without cutting corners on accuracy or compliance. Auto insurers handling collision claims benefit immediately since damage photos and repair cost research are both fully automated. Property insurers handling home or commercial claims can use the same pipeline for structural and water damage.

For claimants, the benefit is simple. Faster processing means faster answers, faster repairs, and faster recovery after something that was already stressful enough.

---

## Technical Stack

The application is a full-stack web platform with a React and TypeScript frontend deployed on Vercel and a Node.js Express backend deployed on Render. All AI processing runs through Amazon Nova foundation models via the Amazon Nova Agent Platform.

The four agents are configured and published on nova.amazon.com. Each agent runs on a Nova foundation model with a custom system instruction set that defines its role, required output structure, and strict behavioral constraints. The agents are designed to produce clean structured professional output every time, not conversational filler text.

The backend orchestrates the pipeline sequentially. It calls each agent via the Nova API using the OpenAI-compatible SDK, passing each agent's structured output as context to the next one. The claimant's damage photo is sent to Agent 2 as a base64-encoded multimodal message. All API credentials are stored server-side only and never exposed to the client.

All AI functionality in ClaimLens runs exclusively through Amazon Nova. No other AI providers are used anywhere in the system.

---

## The Bigger Picture

The insurance industry processes hundreds of millions of claims every year. The labor cost of manual adjuster review runs into the billions. The human cost of slow processing falls on claimants who are already dealing with damaged property, disrupted routines, and financial stress after something went wrong in their lives.

ClaimLens demonstrates that the core claims workflow, intake, damage assessment, cost research, and settlement recommendation, can be fully automated for the majority of straightforward claims. This frees human adjusters to focus their expertise on complex cases, fraud investigation, and the edge cases that genuinely need human judgment.

A process that used to take hours now takes under two minutes. That is the whole point.

---

Built for the Amazon Nova AI Hackathon 2026, presented by Amazon Web Services.
