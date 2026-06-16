/* ============================================================
   SYMETA — cached AI insights (demo)
   ------------------------------------------------------------
   These strings are hand-authored in the voice/structure that
   Claude (Sonnet 4.6) produces for SYMETA reports. They are
   keyed by level (overall / lever / gear / style /
   driver) so the UI can show "AI interpreted summary at each
   level clicked", cached until the underlying data changes.

   tools/generate_insights.py overwrites this file with REAL
   Sonnet 4.6 output at build time — keep the shape identical:
     window.SYMETA_INSIGHTS = { generatedAt, model, people, teams, portfolio }
   ============================================================ */
window.SYMETA_INSIGHTS = {
  generatedAt: '2026-06-12',
  model: 'hand-authored (placeholder for claude-sonnet-4-6)',

  /* ---------------------------- PEOPLE ---------------------------- */
  people: {
    maya: {
      overall: 'Maya is a classic visionary founder. Her Thinking lever is exceptional — she sees opportunity, frames a compelling future, and translates it into strategy faster than almost anyone on her team. That same outward energy shows up in her Relating gears, where she inspires and persuades with ease. Her relative growth edge is Operating: turning the vision into repeatable operations is where she most benefits from a strong operating partner.',
      cornerstones: {
        cognition: 'A standout strength. Vision (92) and Strategy (84) both sit well above benchmark, reflecting an ability to spot novel connections and shape them into a competitive plan.',
        action: 'Solidly in range but her softest lever. Execution (55) trails her other strengths — the ideas are ahead of the operating system that delivers them.',
        relational: 'Strong. High Influence (86) and Collaboration (80) let her rally people around the vision; Direction is healthy.',
        motivational: 'In range. Drive is real, but Vitality (58) and energy management suggest she leads better with a co-founder sharing the load.',
      },
      pillars: {
        vision: { summary: 'Significantly above benchmark. Likely able to identify novel connections, analyse complex market dynamics, and develop a highly creative, compelling vision.',
          actions: ['Share the vision with passion and recruit others into its realisation.', 'Pressure-test the vision against evidence so it stays adaptable, not just aspirational.'] },
        execution: { summary: 'In the lower part of the benchmark band and her clearest development area. The gap between conception and consistent operation is where momentum leaks.',
          actions: ['Pair deliberately with Daniel’s operating strength — make ownership of delivery explicit.', 'Adopt one lightweight execution cadence (weekly priorities + review) and protect it.'] },
        influence: { summary: 'Above benchmark. Strong potential to move stakeholders under uncertainty.',
          actions: ['Use influence to unblock the team’s execution gaps, not only external buy-in.'] },
      },
      styles: {
        working: 'Flexible and curious, with a multi-task orientation — comfortable holding several threads, which aids vision but can dilute focus on delivery.',
        thinking: 'Strongly abstract, future- and systems-oriented, and optimistic — wired for strategy and the big picture.',
        social: 'Bold, connected and conflict-tolerant — leads from the front and is comfortable in hard conversations.',
        grit: 'Adaptable and uncertainty-tolerant; recovers reasonably from setbacks.',
      },
      drivers: 'Maya is energised by Building & Creating and Making an Impact, with strong intellectual and passion drivers. Work-Life balance scores low — a watch-item for sustainable pace.',
    },

    daniel: {
      overall: 'Daniel is the operating backbone of Northwind. His Operating and Adapting levers are excellent — he executes, decides under pressure, and simply does not quit. He complements Maya almost perfectly: where she conceives, he delivers. His development edge is Thinking; Vision (49) is his lowest gear, so he is at his best executing a direction someone else has set, and should lean on Maya for the "why".',
      cornerstones: {
        cognition: 'Below his other levers. Vision (49) sits at the bottom of the band — Daniel thinks concretely and tactically, which is a strength for delivery but means he relies on others to frame the future.',
        action: 'His signature strength. Execution (90) and Decision Making (82) are well above benchmark.',
        relational: 'Healthy. Direction (79) is strong — he is trusted to keep the team aligned to a plan.',
        motivational: 'Excellent. Vitality (84), Resilience (80) and Persisting (83) make him relentless and self-driving.',
      },
      pillars: {
        execution: { summary: 'Well above benchmark — a genuine strength. Builds processes, manages operations, and turns plans into reality.',
          actions: ['Codify what works into light SOPs so execution scales beyond you.', 'Mentor the team on prioritisation and accountability.'] },
        vision: { summary: 'At the bottom of the benchmark band and his lowest gear. Not a flaw — a complementary profile — but worth managing deliberately.',
          actions: ['Partner with Maya on direction-setting rather than generating vision solo.', 'Block time for future-oriented thinking to stretch the strategic muscle.'] },
        tenacity: { summary: 'Above benchmark. Strong capacity to weather problems and keep moving.', actions: ['Channel resilience into modelling healthy persistence for the team.'] },
      },
      styles: {
        working: 'Highly structured, single-task and decisive — an operator’s profile.',
        thinking: 'Concrete and tactical; processes information through the practical and immediate rather than the abstract.',
        social: 'Trusting and steady, slightly reserved — leads through reliability more than charisma.',
        grit: 'Composed, steadfast and risk-aware — calm under fire.',
      },
      drivers: 'Driven by Making an Impact and Building, with the most balanced Work-Life profile on the team — part of why he sustains intensity without burning out.',
    },

    priya: {
      overall: 'Priya is the team’s creative engine. Innovation (90) and Resourcefulness (85) are top-tier, and her Thinking is strong throughout — she generates and builds. The clear growth area is Relating: Collaboration (52) and Influence (55) are her lowest gears, consistent with an independent, heads-down working style. Investing in how she connects and communicates would multiply the impact of her technical strengths.',
      cornerstones: {
        cognition: 'Strong across the board, anchored by exceptional Resourcefulness (85).',
        action: 'Driven by outstanding Innovation (90); Execution and Decision Making are healthy.',
        relational: 'Her development lever. Collaboration (52) and Influence (55) trail — brilliant work can stall if it isn’t shared and championed.',
        motivational: 'Strong and self-sustaining; high Vitality supports deep work.',
      },
      pillars: {
        innovation: { summary: 'Well above benchmark — a defining strength. Identifies needs, generates solutions, and experiments.',
          actions: ['Build a lightweight system to capture and evaluate ideas so they don’t stay in your head.'] },
        collaboration: { summary: 'In the lower band and her lowest gear. An independent style is an asset for building but a constraint for a leadership role.',
          actions: ['Schedule recurring, structured touchpoints with Sam and Maya rather than relying on ad-hoc contact.', 'Narrate your work-in-progress early — visibility builds trust and unblocks the team.'] },
      },
      styles: {
        working: 'Structured and intensely curious — a builder who goes deep.',
        thinking: 'Highly abstract and systems-oriented; sees the whole architecture.',
        social: 'Independent, reserved and somewhat detached — prefers focus over interaction.',
        grit: 'Uncertainty-tolerant and adaptable; comfortable in ambiguity.',
      },
      drivers: 'Learning (92) and Building (90) dominate — Priya is fuelled by mastery and creation.',
    },

    sam: {
      overall: 'Sam is the connective tissue of the team. Collaboration (89), Influence (84) and Direction (80) are excellent — Sam builds relationships, aligns people, and carries the culture. The watch-item is Adapting: Resilience (47) and Persisting (50) are the team’s lowest, and Sam’s overall trajectory has dipped over the last three quarters. This is a resilience and energy signal worth addressing before it affects performance.',
      cornerstones: {
        cognition: 'In range and balanced — a generalist’s profile that supports the relational role well.',
        action: 'Steady and in range across the board.',
        relational: 'Exceptional — the strongest relational profile on the team.',
        motivational: 'The clearest development area, and trending down. Low Resilience (47) points to depleted energy reserves.',
      },
      pillars: {
        collaboration: { summary: 'Well above benchmark — exceptional potential to lead collaborative effort internally and externally.',
          actions: ['Use this strength to broker the connections Priya and the co-founders need.'] },
        intensity: { summary: 'Below benchmark and declining. Suggests energy and resource management is under strain.',
          actions: ['Protect recovery time deliberately; treat energy as a managed resource, not an afterthought.', 'Renegotiate scope before depletion becomes burnout — raise it early.'] },
        tenacity: { summary: 'At the edge of the band. Setback-recovery is currently effortful.',
          actions: ['Lean on the team’s structure (Daniel’s cadence) to reduce the load of pushing alone.'] },
      },
      styles: {
        working: 'Flexible, multi-task and people-led rather than process-led.',
        thinking: 'Optimistic and balanced; relational rather than analytical.',
        social: 'Highly connected, trusting and bold — the team’s relationship-builder.',
        grit: 'Expressive but slower to recover and more risk-aware — the grit profile to support.',
      },
      drivers: 'Motivated by Impact and Passion, with a healthier Work-Life driver — but current energy scores suggest the balance is under pressure in practice.',
    },

    alex: {
      overall: 'Alex is a powerful visionary founder — Vision (88), Influence (81) and Vitality (86) are all strengths. But the same profile carries Lumen’s central risk: Collaboration (44) is a liability and Execution (50) is thin, and these gaps are amplified because the co-founder shares an almost identical shape. Alex’s independence is an asset alone and a hazard in a two-person team that needs tight coordination.',
      cornerstones: {
        cognition: 'A strength. Vision (88) and Strategy (79) are well above benchmark.',
        action: 'In range but thin where it matters most — Execution (50) sits at the bottom of the band, and no one else on the two-person team covers it.',
        relational: 'Split. Influence (81) is strong outward, but Collaboration (44) is a liability inward — a dangerous combination in a co-founder pair.',
        motivational: 'Very high Vitality (86) — self-driving, but in a duo it can read as going it alone.',
      },
      pillars: {
        vision: { summary: 'Well above benchmark — a compelling, future-oriented founder.', actions: ['Convert vision into a shared, written plan a co-founder can act on independently.'] },
        collaboration: { summary: 'Below benchmark — a liability, and the single most important gear to develop given the team structure.',
          actions: ['Establish explicit decision rights and a weekly alignment ritual with Jordan.', 'Practise visible disagreement-and-commit so independence doesn’t become divergence.'] },
        execution: { summary: 'Bottom of the band. With both founders weak here, delivery has no clear owner.',
          actions: ['Assign execution ownership explicitly — or prioritise an operating hire.'] },
      },
      styles: {
        working: 'Curious, non-conforming and multi-task — an explorer, not an operator.',
        thinking: 'Strongly abstract and future-oriented; lives in possibility.',
        social: 'Independent and bold but low on connection — persuasive outward, harder to partner with inward.',
        grit: 'Risk-seeking and uncertainty-tolerant.',
      },
      drivers: 'Impact (88) and Building (86) lead, with very low Work-Life (34) — a high-burn profile.',
    },

    jordan: {
      overall: 'Jordan mirrors Alex more than complements him — high Vision (84), Innovation (80) and Vitality (83), with low Collaboration (47), Direction (54) and Execution (52). Two strong, independent visionaries with the same gaps is the core finding for Lumen: the team is doubly strong in Thinking and doubly exposed in Operating and inward Relating. The priority is structural — role clarity, an execution owner, and deliberate collaboration — not individual development alone.',
      cornerstones: {
        cognition: 'A strength, especially Vision (84) — but it overlaps almost entirely with Alex.',
        action: 'Driven by strong Innovation (80), yet Execution (52) and Decision Making (58) leave delivery under-owned.',
        relational: 'Collaboration (47) is a liability; Direction (54) is thin — alignment is fragile.',
        motivational: 'High Vitality (83) reinforces the two-founders-pulling-apart dynamic.',
      },
      pillars: {
        innovation: { summary: 'Above benchmark — strong technical creativity.', actions: ['Pair innovation with a delivery rhythm so prototypes become product.'] },
        collaboration: { summary: 'Below benchmark — a liability shared with the co-founder, which is what makes it acute.',
          actions: ['Co-create a responsibilities matrix with Alex to remove overlap and expose gaps.', 'Adopt a shared mental-model ritual: articulate goals and processes out loud, weekly.'] },
        direction: { summary: 'Thin. With both founders low here, the team can drift.', actions: ['Designate who owns company direction in which domain.'] },
      },
      styles: {
        working: 'Curious and exploratory, moderately structured.',
        thinking: 'Highly abstract and systems-oriented — a builder-architect.',
        social: 'Independent and somewhat detached — focus over connection.',
        grit: 'Adaptable and risk-tolerant.',
      },
      drivers: 'Learning (90) and Building (88) lead; low Work-Life (42) mirrors Alex — a shared burn risk.',
    },
  },

  /* ---------------------------- TEAMS ---------------------------- */
  teams: {
    alpha: {
      overall: 'Northwind is a well-composed founding team. Its four members cover all four levers with little wasted overlap: Maya drives Thinking, Daniel owns Operating, Priya supplies Innovation, and Sam anchors Relating. The team’s collective profile is balanced and broadly above benchmark — the kind of complementary spread that survives organisational crises.',
      composition: 'Balanced. Each lever has a clear owner, so strengths reinforce rather than duplicate. The averaged wheel hides this — drag individual members in and out to see how each one fills a specific quadrant.',
      complementary: 'Maya × Daniel is the engine: vision and strategy paired with execution and decisiveness. Priya extends the Thinking/Operating edge with exceptional Innovation and Resourcefulness. Sam multiplies all of it through best-in-team Collaboration and Influence.',
      conflicts: 'Two watch-items. (1) Priya’s independent, low-Collaboration style can isolate the technical work from the rest of the team. (2) Sam’s Adapting scores — Resilience (47), Persisting (50) — are the team’s lowest and trending down, a resilience risk concentrated in the person who holds the relationships. Energy management, not capability, is the team’s soft spot.',
      teamHealth: {
        overall: 'Team Health is healthy and improving across all three ABCs. Alliance (3.9) and Balance (3.7) are solid; Coordination (3.3) is the lowest but showing the most movement.',
        alliance: 'Strong and rising, led by Cohesion (4.1). Psychological Safety (3.5) is the component to keep nurturing.',
        balance: 'Role Clarity (4.2) is the team’s highest construct; Shared Mental Models plateaued this quarter and is worth a structured reset.',
        coordination: 'The development area. Team Communication (3.2) and Conflict Management (3.1) are lowest — formalise check-ins and constructive-conflict norms.',
      },
      nextSteps: [
        'Protect Sam’s energy: rebalance scope and build in recovery before depletion becomes burnout.',
        'Give Priya structured, recurring collaboration touchpoints rather than relying on ad-hoc contact.',
        'Install one shared execution + communication cadence (weekly priorities, blockers, a brief stand-up).',
      ],
    },
    beta: {
      overall: 'Lumen’s two co-founders are individually impressive and structurally misaligned. Both Alex and Jordan are strong, independent visionaries — high Vision, Innovation and Vitality — and both are weak in Collaboration, Execution and Direction. The team is doubly strong in Thinking and doubly exposed everywhere delivery and alignment live. This is the most common, and most lethal, early-stage pattern: two of the same person.',
      composition: 'Unbalanced and overlapping. The averaged wheel looks "spiky-strong" on Thinking and visibly thin on Operating and inward Relating. Because both founders share the same shape, no one covers the gaps — there is no operator and no clear owner of execution or direction.',
      complementary: 'Limited. The founders reinforce each other’s strengths (vision, innovation) but also reinforce each other’s gaps. Complementarity, the thing that makes Northwind resilient, is largely absent here.',
      conflicts: 'High structural risk. Two very high-Vitality founders with low Collaboration tend to diverge under pressure and avoid the hard alignment conversations (low Conflict-Tolerance, low Psychological Safety). Combined with no execution owner, the likely failure mode is drift and duplicated effort rather than blow-up.',
      teamHealth: {
        overall: 'Team Health is low across all three ABCs (Alliance 2.9, Balance 2.6, Coordination 2.8) and largely flat — the data corroborates the trait-level misalignment.',
        alliance: 'Psychological Safety (2.5) is the lowest construct — the founders are not yet safe enough with each other to surface disagreement.',
        balance: 'Role Clarity (2.4) is critically low — a direct symptom of two founders with the same profile and undefined boundaries.',
        coordination: 'Communication and conflict handling are weak; tensions are likely avoided rather than resolved.',
      },
      nextSteps: [
        'Run a co-founder alignment session and write down explicit decision rights and role boundaries.',
        'Assign a clear owner for execution — or prioritise an operating/delivery hire to fill the structural gap.',
        'Build psychological safety with a structured weekly feedback ritual before scaling the team.',
      ],
    },
  },

  /* ---------------------------- PORTFOLIO (tier 3) ---------------------------- */
  portfolio: {
    overall: 'Across the Spring cohort, the two startups present opposite human-capital profiles. Northwind is a balanced, complementary four-person team that is broadly above benchmark and improving — its risk is concentrated and manageable (one member’s energy). Lumen is two strong but near-identical founders whose shared gaps in Execution and Collaboration constitute a structural, team-level risk. Same cohort, very different readiness.',
    comparison: 'Northwind covers all four levers with distinct owners; Lumen is doubly strong in Thinking and doubly exposed in Operating and inward Relating. On Team Health, Northwind sits ~1.0 point higher on every ABC and is trending up, while Lumen is low and flat. If you are allocating coaching or capital attention, the two teams need very different interventions.',
    recommendations: [
      'Northwind: light-touch. Protect team resilience (Sam’s energy) and tighten the execution/communication cadence — otherwise on track.',
      'Lumen: high-touch and structural. Prioritise co-founder alignment, explicit role clarity, and an execution owner before any scaling. Re-assess in one quarter to confirm movement.',
      'Cohort lens: use the contrast as a teaching case — complementarity vs. duplication — in the next accelerator session.',
    ],
  },
};
