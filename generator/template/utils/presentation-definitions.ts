const fitnessVc = {
  id: 'vp_recent_fitness_activity_summary',
  input_descriptors: [
    {
      id: 'recent_fitness_activity_summary_vc',
      name: 'Recent Fitness Activity Summary VC type',
      purpose: 'To get Recent Fitness Activity Summary type',
      constraints: {
        fields: [
          {
            path: ['$.credentialSchema.id'],
            filter: {
              type: 'string',
              pattern: '^https:\\/\\/schema\\.affinidi\\.com\\/RecentFitnessActivitySummaryV1-0\\.json$'
            },
          },
        ],
      },
    },
  ],
}

const emailVc = {
  id: 'vp_token_with_email_vc',
  input_descriptors: [
    {
      id: 'email_vc',
      name: 'Email VC type',
      purpose: 'Check if VC type is correct',
      constraints: {
        fields: [
          {
            path: ['$.credentialSchema.id'],
            filter: {
              type: 'string',
              pattern: '^https:\\/\\/schema\\.affinidi\\.com\\/EmailV1-0\\.json$'
            },
          },
        ],
      },
    },
  ],
}

export const presentationDefinitions = {
  fitnessVc,
  emailVc,
} as const
