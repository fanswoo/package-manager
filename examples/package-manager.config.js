module.exports = {
  platforms: [
    {
      name: 'composer',
      packages: [
        {
          name: 'fanswoo/framework-core',
          dev: false,
          sources: [
            {
              source: 'path',
              path: '../framework-core',
            },
            {
              source: 'github',
              name: 'fanswoo/framework-core',
              branch: 'develop',
            },
          ],
        },
      ],
    },
    {
      name: 'npm',
      dependenceNamespace: '@fanswoo-dependence',
      dependenceDistDirectory: 'storage/framework/npm-dependence',
      packages: [
        {
          name: '@fanswoo/core',
          dev: false,
          sources: [
            {
              source: 'github',
              name: 'fanswoo/framework-core-front',
              branch: 'develop',
            },
            {
              source: 'path',
              path: '../framework-core-front',
            },
            {
              source: 'packagist',
              version: '^1.0',
            },
          ],
        },
        {
          name: '@fanswoo/mix-manager',
          dev: true,
          sources: [
            {
              source: 'github',
              name: 'fanswoo/mix-manager',
              branch: 'develop',
            },
            {
              source: 'path',
              path: '../mix-manager',
            },
            {
              source: 'packagist',
              version: '^1.0',
            },
          ],
        },
        {
          name: '@fanswoo/workspace-environment',
          dev: true,
          sources: [
            {
              source: 'github',
              name: 'fanswoo/workspace-environment',
              branch: 'develop',
            },
            {
              source: 'path',
              path: '../workspace-environment',
            },
            {
              source: 'packagist',
              version: '^1.0',
            },
          ],
        },
      ],
    },
  ],
};
