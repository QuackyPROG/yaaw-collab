# Scheduler and parallelism

The scheduler should optimize for correctness before concurrency.

## Eligibility

A task is schedulable only when:

- state is `ready`;
- dependencies are satisfied;
- required capabilities are available;
- resource locks permit execution;
- risk policy permits dispatch;
- budget remains;
- a compatible workspace can be created.

## Parallelism rule

Parallel work must be justified by dependency independence.

Research on agent systems shows that additional agents can improve decomposable work while coordination can degrade sequential work. YAAW Collab therefore models dependencies explicitly and exposes parallel branches rather than treating agent count as a performance setting.

## Worker selection

Selection may consider:

- capabilities;
- current load;
- project familiarity;
- task lineage familiarity;
- expected cost;
- observed reliability;
- context locality.

## Delegation limits

Production policy should bound:

- maximum child tasks;
- maximum delegation depth;
- maximum concurrent workers;
- task and project cost;
- retries;
- wall-clock execution.

Workers may propose decomposition without automatically receiving unlimited authority to create descendants.
