const stravaVc = {
  id: 'vp_token_with_strava_vc',
  input_descriptors: [
    {
      id: 'strava_vc',
      name: 'Strava VC type',
      purpose: 'Check if VC type is correct',
      constraints: {
        fields: [
          {
            path: ['$.type'],
            filter: {
              type: 'array',
              pattern: 'StravaExerciseDetails',
            },
          },
        ],
      },
    },
    {
      id: 'strava_vc_data',
      name: 'Strava VC data',
      purpose: 'Check if data contains necessary fields',
      constraints: {
        fields: [
          {
            path: ['$.credentialSubject.data.avgExerciseMinutesPerWeek'],
            purpose: 'Average exercise minutes per week',
            filter: {
              type: 'number',
              minimum: 0,
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
            path: ['$.type'],
            filter: {
              type: 'array',
              pattern: 'Email',
            },
          },
        ],
      },
    },
    {
      id: 'email_vc_data',
      name: 'Email VC data',
      purpose: 'Check if data contains necessary fields',
      constraints: {
        fields: [
          {
            path: ['$.credentialSubject.email'],
            purpose: 'Email address',
            filter: {
              type: 'string'
            },
          },
        ],
      },
    },
  ],
}

export const presentationDefinitions = {
  stravaVc,
  emailVc
} as const

