module.exports = {
  platforms: {
    composer: {
      packages: {
        'fanswoo/framework-core': {
          dev: false,
          source: {
            path: {
              path: '../framework-core',
            },
            github: {
              name: 'fanswoo/framework-core',
              branch: 'develop',
            },
          },
        },
      },
    },
    npm: {
      'dependence-namespace': '@fanswoo-dependence',
      'dependence-dist-directory': 'storage/framework/npm-dependence',
      packages: {
        '@fanswoo/core': {
          dev: false,
          source: {
            github: {
              name: 'fanswoo/framework-core-front',
              branch: 'develop',
            },
            path: {
              path: '../framework-core-front',
            },
            packagist: {
              version: '^1.0',
            },
          },
        },
        '@fanswoo/mix-manager': {
          dev: true,
          source: {
            github: {
              name: 'fanswoo/mix-manager',
              branch: 'develop',
            },
            path: {
              path: '../mix-manager',
            },
            packagist: {
              version: '^1.0',
            },
          },
        },
        '@fanswoo/workspace-environment': {
          dev: true,
          source: {
            github: {
              name: 'fanswoo/workspace-environment',
              branch: 'develop',
            },
            path: {
              path: '../workspace-environment',
            },
            packagist: {
              version: '^1.0',
            },
          },
        },
      },
    },
  },
};
